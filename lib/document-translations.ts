// lib/document-translations.ts

import { DocumentStatus, RiskStatus } from "@prisma/client";

const documentNameTranslations: Record<string, string> = {
  "incident response procedure": "Procedura di risposta agli incidenti",
  "incident management procedure": "Procedura di gestione degli incidenti",
  "information security policy": "Politica per la sicurezza delle informazioni",
  "internal audit procedure": "Procedura di audit interno",
  "management review minutes template": "Verbale di riesame della direzione",
  "risk assessment methodology": "Metodologia di valutazione del rischio",
  "risk register": "Registro dei rischi",
  "statement of applicability": "Dichiarazione di applicabilità",
  "access control policy": "Politica di controllo degli accessi",
  "asset management procedure": "Procedura di gestione degli asset",
  "backup procedure": "Procedura di backup",
  "business continuity procedure": "Procedura di continuità operativa",
  "change management procedure": "Procedura di gestione delle modifiche",
  "cryptography policy": "Politica crittografica",
  "supplier security procedure": "Procedura di sicurezza dei fornitori",
  "supplier management procedure": "Procedura di gestione dei fornitori",
  "vulnerability management procedure": "Procedura di gestione delle vulnerabilità",
  "logging and monitoring procedure": "Procedura di logging e monitoraggio",
  "mobile device policy": "Politica per i dispositivi mobili",
  "acceptable use policy": "Politica di uso accettabile",
  "information classification policy": "Politica di classificazione delle informazioni",
  "secure development procedure": "Procedura di sviluppo sicuro",
  "data protection procedure": "Procedura di protezione dei dati",
  "access control procedure": "Procedura di controllo degli accessi",
  "business continuity policy": "Politica di continuità operativa",
  "information security objectives": "Obiettivi di sicurezza delle informazioni",
  "competence and awareness procedure": "Procedura di competenza e consapevolezza",
  "document control procedure": "Procedura di controllo documentale",
  "records management procedure": "Procedura di gestione delle registrazioni",
  "corrective action procedure": "Procedura di azioni correttive",
  "nonconformity management procedure": "Procedura di gestione delle non conformità",
  "communication policy": "Politica di comunicazione",
  "third party security policy": "Politica di sicurezza delle terze parti",
  "human resources security procedure": "Procedura di sicurezza delle risorse umane",
  "physical security procedure": "Procedura di sicurezza fisica",
  "operations security procedure": "Procedura di sicurezza operativa",
  "network security procedure": "Procedura di sicurezza di rete",
  "password policy": "Politica delle password",
  "remote working policy": "Politica per il lavoro remoto",
};

const documentCategoryTranslations: Record<string, string> = {
  POLICY: "POLITICA",
  PROCEDURE: "PROCEDURA",
  TEMPLATE: "MODELLO",
  METHODOLOGY: "METODOLOGIA",
  REGISTER: "REGISTRO",
  GUIDELINE: "LINEA GUIDA",
  STANDARD: "STANDARD",
};

const controlStatusTranslations: Record<string, string> = {
  PLANNED: "Pianificato",
  IMPLEMENTED: "Implementato",
  NOT_APPLICABLE: "Non applicabile",
  OPEN: "Aperto",
  CLOSED: "Chiuso",
  IN_PROGRESS: "In corso",
  APPROVED: "Approvato",
  DRAFT: "Bozza",
};

const genericTranslations: Record<string, string> = {
  ADMIN: "Amministratore",
  CONSULTANT: "Consulente",
  USER: "Utente",
  SUPER_ADMIN: "Super amministratore",
  COMPLIANCE_MANAGER: "Responsabile compliance",
  CLIENT_ADMIN: "Amministratore cliente",
};

function normalizeKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[-_/]+/g, " ")
    .replace(/\s+/g, " ");
}

function fallbackTranslateDocumentName(name: string): string {
  const normalized = normalizeKey(name);

  if (normalized.includes("incident") && normalized.includes("response")) {
    return "Procedura di risposta agli incidenti";
  }

  if (normalized.includes("information security") && normalized.includes("policy")) {
    return "Politica per la sicurezza delle informazioni";
  }

  if (normalized.includes("internal audit")) {
    return "Procedura di audit interno";
  }

  if (normalized.includes("management review")) {
    return "Verbale di riesame della direzione";
  }

  if (normalized.includes("risk") && normalized.includes("register")) {
    return "Registro dei rischi";
  }

  if (normalized.includes("risk") && normalized.includes("assessment")) {
    return "Metodologia di valutazione del rischio";
  }

  if (normalized.includes("statement of applicability")) {
    return "Dichiarazione di applicabilità";
  }

  if (normalized.includes("access control")) {
    return normalized.includes("policy")
      ? "Politica di controllo degli accessi"
      : "Procedura di controllo degli accessi";
  }

  if (normalized.includes("asset management")) {
    return "Procedura di gestione degli asset";
  }

  if (normalized.includes("backup")) {
    return "Procedura di backup";
  }

  if (normalized.includes("business continuity")) {
    return normalized.includes("policy")
      ? "Politica di continuità operativa"
      : "Procedura di continuità operativa";
  }

  if (normalized.includes("change management")) {
    return "Procedura di gestione delle modifiche";
  }

  if (normalized.includes("cryptography")) {
    return "Politica crittografica";
  }

  if (normalized.includes("supplier")) {
    return normalized.includes("management")
      ? "Procedura di gestione dei fornitori"
      : "Procedura di sicurezza dei fornitori";
  }

  if (normalized.includes("vulnerability management")) {
    return "Procedura di gestione delle vulnerabilità";
  }

  if (normalized.includes("logging") || normalized.includes("monitoring")) {
    return "Procedura di logging e monitoraggio";
  }

  if (normalized.includes("mobile device")) {
    return "Politica per i dispositivi mobili";
  }

  if (normalized.includes("acceptable use")) {
    return "Politica di uso accettabile";
  }

  if (normalized.includes("information classification")) {
    return "Politica di classificazione delle informazioni";
  }

  if (normalized.includes("secure development")) {
    return "Procedura di sviluppo sicuro";
  }

  if (normalized.includes("data protection")) {
    return "Procedura di protezione dei dati";
  }

  if (normalized.includes("document control")) {
    return "Procedura di controllo documentale";
  }

  if (normalized.includes("records management")) {
    return "Procedura di gestione delle registrazioni";
  }

  if (normalized.includes("corrective action")) {
    return "Procedura di azioni correttive";
  }

  if (normalized.includes("nonconformity")) {
    return "Procedura di gestione delle non conformità";
  }

  if (normalized.includes("communication")) {
    return "Politica di comunicazione";
  }

  if (normalized.includes("human resources security")) {
    return "Procedura di sicurezza delle risorse umane";
  }

  if (normalized.includes("physical security")) {
    return "Procedura di sicurezza fisica";
  }

  if (normalized.includes("operations security")) {
    return "Procedura di sicurezza operativa";
  }

  if (normalized.includes("network security")) {
    return "Procedura di sicurezza di rete";
  }

  if (normalized.includes("password")) {
    return "Politica delle password";
  }

  if (normalized.includes("remote working")) {
    return "Politica per il lavoro remoto";
  }

  return name;
}

export function translateDocumentName(name: string): string {
  const normalized = normalizeKey(name);
  return documentNameTranslations[normalized] ?? fallbackTranslateDocumentName(name);
}

export function translateDocumentCategory(category: string): string {
  return documentCategoryTranslations[category] ?? category;
}

export function translateDocumentStatus(status: DocumentStatus | string): string {
  switch (status) {
    case DocumentStatus.DRAFT:
      return "Bozza";
    case DocumentStatus.APPROVED:
      return "Approvato";
    default:
      if (String(status) === "NOT_REQUIRED") {
        return "Non richiesto";
      }
      return String(status);
  }
}

export function translateRiskStatus(status: RiskStatus | string): string {
  switch (status) {
    case RiskStatus.OPEN:
      return "Aperto";
    case RiskStatus.TREATMENT_PLANNED:
      return "Trattamento pianificato";
    case RiskStatus.CLOSED:
      return "Chiuso";
    default:
      return String(status);
  }
}

export function translateControlStatus(status: string): string {
  return controlStatusTranslations[status] ?? status;
}

export function translateGenericLabel(value: string): string {
  return genericTranslations[value.toUpperCase()] ?? value;
}

export function translateRiskLevel(value: number): string {
  if (value >= 15) {
    return "Critico";
  }

  if (value >= 8) {
    return "Alto";
  }

  if (value >= 4) {
    return "Medio";
  }

  return "Basso";
}
