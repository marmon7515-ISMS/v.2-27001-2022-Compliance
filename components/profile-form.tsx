"use client";

import { useMemo, useState, useTransition } from "react";
import type { ProfileInput } from "@/lib/profile-input";
import { EMPTY_PROFILE } from "@/lib/profile-input";

type ProfileFormProps = {
  companyId: string;
  initialProfile?: Partial<ProfileInput> | null;
};

type FormState = ProfileInput;

function normalizeProfile(input?: Partial<ProfileInput> | null): ProfileInput {
  return {
    ...EMPTY_PROFILE,
    ...(input ?? {}),
  };
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
      {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
    </label>
  );
}

function ToggleField({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  hint?: string;
}) {
  return (
    <label className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 p-4">
      <div className="space-y-1">
        <div className="text-sm font-medium text-slate-800">{label}</div>
        {hint ? <div className="text-xs text-slate-500">{hint}</div> : null}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition ${
          checked ? "bg-slate-900" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
    </label>
  );
}

export default function ProfileForm({ companyId, initialProfile }: ProfileFormProps) {
  const initialState = useMemo(() => normalizeProfile(initialProfile), [initialProfile]);

  const [form, setForm] = useState<FormState>(initialState);
  const [saveMessage, setSaveMessage] = useState<string>("");
  const [rebuildMessage, setRebuildMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSaving, startSaving] = useTransition();
  const [isRebuilding, startRebuilding] = useTransition();

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function saveProfile() {
    setSaveMessage("");
    setRebuildMessage("");
    setErrorMessage("");

    const response = await fetch(`/api/companies/${companyId}/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setErrorMessage(data?.error ?? "Errore durante il salvataggio del profilo.");
      return;
    }

    setSaveMessage(data?.message ?? "Profilo salvato.");
  }

  async function rebuildFromProfile() {
    setSaveMessage("");
    setRebuildMessage("");
    setErrorMessage("");

    const response = await fetch(`/api/companies/${companyId}/rebuild`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setErrorMessage(data?.error ?? "Errore durante la rigenerazione della baseline.");
      return;
    }

    setRebuildMessage(data?.message ?? "Baseline rigenerata.");
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">Profilo aziendale</h2>
        <p className="mt-1 text-sm text-slate-600">
          Questo profilo alimenta il motore regole per controlli, rischi e documenti.
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Settore">
            <input
              type="text"
              value={form.industry}
              onChange={(e) => update("industry", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-0 focus:border-slate-500"
              placeholder="Es. Software, Sanità, Servizi professionali"
            />
          </Field>

          <Field label="Dimensione azienda">
            <select
              value={form.companySize}
              onChange={(e) => update("companySize", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            >
              <option value="Micro">Micro</option>
              <option value="SMB">PMI</option>
              <option value="Mid-Market">Mid-Market</option>
              <option value="Enterprise">Enterprise</option>
            </select>
          </Field>
        </div>

        <Field
          label="Descrizione cliente"
          hint="Testo sintetico usato come contesto generale del perimetro."
        >
          <textarea
            value={form.customerDescription}
            onChange={(e) => update("customerDescription", e.target.value)}
            rows={5}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            placeholder="Descrivi attività, servizi, asset principali, sede, processi critici e contesto operativo."
          />
        </Field>

        <div className="grid gap-4 md:grid-cols-2">
          <ToggleField
            label="Lavoro remoto o ibrido"
            checked={form.remoteWorkforce}
            onChange={(value) => update("remoteWorkforce", value)}
            hint="Influenza controlli su remote working, asset fuori sede, endpoint."
          />

          <ToggleField
            label="Controllo diretto di sedi / uffici / locali"
            checked={form.physicalOfficeControl}
            onChange={(value) => update("physicalOfficeControl", value)}
            hint="Attiva controlli fisici e ambientali."
          />

          <ToggleField
            label="Sviluppo software interno"
            checked={form.softwareDevelopment}
            onChange={(value) => update("softwareDevelopment", value)}
            hint="Attiva i controlli di secure development e segregazione ambienti."
          />

          <ToggleField
            label="Servizi cloud nel perimetro"
            checked={form.cloudHosted}
            onChange={(value) => update("cloudHosted", value)}
            hint="Attiva controlli cloud e rischi di configurazione."
          />

          <ToggleField
            label="Trattamento di dati personali"
            checked={form.personalDataProcessing}
            onChange={(value) => update("personalDataProcessing", value)}
            hint="Rilevante per privacy, compliance e protezione PII."
          />

          <ToggleField
            label="Categorie particolari di dati"
            checked={form.specialCategoryData}
            onChange={(value) => update("specialCategoryData", value)}
            hint="Misure rafforzate per dati sensibili."
          />

          <ToggleField
            label="Processi di pagamento"
            checked={form.paymentProcessing}
            onChange={(value) => update("paymentProcessing", value)}
            hint="Aumenta il profilo di rischio finanziario e applicativo."
          />

          <ToggleField
            label="Mercato regolamentato / obblighi regolatori forti"
            checked={form.regulatedMarket}
            onChange={(value) => update("regulatedMarket", value)}
            hint="Rilevante per obblighi legali, normativi e contrattuali."
          />

          <ToggleField
            label="Fornitori critici"
            checked={form.suppliersCritical}
            onChange={(value) => update("suppliersCritical", value)}
            hint="Attiva controlli supplier security e supply chain."
          />

          <ToggleField
            label="Continuità operativa ICT rilevante"
            checked={form.businessContinuityRequired}
            onChange={(value) => update("businessContinuityRequired", value)}
            hint="Attiva continuità, resilienza e discontinuità."
          />

          <ToggleField
            label="Uso di dispositivi mobili"
            checked={form.mobileDevicesUsed}
            onChange={(value) => update("mobileDevicesUsed", value)}
            hint="Rilevante per smartphone, tablet, device fuori sede."
          />

          <ToggleField
            label="Presenza di privilegi elevati"
            checked={form.privilegedAccessManaged}
            onChange={(value) => update("privilegedAccessManaged", value)}
            hint="Attiva controlli PAM, utility privilegiate e governance accessi."
          />

          <ToggleField
            label="Necessità di logging e monitoraggio sicurezza"
            checked={form.securityMonitoringNeeded}
            onChange={(value) => update("securityMonitoringNeeded", value)}
            hint="Attiva controlli su logging, monitoring e rilevazione eventi."
          />
        </div>

        {(saveMessage || rebuildMessage || errorMessage) && (
          <div className="space-y-2">
            {saveMessage ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                {saveMessage}
              </div>
            ) : null}

            {rebuildMessage ? (
              <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                {rebuildMessage}
              </div>
            ) : null}

            {errorMessage ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {errorMessage}
              </div>
            ) : null}
          </div>
        )}

        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <button
            type="button"
            onClick={() => startSaving(saveProfile)}
            disabled={isSaving || isRebuilding}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Salvataggio..." : "Salva profilo"}
          </button>

          <button
            type="button"
            onClick={() => startRebuilding(rebuildFromProfile)}
            disabled={isSaving || isRebuilding}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRebuilding ? "Rigenerazione..." : "Rigenera baseline"}
          </button>
        </div>
      </div>
    </div>
  );
}
