"use client";

import { useState } from "react";

export default function UploadForm({ companyId }: { companyId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function upload() {
    if (!file) return;
    setBusy(true);
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`/api/companies/${companyId}/uploads`, {
      method: "POST",
      body: formData
    });

    const payload = (await response.json()) as { message?: string; error?: string; parsedText?: boolean };
    setMessage(payload.message ?? payload.error ?? "");
    setBusy(false);

    if (response.ok) {
      window.location.reload();
    }
  }

  async function analyze() {
    setBusy(true);
    const response = await fetch(`/api/companies/${companyId}/analyze`, {
      method: "POST"
    });

    const payload = (await response.json()) as { message?: string; error?: string };
    setMessage(payload.message ?? payload.error ?? "");
    setBusy(false);

    if (response.ok) {
      window.location.reload();
    }
  }

  return (
    <div className="grid gap-3">
      <input
        className="rounded-xl border px-3 py-2 text-sm"
        onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        type="file"
      />
      <div className="flex flex-wrap gap-3">
        <button className="rounded-xl border px-3 py-2 text-sm" disabled={!file || busy} onClick={upload}>
          Carica documento
        </button>
        <button className="rounded-xl bg-slate-900 px-3 py-2 text-sm text-white" disabled={busy} onClick={analyze}>
          Analizza documenti caricati
        </button>
      </div>
      <p className="text-xs text-slate-500">
        Parsing automatico già attivo per file testuali. Per PDF/DOCX la route è pronta ma il parser va esteso.
      </p>
      {message ? <div className="text-sm text-slate-600">{message}</div> : null}
    </div>
  );
}
