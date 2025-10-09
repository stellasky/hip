import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { visitService } from '../services/visitService';

type VisitedContextValue = {
  visitedIds: string[];
  isVisited: (id: string) => boolean;
  toggleVisited: (id: string) => void;
};

const VisitedContext = createContext<VisitedContextValue | undefined>(undefined);

export function VisitedProvider({ children }: { children: React.ReactNode }) {
  const [visitedIds, setVisitedIds] = useState<string[]>([]);
  const [visitMap, setVisitMap] = useState<Record<string, { id: string; visited: boolean }>>({});
  const [userId, setUserId] = useState<string | null>(null);
  const ampliyVisits = (import.meta as any)?.env?.VITE_USE_AMPLIFY_VISITS === 'true';
  const loadedRef = useRef(false);

  useEffect(() => {
    if (!ampliyVisits || loadedRef.current) return;
    loadedRef.current = true;
    (async () => {
      try {
        // dynamic import avoids bundling in tests without the flag
        const { getCurrentUser } = await import('aws-amplify/auth');
        const u = await getCurrentUser();
        const uid = (u as any)?.userId || (u as any)?.username;
        if (!uid) return;
        setUserId(uid);
        const res = await visitService.listVisitsByUser(uid);
        const items: any[] = res.data ?? [];
        const ids = items.filter(v => v.visited).map(v => v.poiId);
        const map: Record<string, { id: string; visited: boolean }> = {};
        items.forEach(v => { map[v.poiId] = { id: v.id, visited: v.visited }; });
        setVisitMap(map);
        setVisitedIds(ids);
      } catch {
        // ignore if auth not available or not signed in
      }
    })();
  }, [ampliyVisits]);
  const value = useMemo<VisitedContextValue>(() => ({
    visitedIds,
    isVisited: (id: string) => visitedIds.includes(id),
    toggleVisited: (poiId: string) => {
      setVisitedIds(v => v.includes(poiId) ? v.filter(x => x !== poiId) : [...v, poiId]);
      if (ampliyVisits && userId) {
        const existing = visitMap[poiId];
        const nextVisited = !visitedIds.includes(poiId);
        (async () => {
          try {
            if (existing) {
              const res = await visitService.updateVisit({ id: existing.id, visited: nextVisited });
              const updated = res.data as any;
              setVisitMap(m => ({ ...m, [poiId]: { id: existing.id, visited: updated?.visited ?? nextVisited } }));
            } else if (nextVisited) {
              const res = await visitService.createVisit({ userId, poiId, visited: true });
              const created = res.data as any;
              setVisitMap(m => ({ ...m, [poiId]: { id: created?.id ?? `local-${poiId}`, visited: true } }));
            }
          } catch {
            // swallow errors for optimistic UI
          }
        })();
      }
    },
  }), [visitedIds, ampliyVisits, userId, visitMap]);

  return <VisitedContext.Provider value={value}>{children}</VisitedContext.Provider>;
}

export function useVisited() {
  const ctx = useContext(VisitedContext);
  if (!ctx) throw new Error('useVisited must be used within VisitedProvider');
  return ctx;
}
