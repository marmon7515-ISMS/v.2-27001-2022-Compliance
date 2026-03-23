// lib/document-translations.ts

import { DocumentStatus, RiskStatus } from "@prisma/client";

const documentNameTranslations: Record<string, string> = {
  "Incident Response Procedure": "Procedura di risposta agli incidenti",
  "Information Security Policy": "Politica per la sicurezza delle informazioni",
  "Internal Audit Procedure": "Procedura di audit interno",
  "Management Review Minutes Template": "Verbale di riesame della direzione",
  "Risk Assessment Methodology": "Metodologia di valutazione del rischio",
  "Risk Register": "Registro dei rischi",
  "Statement of Applicability": "Dichiarazione di applicabilità",
  "Access Control Policy": "Politica di controllo degli accessi",
  "Asset Management Procedure": "Procedura di gestione degli asset",
  "Backup Procedure": "Procedura di backup",
  "Business Continuity Procedure": "Procedura di continuità operativa",
  "Change Management Procedure": "Procedura di gestione delle modifiche",
  "Cryptography Policy": "Politica crittografica",
  "Supplier Security Procedure": "Procedura di sicurezza dei fornitori",
  "Vulnerability Management Procedure": "Procedura di gestione delle vulnerabilità",
  "Logging and Monitoring Procedure": "Procedura di logging e monitoraggio",
  "Mobile Device Policy": "Politica per i dispositivi mobili",
  "Acceptable Use Policy": "Politica di uso accettabile",
  "Information Classification Policy": "Politica di classificazione delle informazioni",
  "Secure Development Procedure": "Procedura di sviluppo sicuro",
  "Data Protection Procedure": "Procedura di protezione dei dati",
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

function normalizeKey(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function translateDocumentName(name: string) {
  const normalized = normalizeKey(name);
  return documentNameTranslations[normalized] ?? name;
}

export function translateDocumentCategory(category: string) {
  return documentCategoryTranslations[category] ?? category;
}

export function translateDocumentStatus(status: DocumentStatus | string) {
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

export function translateRiskStatus(status: RiskStatus | string) {
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

export function translateControlStatus(status: string) {
  return controlStatusTranslations[status] ?? status;
}

export function translateGenericLabel(value: string) {
  return genericTranslations[value.toUpperCase()] ?? value;
}

export function translateRiskLevel(value: number) {
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
