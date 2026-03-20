// lib/document-translations.ts

const documentNameTranslations: Record<string, string> = {
  "Incident Response Procedure": "Procedura di risposta agli incidenti",
  "Information Security Policy": "Politica per la sicurezza delle informazioni",
  "Internal Audit Procedure": "Procedura di audit interno",
  "Management Review Minutes Template": "Template verbale di riesame della direzione",
  "Risk Assessment Methodology": "Metodologia di valutazione del rischio",
  "Risk Register": "Registro dei rischi",
  "Statement of Applicability": "Dichiarazione di applicabilità",
};

const documentCategoryTranslations: Record<string, string> = {
  PROCEDURE: "PROCEDURA",
  POLICY: "POLITICA",
  TEMPLATE: "MODELLO",
  METHODOLOGY: "METODOLOGIA",
  REGISTER: "REGISTRO",
};

export function translateDocumentName(name: string) {
  return documentNameTranslations[name] ?? name;
}

export function translateDocumentCategory(category: string) {
  return documentCategoryTranslations[category] ?? category;
}
