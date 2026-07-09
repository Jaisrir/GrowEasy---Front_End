"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import LeadsTable from "@/components/LeadsTable";
import ResultsTable from "@/components/ResultsTable";
import ImportModal from "@/components/ImportModal";
import { LeadRecord } from "@/lib/types";
import { getLeads } from "@/lib/api";

// Sample data for demonstration
const SAMPLE_IMPORTED_RECORDS: LeadRecord[] = [
  {
    id: "sample-1",
    name: "John Doe",
    email: "john.doe@example.com",
    mobile_without_country_code: "9876543210",
    country_code: "+91",
    company: "GrowEasy",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    crm_status: "GOOD_LEAD_FOLLOW_UP",
    crm_note: "Client is asking to reschedule demo",
    data_source: "",
    created_at: "2026-05-13T14:20:48",
  },
  {
    id: "sample-2",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    mobile_without_country_code: "9876543211",
    country_code: "+91",
    company: "Tech Solutions",
    city: "Bangalore",
    state: "Karnataka",
    country: "India",
    crm_status: "DID_NOT_CONNECT",
    crm_note: "Person was busy, will try again next week",
    data_source: "",
    created_at: "2026-05-13T14:25:30",
  },
  {
    id: "sample-3",
    name: "Rajesh Patel",
    email: "rajesh.patel@example.com",
    mobile_without_country_code: "9876543212",
    country_code: "+91",
    company: "Startup Inc",
    city: "Delhi",
    state: "Delhi",
    country: "India",
    crm_status: "BAD_LEAD",
    crm_note: "Not interested in our services",
    data_source: "",
    created_at: "2026-05-13T14:30:15",
  },
  {
    id: "sample-4",
    name: "Priya Singh",
    email: "priya.singh@example.com",
    mobile_without_country_code: "9876543213",
    country_code: "+91",
    company: "Enterprise Corp",
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    crm_status: "SALE_DONE",
    crm_note: "Deal closed, onboarding in progress",
    data_source: "",
    created_at: "2026-05-13T14:35:22",
  },
];

export default function Home() {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importedRecords, setImportedRecords] = useState<LeadRecord[]>(SAMPLE_IMPORTED_RECORDS);

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
              background: "var(--ge-brand)",
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
