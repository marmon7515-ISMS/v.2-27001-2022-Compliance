export type BaselineControl = {
  code: string;
  title: string;
  domain: "Organizational" | "People" | "Physical" | "Technological";
};

export type BaselineRisk = {
  key: string;
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
  trigger:
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
};

export type BaselineDocument = {
  key: string;
  name: string;
  category: string;
  mandatory: boolean;
  trigger:
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
};

export const BASELINE_CONTROLS: BaselineControl[] = [
  { code: "A.5.1", title: "Policies for information security", domain: "Organizational" },
  { code: "A.5.2", title: "Information security roles and responsibilities", domain: "Organizational" },
  { code: "A.5.3", title: "Segregation of duties", domain: "Organizational" },
  { code: "A.5.4", title: "Management responsibilities", domain: "Organizational" },
  { code: "A.5.5", title: "Contact with authorities", domain: "Organizational" },
  { code: "A.5.6", title: "Contact with special interest groups", domain: "Organizational" },
  { code: "A.5.7", title: "Threat intelligence", domain: "Organizational" },
  { code: "A.5.8", title: "Information security in project management", domain: "Organizational" },
  { code: "A.5.9", title: "Inventory of information and other associated assets", domain: "Organizational" },
  { code: "A.5.10", title: "Acceptable use of information and other associated assets", domain: "Organizational" },
  { code: "A.5.11", title: "Return of assets", domain: "Organizational" },
  { code: "A.5.12", title: "Classification of information", domain: "Organizational" },
  { code: "A.5.13", title: "Labelling of information", domain: "Organizational" },
  { code: "A.5.14", title: "Information transfer", domain: "Organizational" },
  { code: "A.5.15", title: "Access control", domain: "Organizational" },
  { code: "A.5.16", title: "Identity management", domain: "Organizational" },
  { code: "A.5.17", title: "Authentication information", domain: "Organizational" },
  { code: "A.5.18", title: "Access rights", domain: "Organizational" },
  { code: "A.5.19", title: "Information security in supplier relationships", domain: "Organizational" },
  { code: "A.5.20", title: "Addressing information security within supplier agreements", domain: "Organizational" },
  { code: "A.5.21", title: "Managing information security in the ICT supply chain", domain: "Organizational" },
  { code: "A.5.22", title: "Monitoring, review and change management of supplier services", domain: "Organizational" },
  { code: "A.5.23", title: "Information security for use of cloud services", domain: "Organizational" },
  { code: "A.5.24", title: "Information security incident management planning and preparation", domain: "Organizational" },
  { code: "A.5.25", title: "Assessment and decision on information security events", domain: "Organizational" },
  { code: "A.5.26", title: "Response to information security incidents", domain: "Organizational" },
  { code: "A.5.27", title: "Learning from information security incidents", domain: "Organizational" },
  { code: "A.5.28", title: "Collection of evidence", domain: "Organizational" },
  { code: "A.5.29", title: "Information security during disruption", domain: "Organizational" },
  { code: "A.5.30", title: "ICT readiness for business continuity", domain: "Organizational" },
  { code: "A.5.31", title: "Legal, statutory, regulatory and contractual requirements", domain: "Organizational" },
  { code: "A.5.32", title: "Intellectual property rights", domain: "Organizational" },
  { code: "A.5.33", title: "Protection of records", domain: "Organizational" },
  { code: "A.5.34", title: "Privacy and protection of PII", domain: "Organizational" },
  { code: "A.5.35", title: "Independent review of information security", domain: "Organizational" },
  { code: "A.5.36", title: "Compliance with policies, rules and standards for information security", domain: "Organizational" },
  { code: "A.5.37", title: "Documented operating procedures", domain: "Organizational" },

  { code: "A.6.1", title: "Screening", domain: "People" },
  { code: "A.6.2", title: "Terms and conditions of employment", domain: "People" },
  { code: "A.6.3", title: "Information security awareness, education and training", domain: "People" },
  { code: "A.6.4", title: "Disciplinary process", domain: "People" },
  { code: "A.6.5", title: "Responsibilities after termination or change of employment", domain: "People" },
  { code: "A.6.6", title: "Confidentiality or non-disclosure agreements", domain: "People" },
  { code: "A.6.7", title: "Remote working", domain: "People" },
  { code: "A.6.8", title: "Information security event reporting", domain: "People" },

  { code: "A.7.1", title: "Physical security perimeters", domain: "Physical" },
  { code: "A.7.2", title: "Physical entry", domain: "Physical" },
  { code: "A.7.3", title: "Securing offices, rooms and facilities", domain: "Physical" },
  { code: "A.7.4", title: "Physical security monitoring", domain: "Physical" },
  { code: "A.7.5", title: "Protecting against physical and environmental threats", domain: "Physical" },
  { code: "A.7.6", title: "Working in secure areas", domain: "Physical" },
  { code: "A.7.7", title: "Clear desk and clear screen", domain: "Physical" },
  { code: "A.7.8", title: "Equipment siting and protection", domain: "Physical" },
  { code: "A.7.9", title: "Security of assets off-premises", domain: "Physical" },
  { code: "A.7.10", title: "Storage media", domain: "Physical" },
  { code: "A.7.11", title: "Supporting utilities", domain: "Physical" },
  { code: "A.7.12", title: "Cabling security", domain: "Physical" },
  { code: "A.7.13", title: "Equipment maintenance", domain: "Physical" },
  { code: "A.7.14", title: "Secure disposal or re-use of equipment", domain: "Physical" },

  { code: "A.8.1", title: "User endpoint devices", domain: "Technological" },
  { code: "A.8.2", title: "Privileged access rights", domain: "Technological" },
  { code: "A.8.3", title: "Information access restriction", domain: "Technological" },
  { code: "A.8.4", title: "Access to source code", domain: "Technological" },
  { code: "A.8.5", title: "Secure authentication", domain: "Technological" },
  { code: "A.8.6", title: "Capacity management", domain: "Technological" },
  { code: "A.8.7", title: "Protection against malware", domain: "Technological" },
  { code: "A.8.8", title: "Management of technical vulnerabilities", domain: "Technological" },
  { code: "A.8.9", title: "Configuration management", domain: "Technological" },
  { code: "A.8.10", title: "Information deletion", domain: "Technological" },
  { code: "A.8.11", title: "Data masking", domain: "Technological" },
  { code: "A.8.12", title: "Data leakage prevention", domain: "Technological" },
  { code: "A.8.13", title: "Information backup", domain: "Technological" },
  { code: "A.8.14", title: "Redundancy of information processing facilities", domain: "Technological" },
  { code: "A.8.15", title: "Logging", domain: "Technological" },
  { code: "A.8.16", title: "Monitoring activities", domain: "Technological" },
  { code: "A.8.17", title: "Clock synchronization", domain: "Technological" },
  { code: "A.8.18", title: "Use of privileged utility programs", domain: "Technological" },
  { code: "A.8.19", title: "Installation of software on operational systems", domain: "Technological" },
  { code: "A.8.20", title: "Networks security", domain: "Technological" },
  { code: "A.8.21", title: "Security of network services", domain: "Technological" },
  { code: "A.8.22", title: "Segregation of networks", domain: "Technological" },
  { code: "A.8.23", title: "Web filtering", domain: "Technological" },
  { code: "A.8.24", title: "Use of cryptography", domain: "Technological" },
  { code: "A.8.25", title: "Secure development life cycle", domain: "Technological" },
  { code: "A.8.26", title: "Application security requirements", domain: "Technological" },
  { code: "A.8.27", title: "Secure system architecture and engineering principles", domain: "Technological" },
  { code: "A.8.28", title: "Secure coding", domain: "Technological" },
  { code: "A.8.29", title: "Security testing in development and acceptance", domain: "Technological" },
  { code: "A.8.30", title: "Outsourced development", domain: "Technological" },
  { code: "A.8.31", title: "Separation of development, test and production environments", domain: "Technological" },
  { code: "A.8.32", title: "Change management", domain: "Technological" },
  { code: "A.8.33", title: "Test information", domain: "Technological" },
  { code: "A.8.34", title: "Protection of information systems during audit testing", domain: "Technological" },
];

export const BASELINE_RISKS: BaselineRisk[] = [
  {
    key: "phishing",
    title: "Phishing su account aziendali",
    category: "Identity",
    asset: "Email e identità digitali",
    threat: "Furto credenziali",
    vulnerability: "Bassa consapevolezza utenti",
    likelihood: 4,
    impact: 4,
    residualLikelihood: 2,
    residualImpact: 3,
    treatment: "Mitigate",
    trigger: "always",
  },
  {
    key: "cloud-misconfiguration",
    title: "Errata configurazione di servizi cloud",
    category: "Cloud",
    asset: "Piattaforme SaaS / IaaS / PaaS",
    threat: "Esposizione dati o interruzione servizio",
    vulnerability: "Configurazioni non controllate",
    likelihood: 4,
    impact: 5,
    residualLikelihood: 2,
    residualImpact: 3,
    treatment: "Mitigate",
    trigger: "cloudHosted",
  },
  {
    key: "supplier-breach",
    title: "Violazione sicurezza presso fornitore critico",
    category: "Third Party",
    asset: "Servizi esternalizzati",
    threat: "Compromissione catena di fornitura",
    vulnerability: "Due diligence insufficiente",
    likelihood: 3,
    impact: 5,
    residualLikelihood: 2,
    residualImpact: 3,
    treatment: "Mitigate",
    trigger: "suppliersCritical",
  },
  {
    key: "remote-endpoint-loss",
    title: "Perdita o compromissione di endpoint remoti",
    category: "Endpoint",
    asset: "Laptop e workstation remote",
    threat: "Furto, smarrimento, accesso non autorizzato",
    vulnerability: "Controlli endpoint insufficienti",
    likelihood: 4,
    impact: 4,
    residualLikelihood: 2,
    residualImpact: 3,
    treatment: "Mitigate",
    trigger: "remoteWorkforce",
  },
  {
    key: "physical-intrusion",
    title: "Accesso fisico non autorizzato",
    category: "Physical",
    asset: "Uffici, archivi, locali tecnici",
    threat: "Intrusione o manomissione",
    vulnerability: "Controlli fisici inadeguati",
    likelihood: 3,
    impact: 4,
    residualLikelihood: 2,
    residualImpact: 3,
    treatment: "Mitigate",
    trigger: "physicalOfficeControl",
  },
  {
    key: "secure-dev-gap",
    title: "Difetti di sicurezza nello sviluppo software",
    category: "Application",
    asset: "Applicazioni sviluppate internamente",
    threat: "Vulnerabilità in produzione",
    vulnerability: "SDLC non strutturato",
    likelihood: 4,
    impact: 5,
    residualLikelihood: 2,
    residualImpact: 3,
    treatment: "Mitigate",
    trigger: "softwareDevelopment",
  },
  {
    key: "privacy-noncompliance",
    title: "Trattamento dati personali non conforme",
    category: "Compliance",
    asset: "Dati personali",
    threat: "Violazione normativa / data breach",
    vulnerability: "Controlli privacy incompleti",
    likelihood: 3,
    impact: 5,
    residualLikelihood: 2,
    residualImpact: 3,
    treatment: "Mitigate",
    trigger: "personalDataProcessing",
  },
  {
    key: "special-data-exposure",
    title: "Esposizione di categorie particolari di dati",
    category: "Privacy",
    asset: "Dati particolari",
    threat: "Disclosure non autorizzata",
    vulnerability: "Misure rafforzate insufficienti",
    likelihood: 3,
    impact: 5,
    residualLikelihood: 1,
    residualImpact: 3,
    treatment: "Mitigate",
    trigger: "specialCategoryData",
  },
  {
    key: "payment-fraud",
    title: "Frode o abuso nei processi di pagamento",
    category: "Financial",
    asset: "Processi di pagamento",
    threat: "Manipolazione transazioni",
    vulnerability: "Controlli applicativi e segregazione deboli",
    likelihood: 3,
    impact: 5,
    residualLikelihood: 2,
    residualImpact: 3,
    treatment: "Mitigate",
    trigger: "paymentProcessing",
  },
  {
    key: "regulatory-noncompliance",
    title: "Inadempimento regolatorio",
    category: "Compliance",
    asset: "Processi soggetti a regolazione",
    threat: "Sanzioni o blocchi operativi",
    vulnerability: "Mappatura requisiti incompleta",
    likelihood: 3,
    impact: 5,
    residualLikelihood: 2,
    residualImpact: 3,
    treatment: "Mitigate",
    trigger: "regulatedMarket",
  },
  {
    key: "continuity-disruption",
    title: "Interruzione di processi critici",
    category: "Continuity",
    asset: "Processi essenziali di business",
    threat: "Indisponibilità ICT",
    vulnerability: "Piani di continuità non maturi",
    likelihood: 3,
    impact: 5,
    residualLikelihood: 2,
    residualImpact: 3,
    treatment: "Mitigate",
    trigger: "businessContinuityRequired",
  },
  {
    key: "mobile-device-exposure",
    title: "Compromissione di dispositivi mobili",
    category: "Mobile",
    asset: "Smartphone e tablet aziendali",
    threat: "Smarrimento, malware, accesso abusivo",
    vulnerability: "Hardening e MDM insufficienti",
    likelihood: 3,
    impact: 4,
    residualLikelihood: 2,
    residualImpact: 3,
    treatment: "Mitigate",
    trigger: "mobileDevicesUsed",
  },
  {
    key: "privileged-access-abuse",
    title: "Abuso di privilegi elevati",
    category: "Access",
    asset: "Account amministrativi",
    threat: "Uso improprio o compromissione",
    vulnerability: "Governance privilegi insufficiente",
    likelihood: 3,
    impact: 5,
    residualLikelihood: 2,
    residualImpact: 3,
    treatment: "Mitigate",
    trigger: "privilegedAccessManaged",
  },
  {
    key: "monitoring-gap",
    title: "Mancata rilevazione di eventi di sicurezza",
    category: "Monitoring",
    asset: "Log e sistemi di monitoraggio",
    threat: "Incidente non rilevato tempestivamente",
    vulnerability: "Logging/monitoring insufficienti",
    likelihood: 4,
    impact: 4,
    residualLikelihood: 2,
    residualImpact: 3,
    treatment: "Mitigate",
    trigger: "securityMonitoringNeeded",
  },
];

export const BASELINE_DOCUMENTS: BaselineDocument[] = [
  { key: "isms-policy", name: "Politica per la sicurezza delle informazioni", category: "Policy", mandatory: true, trigger: "always" },
  { key: "risk-method", name: "Metodologia di valutazione del rischio", category: "Metodo", mandatory: true, trigger: "always" },
  { key: "soa", name: "Statement of Applicability", category: "Registro", mandatory: true, trigger: "always" },
  { key: "incident", name: "Procedura di gestione incidenti", category: "Procedura", mandatory: true, trigger: "always" },
  { key: "access-control", name: "Procedura di controllo accessi", category: "Procedura", mandatory: true, trigger: "always" },
  { key: "asset-inventory", name: "Inventario degli asset informativi", category: "Registro", mandatory: true, trigger: "always" },
  { key: "supplier-security", name: "Procedura sicurezza fornitori", category: "Procedura", mandatory: false, trigger: "suppliersCritical" },
  { key: "cloud-security", name: "Procedura sicurezza servizi cloud", category: "Procedura", mandatory: false, trigger: "cloudHosted" },
  { key: "secure-development", name: "Procedura sviluppo sicuro", category: "Procedura", mandatory: false, trigger: "softwareDevelopment" },
  { key: "remote-working", name: "Policy lavoro remoto", category: "Policy", mandatory: false, trigger: "remoteWorkforce" },
  { key: "physical-security", name: "Procedura sicurezza fisica", category: "Procedura", mandatory: false, trigger: "physicalOfficeControl" },
  { key: "privacy", name: "Procedura protezione dati personali", category: "Procedura", mandatory: false, trigger: "personalDataProcessing" },
  { key: "special-data", name: "Misure rafforzate per dati particolari", category: "Procedura", mandatory: false, trigger: "specialCategoryData" },
  { key: "payments", name: "Controlli di sicurezza sui pagamenti", category: "Procedura", mandatory: false, trigger: "paymentProcessing" },
  { key: "regulatory", name: "Matrice requisiti legali e regolatori", category: "Registro", mandatory: false, trigger: "regulatedMarket" },
  { key: "business-continuity", name: "Procedura continuità operativa ICT", category: "Procedura", mandatory: false, trigger: "businessContinuityRequired" },
  { key: "mobile-device", name: "Policy dispositivi mobili", category: "Policy", mandatory: false, trigger: "mobileDevicesUsed" },
  { key: "privileged-access", name: "Procedura gestione privilegi", category: "Procedura", mandatory: false, trigger: "privilegedAccessManaged" },
  { key: "logging-monitoring", name: "Procedura logging e monitoraggio", category: "Procedura", mandatory: false, trigger: "securityMonitoringNeeded" },
];
