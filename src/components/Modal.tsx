"use client";

import { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity z-40"
        onClick={onClose}
        style={{ animation: "fadeIn 0.2s ease-out" }}
      />
      
      {/* Modal */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl mx-auto p-4 z-50 ge-animate-in"
        style={{ animation: "slideUp 0.3s ease-out" }}
      >
        <div
          className="rounded-2xl border shadow-xl overflow-hidden"
          style={{
            background: "var(--ge-surface)",
            borderColor: "var(--ge-line)",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-6 py-5 border-b"
            style={{
              borderColor: "var(--ge-line)",
              background: "linear-gradient(to right, var(--ge-bg), var(--ge-surface))"
            }}
          >
            <h2 className="text-lg font-semibold" style={{ color: "var(--ge-ink)" }}>
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg transition-all hover:bg-[var(--ge-line)] active:scale-95"
              aria-label="Close modal"
            >
              <X size={20} style={{ color: "var(--ge-ink-soft)" }} />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-8 max-h-[80vh] overflow-y-auto ge-scroll">
            {children}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translate(-50%, calc(-50% + 20px));
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }
      `}</style>
    </>
  );
}
