// components/upload-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Status =
  | { type: "idle"; text: "" }
  | { type: "success"; text: string }
  | { type: "error"; text: string };

export default function UploadForm({ companyId }: { companyId: string }) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>({ type: "idle", text: "" });
  const [busyAction, setBusyAction] = useState<"upload" | "analyze" | null>(null);

  async function upload() {
    if (!file) {
      setStatus({
        type: "error",
        text: "Seleziona un file prima di procedere con il caricamento.",
      });
      return;
    }

    try {
      setBusyAction("upload");
      setStatus({ type: "idle", text: "" });

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`/api/companies/${companyId}/uploads`, {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        setStatus({
          type: "error",
          text: payload.error ?? "Caricamento non completato.",
        });
        return;
      }

      setStatus({
        type: "success",
        text: payload.message ?? "Documento caricato correttamente.",
      });

      setFile(null);
      router.refresh();
    } catch {
      setStatus({
        type: "error",
        text: "Errore di rete durante il caricamento del file.",
      });
    } finally {
      setBusyAction(null);
    }
  }

  async function analyze() {
    try {
      setBusyAction("analyze");
      setStatus({ type: "idle", text: "" });

      const response = await fetch(`/api/companies/${companyId}/analyze`, {
        method: "POST",
      });

      const payload = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        setStatus({
          type: "error",
          text: payload.error ?? "Analisi non completata.",
        });
        return;
      }

      setStatus({
        type: "success",
        text: payload.message ?? "Analisi documenti completata.",
      });

      router.refresh();
    } catch {
      setStatus({
        type: "error",
        text: "Errore di rete durante l'analisi dei documenti.",
      });
    } finally {
      setBusyAction(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
        <label className="mb-2 block text-sm font-medium text-slate-800" htmlFor="file-upload">
          Seleziona documento
        </label>

        <input
          id="file-upload"
          className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          type="file"
        />

        <p className="mt-3 text-xs leading-5 text-slate-500">
          Supporto operativo già utile per file testuali, CSV, JSON e XML. La pipeline per PDF e
          DOCX è predisposta ma richiede parser contenutistici più completi.
        </p>
      </div>

      {file ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
          File selezionato: <span className="font-medium text-slate-900">{file.name}</span>
        </div>
      ) : null}

      {status.type !== "idle" ? (
        <div
          className={[
            "rounded-2xl border px-4 py-3 text-sm",
            status.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-800",
          ].join(" ")}
        >
          {status.text}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={busyAction !== null}
          onClick={upload}
          type="button"
        >
          {busyAction === "upload" ? "Caricamento in corso..." : "Carica documento"}
        </button>

        <button
          className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={busyAction !== null}
          onClick={analyze}
          type="button"
        >
          {busyAction === "analyze"
            ? "Analisi in corso..."
            : "Analizza documenti caricati"}
        </button>
      </div>
    </div>
  );
}
