// lib/policy-generator.ts

type CompanyProfile = {
  customerDescription: string;
  industry: string;
  companySize: string;
  remoteWorkforce: boolean;
  physicalOfficeControl: boolean;
  softwareDevelopment: boolean;
  cloudHosted: boolean;
  personalDataProcessing: boolean;
  specialCategoryData: boolean;
  paymentProcessing: boolean;
  regulatedMarket: boolean;
  suppliersCritical: boolean;
  businessContinuityRequired: boolean;
  mobileDevicesUsed: boolean;
  privilegedAccessManaged: boolean;
  securityMonitoringNeeded: boolean;
} | null;

type PolicyCompany = {
  name: string;
  framework: string;
  ownerName?: string;
  industry?: string;
  profile: CompanyProfile;
  controls: Array<{
    applicable: boolean;
    justification: string;
    status: string;
    baselineControl: {
      code: string;
      title: string;
      domain: string;
    };
  }>;
  risks: Array<{
    title: string;
    category: string;
    asset: string;
    threat: string;
    vulnerability: string;
    likelihood: number;
    impact: number;
    residualLikelihood: number;
    residualImpact: number;
    treatment: string;
    status: string;
  }>;
  documents: Array<{
    name: string;
    category: string;
    required: boolean;
    reason: string;
    status: string;
  }>;
};

function normalizeName(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function yesNo(value: boolean | undefined): string {
  return value ? "Sì" : "No";
}

function profileLine(label: string, value: string | boolean | undefined): string {
  if (typeof value === "boolean") {
    return `- ${label}: ${yesNo(value)}`;
  }

  return `- ${label}: ${value ?? ""}`;
}

function commonHeader(title: string, company: PolicyCompany): string[] {
  const profile = company.profile;

  return [
    title.toUpperCase(),
    "",
    `Organizzazione: ${company.name}`,
    `Framework di riferimento: ${company.framework}`,
    `Settore: ${profile?.industry ?? company.industry ?? ""}`,
    `Dimensione aziendale: ${profile?.companySize ?? ""}`,
    "",
    "1. Obiettivo",
    `Il presente documento definisce criteri, responsabilità e misure operative applicabili a ${company.name} per supportare l'ISMS e il presidio dei rischi di sicurezza delle informazioni.`,
    "",
    "2. Ambito",
    `Il documento si applica a personale interno, collaboratori, fornitori rilevanti, sistemi informativi, dati, servizi cloud, endpoint e processi aziendali che rientrano nel perimetro del sistema di gestione della sicurezza delle informazioni di ${company.name}.`,
    "",
    "3. Contesto organizzativo",
    profileLine("Descrizione", profile?.customerDescription ?? ""),
    profileLine("Lavoro remoto", profile?.remoteWorkforce),
    profileLine("Controlli fisici ufficio", profile?.physicalOfficeControl),
    profileLine("Sviluppo software", profile?.softwareDevelopment),
    profileLine("Servizi cloud", profile?.cloudHosted),
    profileLine("Trattamento dati personali", profile?.personalDataProcessing),
    profileLine("Dati particolari", profile?.specialCategoryData),
    profileLine("Continuità operativa richiesta", profile?.businessContinuityRequired),
    profileLine("Dispositivi mobili usati", profile?.mobileDevicesUsed),
    profileLine("Accessi privilegiati gestiti", profile?.privilegedAccessManaged),
    profileLine("Monitoraggio di sicurezza necessario", profile?.securityMonitoringNeeded),
    "",
    "4. Ruoli e responsabilità",
    "- Direzione: approva il documento e supporta le misure organizzative.",
    "- Responsabile ISMS / Compliance: governa aggiornamento, diffusione e controllo di applicazione.",
    "- Responsabili di funzione: applicano i controlli nelle rispettive aree.",
    "- Utenti: rispettano regole e segnalano anomalie o incidenti.",
    "",
  ];
}

function commonClosing(): string[] {
  return [
    "5. Riesame e aggiornamento",
    "Il documento deve essere riesaminato periodicamente e comunque in caso di variazioni organizzative, tecnologiche, normative o a seguito di incidenti rilevanti.",
    "",
    "6. Conservazione",
    "La versione approvata del documento è conservata nel repository documentale aziendale controllato.",
    "",
  ];
}

function buildInformationSecurityPolicy(company: PolicyCompany): string {
  const lines = [
    ...commonHeader("Politica per la Sicurezza delle Informazioni", company),
    "5. Principi di sicurezza",
    "- La sicurezza delle informazioni è allineata agli obiettivi aziendali.",
    "- Riservatezza, integrità e disponibilità devono essere protette con controlli proporzionati.",
    "- I rischi devono essere identificati, valutati e trattati in modo continuativo.",
    "- Gli accessi devono essere concessi secondo il principio del minimo privilegio.",
    "- Eventi e incidenti devono essere rilevati, gestiti e registrati.",
    "",
    "6. Impegni della direzione",
    "- Approvare politiche, procedure e risorse necessarie.",
    "- Promuovere consapevolezza e cultura della sicurezza.",
    "- Riesaminare periodicamente prestazioni, rischi e miglioramenti dell'ISMS.",
    "",
    ...commonClosing(),
  ];

  return lines.join("\n");
}

function buildAccessControlPolicy(company: PolicyCompany): string {
  const lines = [
    ...commonHeader("Politica di Controllo degli Accessi", company),
    "5. Regole di accesso",
    "- Ogni utenza deve essere individuale e tracciabile.",
    "- L'accesso è autorizzato sulla base del ruolo e delle necessità operative.",
    "- Gli accessi privilegiati devono essere limitati, approvati e riesaminati.",
    "- Gli account inattivi o non più necessari devono essere disabilitati tempestivamente.",
    "- Le password devono rispettare requisiti minimi di robustezza.",
    "",
    "6. Ciclo di vita utenze",
    "- Attivazione su richiesta approvata.",
    "- Modifica in caso di variazioni di mansione.",
    "- Revoca immediata alla cessazione del rapporto o al cambio di ruolo.",
    "",
    "7. Accessi remoti",
    `- Lavoro remoto: ${yesNo(company.profile?.remoteWorkforce)}.`,
    "- Gli accessi remoti devono usare canali protetti e autenticazione adeguata.",
    "",
    ...commonClosing(),
  ];

  return lines.join("\n");
}

function buildBackupProcedure(company: PolicyCompany): string {
  const lines = [
    ...commonHeader("Procedura di Backup", company),
    "5. Strategia di backup",
    "- Devono essere identificati dati, sistemi e configurazioni critiche da sottoporre a backup.",
    "- Le copie devono essere eseguite con frequenza coerente con i requisiti di business.",
    "- I backup devono essere protetti da accessi non autorizzati e da alterazioni.",
    "",
    "6. Ripristino",
    "- Devono essere eseguiti test di restore a intervalli pianificati.",
    "- I tempi di ripristino devono essere compatibili con le esigenze operative.",
    "",
    "7. Conservazione",
    "- La retention dei backup deve essere definita e documentata.",
    "- Le copie obsolete devono essere eliminate in modo controllato.",
    "",
    ...commonClosing(),
  ];

  return lines.join("\n");
}

function buildIncidentResponseProcedure(company: PolicyCompany): string {
  const lines = [
    ...commonHeader("Procedura di Risposta agli Incidenti", company),
    "5. Classificazione e gestione",
    "- Ogni evento sospetto deve essere segnalato tempestivamente.",
    "- Gli incidenti devono essere classificati per impatto, urgenza e ambito.",
    "- Devono essere attivate azioni di contenimento, analisi, eradicazione e recupero.",
    "",
    "6. Escalation",
    "- Gli incidenti gravi devono essere portati rapidamente all'attenzione della direzione.",
    "- Se applicabile, devono essere gestiti obblighi contrattuali, legali o regolatori.",
    "",
    "7. Registrazioni e lesson learned",
    "- Ogni incidente deve essere registrato con cause, effetti, azioni e owner.",
    "- Al termine devono essere definite azioni correttive e preventive.",
    "",
    ...commonClosing(),
  ];

  return lines.join("\n");
}

function buildSecureDevelopmentProcedure(company: PolicyCompany): string {
  const lines = [
    ...commonHeader("Procedura di Sviluppo Sicuro", company),
    "5. Requisiti di sicurezza",
    "- I requisiti di sicurezza devono essere definiti nei progetti software.",
    "- Devono essere considerati autenticazione, autorizzazione, logging e protezione dati.",
    "",
    "6. Controlli di sviluppo",
    "- Devono essere usati repository controllati e gestione versioni.",
    "- Le modifiche devono essere riesaminate tramite code review.",
    "- Le dipendenze software devono essere monitorate e aggiornate.",
    "- Devono essere eseguiti test di sicurezza proporzionati al rischio.",
    "",
    "7. Rilascio",
    "- Le release devono essere autorizzate e tracciate.",
    "- Le configurazioni di produzione devono essere separate da sviluppo e test.",
    "",
    ...commonClosing(),
  ];

  return lines.join("\n");
}

function buildRiskRegister(company: PolicyCompany): string {
  const lines = [
    "REGISTRO DEI RISCHI",
    "",
    `Organizzazione: ${company.name}`,
    `Framework di riferimento: ${company.framework}`,
    "",
    "Metodologia sintetica",
    "- Score inerente = likelihood x impact",
    "- Score residuo = residualLikelihood x residualImpact",
    "",
    "Rischi censiti",
    "",
  ];

  for (const risk of company.risks) {
    lines.push(`Titolo: ${risk.title}`);
    lines.push(`Categoria: ${risk.category}`);
    lines.push(`Asset: ${risk.asset}`);
    lines.push(`Minaccia: ${risk.threat}`);
    lines.push(`Vulnerabilità: ${risk.vulnerability}`);
    lines.push(`Likelihood: ${risk.likelihood}`);
    lines.push(`Impact: ${risk.impact}`);
    lines.push(`Score inerente: ${risk.likelihood * risk.impact}`);
    lines.push(`Residual Likelihood: ${risk.residualLikelihood}`);
    lines.push(`Residual Impact: ${risk.residualImpact}`);
    lines.push(`Score residuo: ${risk.residualLikelihood * risk.residualImpact}`);
    lines.push(`Trattamento: ${risk.treatment}`);
    lines.push(`Stato: ${risk.status}`);
    lines.push("");
  }

  return lines.join("\n");
}

function buildStatementOfApplicability(company: PolicyCompany): string {
  const lines = [
    "STATEMENT OF APPLICABILITY",
    "",
    `Organizzazione: ${company.name}`,
    `Framework di riferimento: ${company.framework}`,
    "",
    "Controlli applicabili",
    "",
  ];

  for (const control of company.controls) {
    lines.push(`${control.baselineControl.code} - ${control.baselineControl.title}`);
    lines.push(`Dominio: ${control.baselineControl.domain}`);
    lines.push(`Applicabile: ${yesNo(control.applicable)}`);
    lines.push(`Stato: ${control.status}`);
    lines.push(`Giustificazione: ${control.justification}`);
    lines.push("");
  }

  return lines.join("\n");
}

function buildGenericProcedure(documentName: string, company: PolicyCompany): string {
  const lines = [
    ...commonHeader(documentName, company),
    "5. Criteri operativi",
    "- Le attività previste dal presente documento devono essere pianificate, eseguite e registrate in modo controllato.",
    "- Devono essere identificati owner, input, output e strumenti utilizzati.",
    "- Le deviazioni devono essere segnalate e gestite tramite azioni correttive quando necessario.",
    "",
    ...commonClosing(),
  ];

  return lines.join("\n");
}

export function generateDocumentContent(
  documentName: string,
  company: PolicyCompany,
): string {
  const normalized = normalizeName(documentName);

  if (normalized === "information security policy") {
    return buildInformationSecurityPolicy(company);
  }

  if (normalized === "access control policy") {
    return buildAccessControlPolicy(company);
  }

  if (normalized === "backup procedure") {
    return buildBackupProcedure(company);
  }

  if (normalized === "incident response procedure") {
    return buildIncidentResponseProcedure(company);
  }

  if (normalized === "secure development procedure") {
    return buildSecureDevelopmentProcedure(company);
  }

  if (normalized === "risk register") {
    return buildRiskRegister(company);
  }

  if (normalized === "statement of applicability") {
    return buildStatementOfApplicability(company);
  }

  return buildGenericProcedure(documentName, company);
}
