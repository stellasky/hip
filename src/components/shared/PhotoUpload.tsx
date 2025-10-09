export function PhotoUpload({ maxBytes, onUpload }: { maxBytes: number; onUpload: (file: File) => void }) {
  return (
    <label>
      Upload Photo
      <input
        aria-label="upload photo"
        type="file"
        accept="image/*"
        onChange={(e) => {
          const f = e.currentTarget.files?.[0];
          if (!f) return;
          if (f.size > maxBytes) {
            // future: show validation message
            return;
          }
          onUpload(f);
        }}
      />
    </label>
  );
}
