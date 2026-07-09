"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import Stepper from "@/components/Stepper";
import UploadStep from "@/components/UploadStep";
import PreviewStep from "@/components/PreviewStep";
import ResultsStep from "@/components/ResultsStep";
import { ImportResponse, ImportResult, RawCsvRow, StepId, UploadResult, LeadRecord } from "@/lib/types";
import { importLeads, uploadCsv } from "@/lib/api";
import { AlertCircle } from "lucide-react";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (parsedRecords: LeadRecord[]) => void;
}

export default function ImportModal({ isOpen, onClose, onSuccess }: ImportModalProps) {
  const [step, setStep] = useState<StepId>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<RawCsvRow[]>([]);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedRecords, setParsedRecords] = useState<LeadRecord[]>([]);

  const handleFileSelected = async (selectedFile: File) => {
    setError(null);
    setIsUploading(true);
    try {
      const data: UploadResult = await uploadCsv(selectedFile);
      if (!data.headers || data.headers.length === 0) {
        setError("We couldn't find any columns in that CSV. Please check the file.");
        return;
      }
      setFile(selectedFile);
      setHeaders(data.headers);
      setRows(data.rows);
      setStep("preview");
    } catch (err) {
      setError(
        err instanceof Error
          ? `Upload failed: ${err.message}`
          : "Upload failed. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirm = async () => {
    setIsImporting(true);
    setError(null);
    try {
      const data: ImportResponse = await importLeads(rows);

      const parsedRows =
        (Array.isArray(data.parsedRows) && data.parsedRows.length > 0
          ? data.parsedRows
          : Array.isArray(data.successfullyParsedRows) && data.successfullyParsedRows.length > 0
            ? data.successfullyParsedRows
            : Array.isArray(data.records) && data.records.length > 0
              ? data.records
              : Array.isArray(data.rows) && data.rows.length > 0
                ? data.rows
                : data.successfully_parsed) ?? [];

      const skippedRows =
        (Array.isArray(data.skippedRows) && data.skippedRows.length > 0
          ? data.skippedRows
          : data.skipped_records) ?? [];

      const importResult: ImportResult = {
        success: data.success,
        message: data.message || "Import completed.",
        error: data.error ?? null,
        successfully_parsed: parsedRows as ImportResult["successfully_parsed"],
        skipped_records: skippedRows as ImportResult["skipped_records"],
        total_imported: data.total_imported ?? 0,
        total_skipped: data.total_skipped ?? 0,
      };

      setResult(importResult);
      setParsedRecords(parsedRows as LeadRecord[]);
      setError(importResult.success ? null : importResult.message || "Import completed with issues.");
      setStep("results");
    } catch (err) {
      setError(
        err instanceof Error
          ? `Import failed: ${err.message}`
          : "Import failed. Please try again."
      );
    } finally {
      setIsImporting(false);
    }
  };

  const handleReset = () => {
    setStep("upload");
    setFile(null);
    setHeaders([]);
    setRows([]);
    setResult(null);
    setError(null);
    setParsedRecords([]);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleSuccessClose = () => {
    onSuccess?.(parsedRecords);
    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={step === "results" ? "Import Complete" : "Import Leads from CSV"}
    >
      <div className="ge-animate-in">
        <div className="mb-8">
          <Stepper current={step} />
        </div>

        {error && (
          <div
            className="mb-5 flex items-center gap-2 rounded-lg px-4 py-3 text-sm"
            style={{ background: "var(--ge-bad-bg)", color: "var(--ge-bad)" }}
          >
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {step === "upload" && (
          <UploadStep onFileSelected={handleFileSelected} isUploading={isUploading} />
        )}

        {step === "preview" && file && (
          <PreviewStep
            fileName={file.name}
            headers={headers}
            rows={rows}
            onCancel={handleReset}
            onConfirm={handleConfirm}
            isImporting={isImporting}
          />
        )}

        {step === "results" && result && (
          <ResultsStep result={result} onImportAnother={handleReset} />
        )}

        {step === "results" && result && (
          <div className="flex gap-3 justify-end mt-6 border-t pt-6" style={{ borderColor: "var(--ge-line)" }}>
            <button
              onClick={handleSuccessClose}
              className="px-6 py-2 rounded-lg font-medium transition-colors"
              style={{
                background: "var(--ge-brand)",
                color: "#fff",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--ge-brand-hover)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "var(--ge-brand)"}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
