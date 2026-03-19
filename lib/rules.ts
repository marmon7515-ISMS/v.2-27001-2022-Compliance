import { BASELINE_CONTROLS, BASELINE_DOCUMENTS, BASELINE_RISKS, CONTROL_RULES } from "@/lib/baseline";
import { ProfileInput } from "@/types";

type Trigger = "always" | "cloud" | "software" | "suppliers" | "remote" | "physical" | "critical";

function triggerMatches(profile: ProfileInput, trigger: Trigger): boolean {
  switch (trigger) {
    case "always":
      return true;
    case "cloud":
      return profile.cloudServices;
    case "software":
      return profile.softwareDevelopment;
    case "suppliers":
      return profile.suppliersCritical;
    case "remote":
      return profile.remoteWorkforce;
    case "physical":
      return profile.physicalOfficeControl;
    case "critical":
      return profile.criticalProcesses;
  }
}

export function deriveDocuments(profile: ProfileInput) {
  return BASELINE_DOCUMENTS.map((doc) => {
    const required = triggerMatches(profile, doc.trigger as Trigger);
    const reason = required
      ? doc.trigger === "always"
        ? "Documento base richiesto dalla baseline generale."
        : "Documento richiesto dal profilo operativo del cliente."
      : "Documento non necessario in base al profilo attuale del cliente.";

    return {
      ...doc,
      required,
      reason
    };
  });
}

export function deriveControls(profile: ProfileInput) {
  return BASELINE_CONTROLS.map((control) => {
    const rule = CONTROL_RULES[control.code];
    if (rule) {
      const result = rule(profile);
      return {
        ...control,
        applicable: result.applicable,
        justification: result.justification
      };
    }

    return {
      ...control,
      applicable: true,
      justification: "Applicabile dalla baseline generale; richiede conferma sul perimetro cliente."
    };
  });
}

export function deriveRisks(profile: ProfileInput) {
  return BASELINE_RISKS.filter((risk) => triggerMatches(profile, risk.trigger as Trigger)).map((risk) => ({
    ...risk,
    residualLikelihood: Math.max(1, risk.likelihood - 1),
    residualImpact: Math.max(1, risk.impact - 1)
  }));
}

export function score(likelihood: number, impact: number) {
  return likelihood * impact;
}

export function scoreLabel(value: number) {
  if (value >= 15) return "Critical";
  if (value >= 8) return "High";
  if (value >= 4) return "Medium";
  return "Low";
}
