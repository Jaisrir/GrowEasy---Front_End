"use client";

import { FileText, RotateCcw } from "lucide-react";
import { RawCsvRow } from "@/lib/types";

export default function PreviewStep({
  fileName,
  headers,
  rows,
  onCancel,
  onConfirm,
  isImporting,
}: {
  fileName: string;
  headers: string[];
  rows: RawCsvRow[];
  onCancel: () => void;
  onConfirm: () => void;
  isImporting: boolean;
}) {
  return (
    <div className="ge-animate-in">
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <FileText size={18} color="var(--ge-ink-soft)" />
          <span className="text-sm font-medium" style={{ color: "var(--ge-ink)" }}>
            {fileName}
          </span>
          <span
            className="text-xs rounded-full px-2 py-0.5"
            style={{ background: "var(--ge-neutral-bg)", color: "var(--ge-ink-soft)" }}
          >
            {rows.length} rows detected
          </span>
        </div>
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 text-xs font-medium hover:underline"
          style={{ color: "var(--ge-ink-soft)" }}
        >
          <RotateCcw size={14} />
          Choose a different file
        </button>
      </div>

      <div
        className="ge-scroll rounded-xl border overflow-auto"
        style={{ borderColor: "var(--ge-line)", maxHeight: "420px" }}
      >
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              {headers.map((h) => (
                <th
                  key={h}
                  className="sticky top-0 z-10 whitespace-nowrap text-left font-semibold px-4 py-3 border-b"
                  style={{
                    background: "var(--ge-surface)",
                    borderColor: "var(--ge-line)",
                    color: "var(--ge-ink-soft)",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className="hover:bg-[var(--ge-bg)] transition-colors"
              >
                {headers.map((h) => (
                  <td
                    key={h}
                    className="whitespace-nowrap px-4 py-2.5 border-b"
                    style={{ borderColor: "var(--ge-line)" }}
                  >
                    {row[h] || (
                      <span style={{ color: "#c7cad4" }}>—</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs mt-3" style={{ color: "var(--ge-ink-soft)" }}>
        This is just a preview — nothing has been imported yet. AI mapping
        only runs after you confirm.
      </p>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onCancel}
          disabled={isImporting}
          className="rounded-lg px-5 py-2.5 text-sm font-medium border disabled:opacity-50"
          style={{ borderColor: "var(--ge-line)", color: "var(--ge-ink)" }}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isImporting}
          className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-60"
          style={{ background: "var(--ge-brand)" }}
        >
          {isImporting ? "Importing…" : "Confirm & Import"}
        </button>
      </div>
    </div>
  );
}
