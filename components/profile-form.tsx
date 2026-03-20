// file: components/profile-form.tsx
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
  physicalOfficeControl: "Controllo fisico delle sedi",
  criticalProcesses: "Processi critici",
  personalData: "Dati personali o sensibili",
  regulatedSector: "Settore regolamentato",
};

type ProfileResponse = {
  message?: string;
  error?: string;
};

export default function ProfileForm({
  companyId,
  profile,
}: {
  companyId: string;
  profile: Profile;
}) {
  const router = useRouter();
  const [form, setForm] = useState<Profile>(profile);
  const [message, setMessage] = useState("");
  const [busyAction, setBusyAction] = useState<"save" | "rebuild" | null>(null);

  const booleans: Array<keyof typeof labels> = [
    "cloudServices",
    "softwareDevelopment",
    "suppliersCritical",
    "remoteWorkforce",
    "physicalOfficeControl",
    "criticalProcesses",
    "personalData",
    "regulatedSector",
  ];

  async function saveOnly() {
    if (busyAction) {
      return;
    }

    setBusyAction("save");
    setMessage("");

    try {
      const response = await fetch(`/api/companies/${companyId}/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const payload = (await response.json()) as ProfileResponse;
      setMessage(
        payload.message ??
          payload.error ??
          (response.ok ? "Profilo salvato con successo." : "Salvataggio non riuscito."),
      );
    } catch {
      setMessage("Errore di rete durante il salvataggio del profilo.");
    } finally {
      setBusyAction(null);
    }
  }

  async function rebuild() {
    if (busyAction) {
      return;
    }

    setBusyAction("rebuild");
    setMessage("");

    try {
      const response = await fetch(`/api/companies/${companyId}/rebuild`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const payload = (await response.json()) as ProfileResponse;
      const text =
        payload.message ??
        payload.error ??
        (response.ok
          ? "Baseline cliente rigenerata con successo."
          : "Rigenerazione non riuscita.");

      setMessage(text);

      if (response.ok) {
        router.refresh();
      }
    } catch {
      setMessage("Errore di rete durante la rigenerazione della baseline.");
    } finally {
      setBusyAction(null);
    }
  }

  return (
    <div className="space-y-6">
      <fieldset className="space-y-4">
        <legend className="text-sm font-medium text-slate-900">
          Contesto organizzativo
        </legend>

        <div className="grid gap-3 sm:grid-cols-2">
          {booleans.map((key) => (
            <label
              key={key}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800"
            >
              <input
                type="checkbox"
                checked={form[key]}
                onChange={(event) =>
                  setForm((state) => ({
                    ...state,
                    [key]: event.target.checked,
                  }))
                }
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
              />
              <span>{labels[key]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="space-y-2">
        <label
          htmlFor="descrizione-cliente"
          className="block text-sm font-medium text-slate-900"
        >
          Descrizione del cliente
        </label>
        <textarea
          id="descrizione-cliente"
          className="min-h-28 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800"
          value={form.customerDescription}
          onChange={(event) =>
            setForm((state) => ({
              ...state,
              customerDescription: event.target.value,
            }))
          }
          placeholder="Descrivi attività, servizi, asset critici e perimetro operativo."
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="contesto-raccolto"
          className="block text-sm font-medium text-slate-900"
        >
          Contesto raccolto da interviste o documenti
        </label>
        <textarea
          id="contesto-raccolto"
          className="min-h-32 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800"
          value={form.uploadedContext}
          onChange={(event) =>
            setForm((state) => ({
              ...state,
              uploadedContext: event.target.value,
            }))
          }
          placeholder="Inserisci informazioni raccolte da checklist, interviste o documenti caricati."
        />
      </div>

      {message ? (
        <div
          className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
          role="status"
          aria-live="polite"
        >
          {message}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={busyAction !== null}
          onClick={saveOnly}
        >
          {busyAction === "save" ? "Salvataggio in corso..." : "Salva profilo"}
        </button>

        <button
          type="button"
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={busyAction !== null}
          onClick={rebuild}
        >
          {busyAction === "rebuild"
            ? "Rigenerazione in corso..."
            : "Rigenera baseline cliente"}
        </button>
      </div>
    </div>
  );
}
