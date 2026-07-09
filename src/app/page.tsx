"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import LeadsTable from "@/components/LeadsTable";
import ResultsTable from "@/components/ResultsTable";
import ImportModal from "@/components/ImportModal";
import { LeadRecord } from "@/lib/types";
import { getLeads } from "@/lib/api";

export default function Home() {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importedRecords, setImportedRecords] = useState<LeadRecord[]>([]);

  // Load leads on mount
  const loadLeads = async () => {
    setIsLoadingLeads(true);
    try {
      const data = await getLeads();
      const nextLeads = Array.isArray(data)
        ? (data as LeadRecord[])
        : ((data as { leads?: LeadRecord[] } | null)?.leads ?? []);
      setLeads(nextLeads as LeadRecord[]);
    } catch {
      setLeads([]);
    } finally {
      setIsLoadingLeads(false);
    }
  };

  useEffect(() => {
    void loadLeads();
  }, []);

  const handleImportSuccess = (parsedRecords: LeadRecord[]) => {
    setImportedRecords(parsedRecords);
    void loadLeads();
  };

  return (
    <main className="min-h-screen flex flex-col px-4 py-8 sm:py-12">
      {/* Header with Logo and Import Button */}
      <div className="flex items-center justify-between mb-10 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg font-bold text-lg"
            style={{
              background: "#000000de",
              color: "#fff",
              boxShadow: "0 4px 12px rgba(255, 106, 69, 0.2)"
            }}
          >
            G
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: "var(--ge-ink)" }}>
              GrowEasy
            </h1>
            <p className="text-xs" style={{ color: "var(--ge-ink-soft)" }}>
              Leads Management
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsImportModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all hover:shadow-md"
          style={{
            background: "var(--ge-brand)",
            color: "#fff",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--ge-brand-hover)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--ge-brand)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <Plus size={18} />
          <span>Import CSV</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto w-full">
        {/* Successfully Parsed Records */}
        <ResultsTable
          records={importedRecords}
          onClear={() => setImportedRecords([])}
        />

        {/* Recent Leads Table */}
        <LeadsTable leads={leads} isLoading={isLoadingLeads} />
      </div>

      {/* Import Modal */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={handleImportSuccess}
      />
    </main>
  );
}
