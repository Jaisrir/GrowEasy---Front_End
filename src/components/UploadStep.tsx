"use client";

import { useCallback, useRef, useState } from "react";
import { UploadCloud, FileSpreadsheet, AlertCircle, Loader2 } from "lucide-react";

const MAX_SIZE_MB = 5;

export default function UploadStep({
  onFileSelected,
  isUploading,
}: {
  onFileSelected: (file: File) => void;
  isUploading?: boolean;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSend = useCallback(
    (file: File) => {
      setError(null);
      const isCsv =
        file.type === "text/csv" ||
        file.name.toLowerCase().endsWith(".csv");
      if (!isCsv) {
        setError("That doesn't look like a CSV file. Please pick a .csv file.");
        return;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`That file is too big. Max size is ${MAX_SIZE_MB}MB.`);
        return;
      }
      onFileSelected(file);
    },
    [onFileSelected]
  );

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (isUploading) return;
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSend(file);
  };

  return (
    <div className="ge-animate-in">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!isUploading) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !isUploading && inputRef.current?.click()}
        className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed px-6 py-16 text-center transition-colors"
        style={{
          borderColor: isDragging ? "var(--ge-brand)" : "var(--ge-line)",
          background: isDragging ? "#fff5f1" : "var(--ge-surface)",
          cursor: isUploading ? "wait" : "pointer",
          opacity: isUploading ? 0.7 : 1,
        }}
      >
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full"
          style={{ background: "var(--ge-neutral-bg)" }}
        >
          {isUploading ? (
            <Loader2 size={26} color="var(--ge-ink-soft)" className="animate-spin" />
          ) : (
            <UploadCloud size={26} color="var(--ge-ink-soft)" />
          )}
        </div>
        <div>
          <p className="text-base font-semibold" style={{ color: "var(--ge-ink)" }}>
            {isUploading ? "Reading your CSV…" : "Drop your CSV file here"}
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--ge-ink-soft)" }}>
            {isUploading ? "This will just take a moment" : "or click to browse files"}
          </p>
        </div>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
          style={{ background: "var(--ge-neutral-bg)", color: "var(--ge-ink-soft)" }}
        >
          <FileSpreadsheet size={14} />
          Supported file: .csv (max {MAX_SIZE_MB}MB)
        </span>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          hidden
          disabled={isUploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) validateAndSend(file);
            e.target.value = "";
          }}
        />
      </div>

      {error && (
        <div
          className="mt-4 flex items-center gap-2 rounded-lg px-4 py-3 text-sm"
          style={{ background: "var(--ge-bad-bg)", color: "var(--ge-bad)" }}
        >
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <p className="mt-4 text-xs text-center" style={{ color: "var(--ge-ink-soft)" }}>
        Works with Facebook Lead Ads, Google Ads, Excel exports, real-estate CRM
        exports, or any spreadsheet — our AI figures out the columns for you.
      </p>
    </div>
  );
}
