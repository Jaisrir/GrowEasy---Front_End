"use client";

import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { ImportResult, CrmStatus } from "@/lib/types";

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  GOOD_LEAD_FOLLOW_UP: { bg: "var(--ge-good-bg)", color: "var(--ge-good)", label: "Good Lead" },
  SALE_DONE: { bg: "var(--ge-good-bg)", color: "var(--ge-good)", label: "Sale Done" },
  DID_NOT_CONNECT: { bg: "var(--ge-warn-bg)", color: "var(--ge-warn)", label: "Not Dialed" },
  BAD_LEAD: { bg: "var(--ge-bad-bg)", color: "var(--ge-bad)", label: "Bad Lead" },
};

function StatusBadge({ status }: { status?: CrmStatus }) {
  const s = status && STATUS_STYLES[status];
  if (!s) {
    return (
      <span
        className="rounded-full px-2.5 py-1 text-xs font-medium"
        style={{ background: "var(--ge-neutral-bg)", color: "var(--ge-ink-soft)" }}
      >
        —
      </span>
    );
  }
  return (
    <span
      className="rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ background: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  );
}

const COLUMNS: { key: string; label: string }[] = [
  { key: "name", label: "Lead Name" },
  { key: "email", label: "Email" },
  { key: "mobile", label: "Contact" },
  { key: "created_at", label: "Date Created" },
  { key: "company", label: "Company" },
  { key: "crm_status", label: "Status" },
  { key: "data_source", label: "Source" },
  { key: "crm_note", label: "Note" },
];

export default function ResultsStep({
  result,
  onImportAnother,
}: {
  result: ImportResult;
  onImportAnother: () => void;
}) {
  const statusTone = result.success
    ? { bg: "var(--ge-good-bg)", color: "var(--ge-good)" }
    : { bg: "var(--ge-warn-bg)", color: "var(--ge-warn)" };

  return (
    <div className="ge-animate-in">
      <div
        className="rounded-xl border p-4 mb-6"
        style={{ borderColor: result.success ? "var(--ge-good)" : "var(--ge-warn)", background: statusTone.bg }}
      >
        <p className="text-sm font-semibold" style={{ color: statusTone.color }}>
          {result.success ? "Import completed" : "Import completed with issues"}
        </p>
        <p className="mt-1 text-sm" style={{ color: "var(--ge-ink-soft)" }}>
          {result.message || (result.success ? "All rows were processed successfully." : "Some rows were skipped during import.")}
        </p>
        {result.error?.details && (
          <p className="mt-2 text-xs" style={{ color: "var(--ge-ink-soft)" }}>
            {result.error.details}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 mb-6">
        <div
          className="rounded-xl border p-4 flex items-center gap-3"
          style={{ borderColor: "var(--ge-line)", background: "var(--ge-surface)" }}
        >
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ background: "var(--ge-good-bg)" }}
          >
            <CheckCircle2 size={20} color="var(--ge-good)" />
          </div>
          <div>
            <p className="text-xl font-bold" style={{ color: "var(--ge-ink)" }}>
              {result.total_imported}
            </p>
            <p className="text-xs" style={{ color: "var(--ge-ink-soft)" }}>
              Total imported
            </p>
          </div>
        </div>
        <div
          className="rounded-xl border p-4 flex items-center gap-3"
          style={{ borderColor: "var(--ge-line)", background: "var(--ge-surface)" }}
        >
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ background: "var(--ge-bad-bg)" }}
          >
            <XCircle size={20} color="var(--ge-bad)" />
          </div>
          <div>
            <p className="text-xl font-bold" style={{ color: "var(--ge-ink)" }}>
              {result.total_skipped}
            </p>
            <p className="text-xs" style={{ color: "var(--ge-ink-soft)" }}>
              Total skipped
            </p>
          </div>
        </div>
      </div>

      <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--ge-ink)" }}>
        Successfully parsed records
      </h3>
      <div
        className="ge-scroll rounded-xl border overflow-auto mb-6"
        style={{ borderColor: "var(--ge-line)", maxHeight: "380px" }}
      >
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              {COLUMNS.map((c) => (
                <th
                  key={c.key}
                  className="sticky top-0 z-10 whitespace-nowrap text-left font-semibold px-4 py-3 border-b"
                  style={{
                    background: "var(--ge-surface)",
                    borderColor: "var(--ge-line)",
                    color: "var(--ge-ink-soft)",
                  }}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(result.successfully_parsed ?? []).length === 0 ? (
              <tr>
                <td
                  colSpan={COLUMNS.length}
                  className="px-4 py-8 text-center text-sm"
                  style={{ color: "var(--ge-ink-soft)" }}
                >
                  No records were successfully parsed.
                </td>
              </tr>
            ) : (
              (result.successfully_parsed ?? []).map((r, i) => (
                <tr key={i} className="hover:bg-[var(--ge-bg)] transition-colors">
                  <td className="px-4 py-2.5 border-b whitespace-nowrap font-medium" style={{ borderColor: "var(--ge-line)" }}>
                    {r.name || "—"}
                  </td>
                  <td className="px-4 py-2.5 border-b whitespace-nowrap" style={{ borderColor: "var(--ge-line)" }}>
                    {r.email || "—"}
                  </td>
                  <td className="px-4 py-2.5 border-b whitespace-nowrap" style={{ borderColor: "var(--ge-line)" }}>
                    {r.mobile_without_country_code
                      ? `${r.country_code || ""} ${r.mobile_without_country_code}`
                      : "—"}
                  </td>
                  <td className="px-4 py-2.5 border-b whitespace-nowrap" style={{ borderColor: "var(--ge-line)" }}>
                    {r.created_at || "—"}
                  </td>
                  <td className="px-4 py-2.5 border-b whitespace-nowrap" style={{ borderColor: "var(--ge-line)" }}>
                    {r.company || "—"}
                  </td>
                  <td className="px-4 py-2.5 border-b whitespace-nowrap" style={{ borderColor: "var(--ge-line)" }}>
                    <StatusBadge status={r.crm_status} />
                  </td>
                  <td className="px-4 py-2.5 border-b whitespace-nowrap" style={{ borderColor: "var(--ge-line)" }}>
                    {r.data_source || "—"}
                  </td>
                  <td className="px-4 py-2.5 border-b max-w-[220px] truncate" style={{ borderColor: "var(--ge-line)" }} title={r.crm_note}>
                    {r.crm_note || "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {(result.skipped_records ?? []).length > 0 && (
        <>
          <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--ge-ink)" }}>
            Skipped records
          </h3>
          <div
            className="ge-scroll rounded-xl border overflow-auto mb-6"
            style={{ borderColor: "var(--ge-line)", maxHeight: "260px" }}
          >
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="sticky top-0 z-10 text-left font-semibold px-4 py-3 border-b" style={{ background: "var(--ge-surface)", borderColor: "var(--ge-line)", color: "var(--ge-ink-soft)" }}>
                    Row data
                  </th>
                  <th className="sticky top-0 z-10 text-left font-semibold px-4 py-3 border-b" style={{ background: "var(--ge-surface)", borderColor: "var(--ge-line)", color: "var(--ge-ink-soft)" }}>
                    Reason skipped
                  </th>
                </tr>
              </thead>
              <tbody>
                {(result.skipped_records ?? []).map((s, i) => (
                  <tr key={i} className="hover:bg-[var(--ge-bg)] transition-colors">
                    <td className="px-4 py-2.5 border-b text-xs" style={{ borderColor: "var(--ge-line)", color: "var(--ge-ink-soft)" }}>
                      {s.original_row ? JSON.stringify(s.original_row) : "—"}
                    </td>
                    <td className="px-4 py-2.5 border-b whitespace-nowrap" style={{ borderColor: "var(--ge-line)" }}>
                      <span
                        className="rounded-full px-2.5 py-1 text-xs font-medium"
                        style={{ background: "var(--ge-bad-bg)", color: "var(--ge-bad)" }}
                      >
                        {s.reason || "No email or mobile number"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className="flex justify-end">
        <button
          onClick={onImportAnother}
          className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white"
          style={{ background: "var(--ge-brand)" }}
        >
          <RotateCcw size={16} />
          Import another CSV
        </button>
      </div>
    </div>
  );
}
