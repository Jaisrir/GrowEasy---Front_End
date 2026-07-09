import { FileSpreadsheet } from "lucide-react";
import type { LeadRecord } from "@/lib/types";

const COLUMNS: Array<{ key: string; label: string }> = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "mobile_without_country_code", label: "Mobile" },
  { key: "company", label: "Company" },
  { key: "crm_status", label: "Status" },
  { key: "data_source", label: "Source" },
  { key: "created_at", label: "Created" },
];

function formatValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "string") return value;
  return String(value);
}

function getStatusColor(status: string | null | undefined): string {
  if (!status) return "var(--ge-neutral-bg)";
  const statusLower = String(status).toLowerCase();
  if (statusLower.includes("qualified")) return "#dbeafe";
  if (statusLower.includes("contacted")) return "#fef3e2";
  if (statusLower.includes("converted")) return "#eafaf0";
  if (statusLower.includes("lost")) return "#fdecec";
  return "var(--ge-neutral-bg)";
}

function getStatusTextColor(status: string | null | undefined): string {
  if (!status) return "var(--ge-ink-soft)";
  const statusLower = String(status).toLowerCase();
  if (statusLower.includes("qualified")) return "#0284c7";
  if (statusLower.includes("contacted")) return "#d97706";
  if (statusLower.includes("converted")) return "#16a34a";
  if (statusLower.includes("lost")) return "#dc2626";
  return "var(--ge-ink-soft)";
}

export default function LeadsTable({
  leads,
  isLoading,
}: {
  leads: LeadRecord[];
  isLoading?: boolean;
}) {
  return (
    <div
      className="rounded-2xl border shadow-sm ge-animate-in"
      style={{
        borderColor: "var(--ge-line)",
        background: "var(--ge-surface)",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)"
      }}
    >
      <div
        className="flex items-center justify-between gap-3 border-b px-6 py-5"
        style={{ borderColor: "var(--ge-line)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: "var(--ge-neutral-bg)" }}
          >
            <FileSpreadsheet size={16} color="var(--ge-ink-soft)" />
          </div>
          <h2 className="text-base font-semibold" style={{ color: "var(--ge-ink)" }}>
            Recent Leads
          </h2>
        </div>
        <span
          className="text-xs font-medium px-2.5 py-1 rounded-full"
          style={{ background: "var(--ge-neutral-bg)", color: "var(--ge-ink-soft)" }}
        >
          {leads.length} record{leads.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="overflow-x-auto ge-scroll">
        {isLoading ? (
          <div className="px-6 py-16 text-sm text-center" style={{ color: "var(--ge-ink-soft)" }}>
            <div className="inline-block animate-spin mr-2">⟳</div>
            Loading leads…
          </div>
        ) : leads.length === 0 ? (
          <div className="px-6 py-16 text-center" style={{ color: "var(--ge-ink-soft)" }}>
            <div
              className="flex h-12 w-12 items-center justify-center rounded-lg mx-auto mb-3"
              style={{ background: "var(--ge-neutral-bg)" }}
            >
              <FileSpreadsheet size={24} color="var(--ge-ink-soft)" />
            </div>
            <p className="text-sm font-medium" style={{ color: "var(--ge-ink)" }}>
              No leads have been imported yet
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--ge-ink-soft)" }}>
              Click the "Import CSV" button in the top-right to get started
            </p>
          </div>
        ) : (
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
              {leads.map((lead, index) => (
                <tr
                  key={lead.id ?? index}
                  className="transition-colors hover:bg-[var(--ge-bg)] border-b"
                  style={{ borderColor: "var(--ge-line)" }}
                >
                  {COLUMNS.map((column) => {
                    const value = lead[column.key as keyof LeadRecord];
                    const isStatus = column.key === "crm_status";
                    
                    return (
                      <td
                        key={column.key}
                        className="whitespace-nowrap px-6 py-4"
                        style={{ color: "var(--ge-ink)" }}
                      >
                        {isStatus ? (
                          <span
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                            style={{
                              background: getStatusColor(String(value)),
                              color: getStatusTextColor(String(value))
                            }}
                          >
                            {formatValue(value)}
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
        )}
      </div>
    </div>
  );
}
