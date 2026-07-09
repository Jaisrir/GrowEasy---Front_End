import type { ImportResponse, RawCsvRow } from "@/lib/types";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

function buildApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}/api${normalizedPath}`;
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(buildApiUrl(path), init);
  const responseText = await res.text();

  if (!res.ok) {
    throw new Error(responseText || `Server responded with ${res.status}`);
  }

  if (!responseText) {
    return {} as T;
  }

  try {
    return JSON.parse(responseText) as T;
  } catch {
    throw new Error(responseText || "Unexpected response from server");
  }
}

export async function uploadCsv(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return requestJson<{ headers: string[]; rows: RawCsvRow[]; totalRows: number }>('/upload', {
    method: "POST",
    body: formData,
  });
}

export async function importLeads(rows: RawCsvRow[]) {
  return requestJson<ImportResponse>('/import', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rows }),
  });
}

export async function getLeads() {
  return requestJson('/leads');
}

export async function deleteLead(id: string | number) {
  return requestJson(`/leads/${id}`, {
    method: "DELETE",
  });
}
