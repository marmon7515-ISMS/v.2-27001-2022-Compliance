"use client";

import { useState, useTransition } from "react";

type ControlEditorProps = {
  companyId: string;
  control: {
    id: string;
    applicable: boolean;
    justification: string;
    ownerName: string;
    evidence: string;
    status: string;
    manualApplicable: boolean | null;
    manualJustification: string | null;
    autoApplicable: boolean;
    autoJustification: string;
    baselineControl: {
      code: string;
      title: string;
    };
  };
};

const STATUS_OPTIONS = [
  "PLANNED",
  "IMPLEMENTED",
  "APPROVED",
  "NOT_APPLICABLE",
] as const;

export default function ControlEditor({ companyId, control }: ControlEditorProps) {
  const [manualApplicable, setManualApplicable] = useState<string>(
    control.manualApplicable === null ? "AUTO" : control.manualApplicable ? "TRUE" : "FALSE",
  );
  const [manualJustification, setManualJustification] = useState(
    control.manualJustification ?? "",
  );
  const [status, setStatus] = useState(control.status);
  const [ownerName, setOwnerName] = useState(control.ownerName ?? "");
  const [evidence, setEvidence] = useState(control.evidence ?? "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function save() {
    setMessage("");
    setError("");

    const payload = {
      controlId: control.id,
      manualApplicable:
        manualApplicable === "AUTO"
          ? null
          : manualApplicable === "TRUE"
            ? true
            : false,
      manualJustification: manualJustification.trim() === "" ? null : manualJustification,
      status,
      ownerName,
      evidence,
    };

    const response = await fetch(`/api/companies/${companyId}/controls`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setError(data?.error ?? "Errore durante il salvataggio del controllo.");
      return;
    }

    setMessage(data?.message ?? "Controllo aggiornato.");
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-4">
      <div className="space-y-1">
        <p className="text-sm font-semibold text-slate-900">
          {control.baselineControl.code} · {control.baselineControl.title}
        </p>
        <p className="text-xs text-slate-500">
          Automatico: {control.autoApplicable ? "Applicabile" : "Non applicabile"}
        </p>
        <p className="text-xs text-slate-500">{control.autoJustification}</p>
      </div>

      <div className="grid gap-4">
        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">Decisione auditor</span>
          <select
            value={manualApplicable}
            onChange={(e) => setManualApplicable(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="AUTO">Usa regola automatica</option>
            <option value="TRUE">Forza applicabile</option>
            <option value="FALSE">Forza non applicabile</option>
          </select>
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">
            Giustificazione manuale
          </span>
          <textarea
            rows={4}
            value={manualJustification}
            onChange={(e) => setManualJustification(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            placeholder="Inserisci motivazione auditor oppure lascia vuoto per usare quella automatica."
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">Stato</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">Owner</span>
          <input
            type="text"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">Evidenza</span>
          <textarea
            rows={4}
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
      </div>

      {(message || error) && (
        <div className="space-y-2">
          {message ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {message}
            </div>
          ) : null}

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          ) : null}
        </div>
      )}

      <div>
        <button
          type="button"
          onClick={() => startTransition(save)}
          disabled={isPending}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
        >
          {isPending ? "Salvataggio..." : "Salva controllo"}
        </button>
      </div>
    </div>
  );
}
