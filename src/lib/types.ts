// This file just describes the "shape" of our data.
// Think of it like a labeled box: it tells everyone what goes inside.

export type CrmStatus =
  | "GOOD_LEAD_FOLLOW_UP"
  | "DID_NOT_CONNECT"
  | "BAD_LEAD"
  | "SALE_DONE"
  | "";

export interface CrmLead {
  created_at?: string;
  name?: string;
  email?: string;
  country_code?: string;
  mobile_without_country_code?: string;
  company?: string;
  city?: string;
  state?: string;
  country?: string;
  lead_owner?: string;
  crm_status?: CrmStatus;
  crm_note?: string;
  data_source?: string;
  possession_time?: string;
  description?: string;
}

export interface SkippedRecord {
  original_row?: Record<string, string>;
  reason?: string;
}

export interface ImportError {
  type: string;
  details: string;
  code?: string | null;
  status?: number | null;
}

export interface ImportResponse {
  success: boolean;
  message: string;
  error: ImportError | null;
  successfully_parsed?: CrmLead[];
  skipped_records?: SkippedRecord[];
  total_imported?: number;
  total_skipped?: number;
  parsedRows?: CrmLead[];
  successfullyParsedRows?: CrmLead[];
  records?: CrmLead[];
  rows?: CrmLead[];
  skippedRows?: SkippedRecord[];
}

// This is exactly what POST /api/import sends back.
export interface ImportResult extends ImportResponse {}

export interface LeadRecord {
  id?: string | number;
  name?: string;
  email?: string;
  mobile_without_country_code?: string;
  company?: string;
  crm_status?: string;
  data_source?: string;
  created_at?: string;
  [key: string]: unknown;
}

// This is exactly what POST /api/upload sends back.
export interface UploadResult {
  rows: RawCsvRow[];
  totalRows: number;
  headers: string[];
}

// The raw CSV, before AI touches it. Just plain rows of text.
export type RawCsvRow = Record<string, string>;

export type StepId = "upload" | "preview" | "results";
