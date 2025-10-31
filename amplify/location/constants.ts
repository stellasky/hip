// Shared, stable names for AWS Location Service resources
// Include an optional environment suffix (AMplify Gen 2 sets AMPLIFY_ENV_NAME during deploy)
const ENV = (process.env.AMPLIFY_ENV_NAME || "dev").toLowerCase();
const BASE = "hip"; // Adjust if you want a different base prefix

function sanitize(name: string, maxLen: number) {
  return name.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, maxLen);
}

// AWS limits: PlaceIndex name max 100 chars, Map name max 50 chars
export const PLACE_INDEX_NAME = sanitize(`${BASE}-${ENV}-place-index`, 100);
export const MAP_NAME = sanitize(`${BASE}-${ENV}-map`, 50);

export default { PLACE_INDEX_NAME, MAP_NAME };
