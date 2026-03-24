import { BASELINE_CONTROLS, BASELINE_DOCUMENTS, BASELINE_RISKS } from "@/lib/baseline";
import type { ProfileInput } from "@/lib/profile-input";

type RuleResult = {
  applicable: boolean;
  justification: string;
};

type ProfileTrigger =
  | "always"
  | "cloudHosted"
  | "softwareDevelopment"
  | "suppliersCritical"
  | "remoteWorkforce"
  | "physicalOfficeControl"
  | "personalDataProcessing"
  | "specialCategoryData"
  | "paymentProcessing"
  | "regulatedMarket"
  | "businessContinuityRequired"
  | "mobileDevicesUsed"
  | "privilegedAccessManaged"
  | "securityMonitoringNeeded";

function enabled(profile: ProfileInput, flag: keyof ProfileInput): boolean {
  return Boolean(profile[flag]);
}

function controlRule(profile: ProfileInput, code: string): RuleResult {
  const normalizedCode = code.startsWith("A.") ? code : `A.${code}`;

  switch (normalizedCode) {
    // Supplier controls
    case "A.5.19":
    case "A.5.20":
    case "A.5.21":
    case "A.5.22":
      return profile.suppliersCritical
        ? {
            applicable: true,
            justification:
              "Applicabile perché l’organizzazione dipende da fornitori o servizi terzi critici.",
          }
        : {
            applicable: false,
            justification:
              "Non applicabile nel perimetro corrente: non risultano fornitori critici.",
          };

    // Cloud
    case "A.5.23":
      return profile.cloudHosted
        ? {
            applicable: true,
            justification:
              "Applicabile perché l’organizzazione utilizza servizi cloud nel perimetro ISMS.",
          }
        : {
            applicable: false,
            justification:
              "Non applicabile nel perimetro corrente: non risultano servizi cloud rilevanti.",
          };

    // Business continuity
    case "A.5.29":
    case "A.5.30":
      return profile.businessContinuityRequired
        ? {
            applicable: true,
            justification:
              "Applicabile perché la continuità operativa dei processi richiede preparazione ICT e gestione in discontinuità.",
          }
        : {
            applicable: false,
            justification:
              "Non prioritario nel perimetro corrente: la continuità operativa ICT non è stata classificata come requisito critico.",
          };

    // Legal / regulatory / contractual requirements
    case "A.5.31":
      return profile.regulatedMarket || profile.personalDataProcessing || profile.paymentProcessing
        ? {
            applicable: true,
            justification:
              "Applicabile perché esistono requisiti legali, regolatori o contrattuali rilevanti per il perimetro.",
          }
        : {
            applicable: true,
            justification:
              "Applicabile come controllo generale di conformità legale e contrattuale.",
          };

    // Privacy / PII
    case "A.5.34":
      return profile.personalDataProcessing || profile.specialCategoryData
        ? {
            applicable: true,
            justification:
              "Applicabile perché il perimetro include trattamento di dati personali o categorie particolari di dati.",
          }
        : {
            applicable: false,
            justification:
              "Non applicabile nel perimetro corrente: non risultano trattamenti di dati personali rilevanti.",
          };

    // Remote working
    case "A.6.7":
      return profile.remoteWorkforce
        ? {
            applicable: true,
            justification: "Applicabile perché è presente lavoro remoto o ibrido.",
          }
        : {
            applicable: false,
            justification:
              "Non applicabile nel perimetro corrente: il lavoro remoto non è previsto.",
          };

    // Physical controls strictly tied to managed premises
    case "A.7.1":
    case "A.7.2":
    case "A.7.3":
    case "A.7.4":
    case "A.7.5":
    case "A.7.6":
    case "A.7.8":
    case "A.7.11":
    case "A.7.12":
    case "A.7.13":
      return profile.physicalOfficeControl
        ? {
            applicable: true,
            justification:
              "Applicabile perché l’organizzazione controlla sedi, locali o aree fisiche rilevanti.",
          }
        : {
            applicable: false,
            justification:
              "Non applicabile nel perimetro corrente: non risultano aree fisiche sotto controllo diretto rilevanti ai fini ISMS.",
          };

    // Clear desk / clear screen can still apply even without managed premises
    case "A.7.7":
      return profile.physicalOfficeControl || profile.remoteWorkforce
        ? {
            applicable: true,
            justification:
              "Applicabile perché esistono postazioni di lavoro, anche distribuite o in remoto, da proteggere con regole clear desk / clear screen.",
          }
        : {
            applicable: false,
            justification:
              "Non applicabile nel perimetro corrente: non risultano postazioni operative rilevanti da presidiare con misure clear desk / clear screen.",
          };

    // Off-premises assets
    case "A.7.9":
      return profile.remoteWorkforce || profile.mobileDevicesUsed
        ? {
            applicable: true,
            justification:
              "Applicabile perché asset informativi o dispositivi sono utilizzati fuori sede.",
          }
        : {
            applicable: false,
            justification:
              "Non applicabile nel perimetro corrente: non risultano asset operativi off-premises rilevanti.",
          };

    // Storage media
    case "A.7.10":
      return profile.physicalOfficeControl || profile.mobileDevicesUsed || profile.remoteWorkforce
        ? {
            applicable: true,
            justification:
              "Applicabile perché l’organizzazione utilizza dispositivi o supporti che possono contenere informazioni da proteggere.",
          }
        : {
            applicable: false,
            justification:
              "Non applicabile nel perimetro corrente: non risultano supporti fisici o dispositivi rilevanti da gestire.",
          };

    // Secure disposal / reuse
    case "A.7.14":
      return profile.physicalOfficeControl || profile.mobileDevicesUsed || profile.remoteWorkforce
        ? {
            applicable: true,
            justification:
              "Applicabile perché esistono apparecchiature o dispositivi che devono essere dismessi o riutilizzati in modo sicuro.",
          }
        : {
            applicable: false,
            justification:
              "Non applicabile nel perimetro corrente: non risultano apparecchiature rilevanti da dismettere o riutilizzare.",
          };

    // Privileged access
    case "A.8.2":
    case "A.8.18":
      return profile.privilegedAccessManaged
        ? {
            applicable: true,
            justification:
              "Applicabile perché esistono account o attività con privilegi elevati da governare.",
          }
        : {
            applicable: false,
            justification:
              "Non applicabile nel perimetro corrente: non risultano privilegi elevati rilevanti.",
          };

    // Monitoring / logging
    case "A.8.15":
    case "A.8.16":
      return profile.securityMonitoringNeeded
        ? {
            applicable: true,
            justification:
              "Applicabile perché il monitoraggio degli eventi di sicurezza è necessario nel perimetro.",
          }
        : {
            applicable: false,
            justification:
              "Non applicabile nel perimetro corrente: il monitoraggio non è stato classificato come esigenza rilevante.",
          };

    // Secure development
    case "A.8.25":
    case "A.8.26":
    case "A.8.27":
    case "A.8.28":
    case "A.8.29":
    case "A.8.30":
    case "A.8.31":
    case "A.8.32":
    case "A.8.33":
      return profile.softwareDevelopment
        ? {
            applicable: true,
            justification:
              "Applicabile perché il perimetro include sviluppo o manutenzione software.",
          }
        : {
            applicable: false,
            justification:
              "Non applicabile nel perimetro corrente: non risultano attività di sviluppo software.",
          };

    default:
      return {
        applicable: true,
        justification:
          "Applicabile come controllo di baseline generale del sistema di gestione.",
      };
  }
}

function triggerMatches(profile: ProfileInput, trigger: ProfileTrigger): boolean {
  if (trigger === "always") {
    return true;
  }

  return enabled(profile, trigger);
}

export function deriveControls(profile: ProfileInput) {
  return BASELINE_CONTROLS.map((control) => {
    const result = controlRule(profile, control.code);

    return {
      ...control,
      defaultApplicable: result.applicable,
      applicable: result.applicable,
      justification: result.justification,
    };
  });
}

export function deriveDocuments(profile: ProfileInput) {
  return BASELINE_DOCUMENTS.map((doc) => {
    const required = triggerMatches(profile, doc.trigger);

    return {
      ...doc,
      required,
      reason: required
        ? doc.trigger === "always"
          ? "Documento di baseline richiesto per tutte le organizzazioni del perimetro."
          : "Documento richiesto in base alle caratteristiche del profilo aziendale."
        : "Documento non richiesto in base al profilo aziendale corrente.",
    };
  });
}

export function deriveRisks(profile: ProfileInput) {
  return BASELINE_RISKS.filter((risk) => triggerMatches(profile, risk.trigger)).map((risk) => ({
    ...risk,
  }));
}

export function score(likelihood: number, impact: number): number {
  return likelihood * impact;
}

export function scoreLabel(value: number): string {
  if (value >= 15) return "Alto";
  if (value >= 8) return "Medio";
  return "Basso";
}
