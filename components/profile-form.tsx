"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"

type Profile = {
  cloudServices: boolean;
  softwareDevelopment: boolean;
  suppliersCritical: boolean;
  remoteWorkforce: boolean;
  physicalOfficeControl: boolean;
  criticalProcesses: boolean;
  personalData: boolean;
  regulatedSector: boolean;
  customerDescription: string;
  uploadedContext: string;
};

const labels: Record<keyof Omit<Profile, "customerDescription" | "uploadedContext">, string> = {
  cloudServices: "Servizi cloud",
  softwareDevelopment: "Sviluppo software interno",
  suppliersCritical: "Fornitori critici",
  remoteWorkforce: "Lavoro remoto/ibrido",
  physicalOfficeControl: "Controllo fisico sedi",
  criticalProcesses: "Processi critici",
  personalData: "Dati personali/sensibili",
  regulatedSector: "Settore regolamentato"
};

export default function ProfileForm({
  companyId,
  profile
}: {
  companyId: string;
  profile: Profile;
}) {
  const [form, setForm] = useState(profile);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter(); 

  async function saveOnly() {
    setBusy(true);
    const response = await fetch(`/api/companies/${companyId}/profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const payload = (await response.json()) as { message?: string; error?: string };
    setMessage(payload.message ?? payload.error ?? "");
    setBusy(false);
  }

  async function rebuild() {
    setBusy(true);
    const response = await fetch(`/api/companies/${companyId}/rebuild`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const payload = (await response.json()) as { message?: string; error?: string };
    
    const text = payload.message ?? payload.error ?? "";
    setMessage(text);

    if (text) {
      setTimeout(() => setMessage(""), 2000);
    }

    if (response.ok) {
      router.refresh();
    }
    setBusy(false);
  }

  const booleans: Array<keyof typeof labels> = [
    "cloudServices",
    "softwareDevelopment",
    "suppliersCritical",
    "remoteWorkforce",
    "physicalOfficeControl",
    "criticalProcesses",
    "personalData",
    "regulatedSector"
  ];

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 md:grid-cols-2">
        {booleans.map((key) => (
          <label key={key} className="flex items-center justify-between rounded-xl border px-3 py-2 text-sm">
            <span>{labels[key]}</span>
            <input
              checked={form[key]}
              onChange={(event) => setForm((state) => ({ ...state, [key]: event.target.checked }))}
              type="checkbox"
            />
          </label>
        ))}
      </div>
      <textarea
        className="min-h-28 rounded-xl border px-3 py-2"
        value={form.customerDescription}
        onChange={(event) => setForm((state) => ({ ...state, customerDescription: event.target.value }))}
        placeholder="Descrizione attività cliente"
      />
      <textarea
        className="min-h-28 rounded-xl border px-3 py-2"
        value={form.uploadedContext}
        onChange={(event) => setForm((state) => ({ ...state, uploadedContext: event.target.value }))}
        placeholder="Contesto ricavato da interviste, checklist o documenti caricati"
      />
      {message ? <div className="text-sm text-slate-600">{message}</div> : null}
      <div className="flex flex-wrap gap-3">
        <button className="rounded-xl border px-3 py-2 text-sm" disabled={busy} onClick={saveOnly}>
          Salva profilo
        </button>
        <button className="rounded-xl bg-slate-900 px-3 py-2 text-sm text-white" disabled={busy} onClick={rebuild}>
          {busy ? "Caricamento..." : "Rigenera baseline cliente"}
        </button>
      </div>
    </div>
  );
}
