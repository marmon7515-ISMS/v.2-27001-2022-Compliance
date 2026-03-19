import { ProfileInput, ProfileSuggestion } from "@/types";

type SignalRule = {
  pattern: RegExp;
  patch: Partial<ProfileInput>;
  reason: string;
};

const SIGNAL_RULES: SignalRule[] = [
  { pattern: /aws|azure|google cloud|microsoft 365|office 365|saas|cloud/gi, patch: { cloudServices: true }, reason: "Riferimenti a servizi cloud o SaaS." },
  { pattern: /software development|sviluppo software|repository|git|ci\/cd|release|application|api/gi, patch: { softwareDevelopment: true }, reason: "Emergono attività di sviluppo software." },
  { pattern: /supplier|fornitore|outsourc|third[- ]party|vendor/gi, patch: { suppliersCritical: true }, reason: "Presenza di fornitori o terze parti rilevanti." },
  { pattern: /remote|ibrid|work from home|vpn|smart working/gi, patch: { remoteWorkforce: true }, reason: "Presenza di lavoro remoto o ibrido." },
  { pattern: /office|badge|cctv|building|sede|reception|physical access/gi, patch: { physicalOfficeControl: true }, reason: "Presenza di controlli o sedi fisiche." },
  { pattern: /business continuity|rto|rpo|continuity|disaster recovery|critical service|sla/gi, patch: { criticalProcesses: true }, reason: "Indicatori di processi critici o continuità operativa." },
  { pattern: /personal data|gdpr|pii|dati personali|dati sensibili|privacy/gi, patch: { personalData: true }, reason: "Trattamento di dati personali o privacy." },
  { pattern: /regulated|iso|medical|bank|finance|nis2|dora|regulated sector|settore regolamentato/gi, patch: { regulatedSector: true }, reason: "Indicatori di settore regolamentato o standard rilevanti." }
];

export function suggestProfileFromText(text: string): ProfileSuggestion {
  const normalized = text.trim();
  const patch: Partial<ProfileInput> = {};
  const reasons: string[] = [];

  for (const rule of SIGNAL_RULES) {
    if (rule.pattern.test(normalized)) {
      Object.assign(patch, rule.patch);
      reasons.push(rule.reason);
    }
  }

  const summary = normalized
    ? normalized.split(/\s+/).slice(0, 50).join(" ")
    : "Nessun contenuto analizzabile disponibile.";

  return { ...patch, reasons, summary };
}

export function mergeProfileSuggestion(profile: ProfileInput, suggestion: ProfileSuggestion): ProfileInput {
  return {
    ...profile,
    ...suggestion,
    uploadedContext: [profile.uploadedContext, suggestion.summary, suggestion.reasons.join(" ")].filter(Boolean).join("\n\n")
  };
}
