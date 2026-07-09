"use client";

import { Trash2, CheckCircle2 } from "lucide-react";
import type { LeadRecord } from "@/lib/types";

const COLUMNS: Array<{ key: string; label: string }> = [
  { key: "name", label: "Lead Name" },
  { key: "email", label: "Email" },
  { key: "mobile_without_country_code", label: "Contact" },
  { key: "created_at", label: "Date Created" },
  { key: "company", label: "Company" },
  { key: "crm_status", label: "Status" },
  { key: "data_source", label: "Source" },
  { key: "crm_note", label: "Note" },
];

function formatValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "string") return value;
  return String(value);
}

function getStatusColor(status: string | null | undefined): string {
  if (!status) return "var(--ge-neutral-bg)";
  const statusLower = String(status).toLowerCase();
  if (statusLower.includes("good_lead") || statusLower.includes("good lead")) return "#dbeafe";
  if (statusLower.includes("did_not_connect") || statusLower.includes("not dialed")) return "#fef3e2";
  if (statusLower.includes("sale_done") || statusLower.includes("converted")) return "#eafaf0";
  if (statusLower.includes("bad_lead") || statusLower.includes("bad lead")) return "#fdecec";
  return "var(--ge-neutral-bg)";
}

function getStatusTextColor(status: string | null | undefined): string {
  if (!status) return "var(--ge-ink-soft)";
  const statusLower = String(status).toLowerCase();
  if (statusLower.includes("good_lead") || statusLower.includes("good lead")) return "#0284c7";
  if (statusLower.includes("did_not_connect") || statusLower.includes("not dialed")) return "#d97706";
  if (statusLower.includes("sale_done") || statusLower.includes("converted")) return "#16a34a";
  if (statusLower.includes("bad_lead") || statusLower.includes("bad lead")) return "#dc2626";
  return "var(--ge-ink-soft)";
}

function getStatusLabel(status: string | null | undefined): string {
  if (!status) return "—";
  const statusLower = String(status).toLowerCase();
  if (statusLower.includes("good_lead")) return "Good Lead";
  if (statusLower.includes("did_not_connect")) return "Not Dialed";
  if (statusLower.includes("sale_done")) return "Sale Done";
  if (statusLower.includes("bad_lead")) return "Bad Lead";
  return String(status);
}

export default function ResultsTable({
  records,
  onClear,
}: {
  records: LeadRecord[];
  onClear?: () => void;
}) {
  if (records.length === 0) return null;

  return (
    <div className="rounded-2xl border shadow-sm mb-8 ge-animate-in overflow-hidden" style={{
      borderColor: "var(--ge-line)",
      background: "var(--ge-surface)",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)"
    }}>
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b px-6 py-5" style={{ borderColor: "var(--ge-line)", background: "linear-gradient(to right, #eafaf0, var(--ge-surface))" }}>
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: "var(--ge-good-bg)" }}
          >
            <CheckCircle2 size={16} color="var(--ge-good)" />
          </div>
          <h2 className="text-base font-semibold" style={{ color: "var(--ge-ink)" }}>
            Successfully Parsed Records
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="text-xs font-medium px-2.5 py-1 rounded-full"
            style={{ background: "var(--ge-good-bg)", color: "var(--ge-good)" }}
          >
            {records.length} record{records.length === 1 ? "" : "s"}
          </span>
          {onClear && (
            <button
              onClick={onClear}
              className="p-1.5 rounded-lg transition-colors hover:bg-[var(--ge-bad-bg)]"
              title="Clear results"
            >
              <Trash2 size={16} color="var(--ge-ink-soft)" />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto ge-scroll">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr style={{ background: "var(--ge-bg)" }}>
              {COLUMNS.map((column) => (
                <th
                  key={column.key}
                  className="whitespace-nowrap px-6 py-4 text-left font-semibold"
                  style={{
                    borderBottom: "1px solid var(--ge-line)",
                    color: "var(--ge-ink-soft)",
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr
                key={record.id ?? index}
                className="transition-colors hover:bg-[var(--ge-bg)] border-b"
                style={{ borderColor: "var(--ge-line)" }}
              >
                {COLUMNS.map((column) => {
                  const value = record[column.key as keyof LeadRecord];
                  const isStatus = column.key === "crm_status";
                  
                  return (
                    <td
                      key={column.key}
                      className="whitespace-nowrap px-6 py-4"
                      style={{ color: "var(--ge-ink)" }}
                      title={typeof value === "string" && value.length > 50 ? value : ""}
                    >
                      {isStatus ? (
                        <span
                          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                          style={{
                            background: getStatusColor(String(value)),
                            color: getStatusTextColor(String(value))
                          }}
                        >
                          {getStatusLabel(String(value))}
                        </span>
                      ) : column.key === "created_at" ? (
                        <span title={formatValue(value)}>
                          {typeof value === "string" ? value.split("T")[0] : formatValue(value)}
                        </span>
                      ) : (
                        formatValue(value)
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
