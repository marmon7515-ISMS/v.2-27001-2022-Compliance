// components/profile-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
  remoteWorkforce: "Lavoro remoto o ibrido",
  physicalOfficeControl: "Controllo fisico sedi",
  criticalProcesses: "Processi critici",
  personalData: "Dati personali o sensibili",
  regulatedSector: "Settore regolamentato",
};

const booleanFields: Array<keyof Omit<Profile, "customerDescription" | "uploadedContext">> = [
  "cloudServices",
  "softwareDevelopment",
  "suppliersCritical",
  "remoteWorkforce",
  "physicalOfficeControl",
  "criticalProcesses",
  "personalData",
  "regulatedSector",
];

type Status =
  | { type: "idle"; text: "" }
  | { type: "success"; text: string }
  | { type: "error"; text: string };

export default function ProfileForm({
  companyId,
  profile,
}: {
  companyId: string;
  profile: Profile;
}) {
  const router = useRouter();
  const [form, setForm] = useState(profile);
  const [status, setStatus] = useState<Status>({ type: "idle", text: "" });
  const [busyAction, setBusyAction] = useState<"save" | "rebuild" | null>(null);

  function updateBooleanField(key: keyof typeof labels, value: boolean) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function submitProfile(endpoint: string, action: "save" | "rebuild") {
    try {
      setBusyAction(action);
      setStatus({ type: "idle", text: "" });

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const payload = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        setStatus({
          type: "error",
          text: payload.error ?? "Operazione non completata.",
        });
        return;
      }

      setStatus({
        type: "success",
        text:
          payload.message ??
          (action === "save"
            ? "Profilo salvato correttamente."
            : "Baseline cliente rigenerata correttamente."),
      });

      router.refresh();
    } catch {
      setStatus({
        type: "error",
        text: "Errore di rete. Riprovare tra qualche istante.",
      });
    } finally {
      setBusyAction(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        {booleanFields.map((key) => (
          <label
            key={key}
            className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
          >
            <input
              checked={form[key]}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
              onChange={(event) => updateBooleanField(key, event.target.checked)}
              type="checkbox"
            />
            <span className="leading-6">{labels[key]}</span>
          </label>
        ))}
      </div>

      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-slate-800"
          htmlFor="customerDescription"
        >
          Descrizione attività cliente
        </label>
        <textarea
          id="customerDescription"
          className="min-h-28 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              customerDescription: event.target.value,
            }))
          }
          placeholder="Descrivi servizi, sedi, processi, perimetro e contesto operativo."
          value={form.customerDescription}
        />
      </div>

      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-slate-800"
          htmlFor="uploadedContext"
        >
          Contesto raccolto da interviste o documenti
        </label>
        <textarea
          id="uploadedContext"
          className="min-h-32 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              uploadedContext: event.target.value,
            }))
          }
          placeholder="Inserisci elementi emersi da checklist, riunioni, assessment o file caricati."
          value={form.uploadedContext}
        />
      </div>

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
          className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={busyAction !== null}
          onClick={() => submitProfile(`/api/companies/${companyId}/profile`, "save")}
          type="button"
        >
          {busyAction === "save" ? "Salvataggio in corso..." : "Salva profilo"}
        </button>

        <button
          className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={busyAction !== null}
          onClick={() => submitProfile(`/api/companies/${companyId}/rebuild`, "rebuild")}
          type="button"
        >
          {busyAction === "rebuild"
            ? "Rigenerazione in corso..."
            : "Rigenera baseline cliente"}
        </button>
      </div>
    </div>
  );
}
