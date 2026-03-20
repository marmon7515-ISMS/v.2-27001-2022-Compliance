// file: components/upload-form.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type UploadResponse = {
  message?: string;
  error?: string;
  parsedText?: boolean;
};

type MessageTone = "success" | "error" | "info";

function getMessageClasses(tone: MessageTone) {
  switch (tone) {
    case "success":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "error":
      return "border-rose-200 bg-rose-50 text-rose-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

export default function UploadForm({ companyId }: { companyId: string }) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [busyAction, setBusyAction] = useState<"upload" | "analyze" | null>(null);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<MessageTone>("info");

  const selectedFileSummary = useMemo(() => {
    if (!file) {
      return "Nessun file selezionato.";
    }

    const sizeKb = Math.max(1, Math.round(file.size / 1024));
    return `${file.name} · ${sizeKb} KB`;
  }, [file]);

  async function handleResponse(response: Response) {
    const payload = (await response.json()) as UploadResponse;
    const text =
      payload.message ??
      payload.error ??
      (response.ok
        ? "Operazione completata con successo."
        : "Operazione non riuscita.");

    setMessage(text);
    setMessageTone(response.ok ? "success" : "error");

    if (response.ok) {
      router.refresh();
    }
  }

  async function upload() {
    if (!file || busyAction) {
      return;
    }

    setBusyAction("upload");
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`/api/companies/${companyId}/uploads`, {
        method: "POST",
        body: formData,
      });

      await handleResponse(response);

      if (response.ok) {
        setFile(null);
      }
    } catch {
      setMessage("Errore di rete durante il caricamento del documento.");
      setMessageTone("error");
    } finally {
      setBusyAction(null);
    }
  }

  async function analyze() {
    if (busyAction) {
      return;
    }

    setBusyAction("analyze");
    setMessage("");

    try {
      const response = await fetch(`/api/companies/${companyId}/analyze`, {
        method: "POST",
      });

      await handleResponse(response);
    } catch {
      setMessage("Errore di rete durante l'analisi dei documenti caricati.");
      setMessageTone("error");
    } finally {
      setBusyAction(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <label
          htmlFor="documento-cliente"
          className="block text-sm font-medium text-slate-800"
        >
          Seleziona un documento
        </label>

        <input
          id="documento-cliente"
          type="file"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-slate-800"
          aria-describedby="documento-cliente-aiuto"
        />

        <p id="documento-cliente-aiuto" className="text-sm text-slate-500">
          Carica policy, procedure, evidenze, registri o altra documentazione utile.
        </p>

        <p className="text-sm text-slate-600">{selectedFileSummary}</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-medium text-slate-900">Analisi automatica</p>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Il parsing automatico è già attivo per file testuali, CSV, JSON e XML.
          La pipeline per PDF e DOCX è predisposta, ma il parser contenuti va ancora esteso.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={upload}
          disabled={!file || busyAction !== null}
          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busyAction === "upload" ? "Caricamento in corso..." : "Carica documento"}
        </button>

        <button
          type="button"
          onClick={analyze}
          disabled={busyAction !== null}
          className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busyAction === "analyze" ? "Analisi in corso..." : "Analizza documenti caricati"}
        </button>
      </div>

      {message ? (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${getMessageClasses(messageTone)}`}
          role="status"
          aria-live="polite"
        >
          {message}
        </div>
      ) : null}
    </div>
  );
}
