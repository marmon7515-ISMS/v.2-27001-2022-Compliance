import { ProfileInput } from "@/types";

export const BASELINE_CONTROLS = [
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
  { code: "A.5.34", title: "Privacy and protection of personally identifiable information", domain: "Organizational" },
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
  { code: "A.8.34", title: "Protection of information systems during audit testing", domain: "Technological" }
] as const;

export const CONTROL_RULES: Record<string, (profile: ProfileInput) => { applicable: boolean; justification: string }> = {
  "A.5.23": (profile) => profile.cloudServices
    ? { applicable: true, justification: "Applicabile perché il cliente usa servizi cloud." }
    : { applicable: false, justification: "Non applicabile perché il cliente non usa servizi cloud." },
  "A.8.25": (profile) => profile.softwareDevelopment
    ? { applicable: true, justification: "Applicabile perché il cliente sviluppa software." }
    : { applicable: false, justification: "Non applicabile in assenza di sviluppo software interno." },
  "A.8.26": (profile) => profile.softwareDevelopment
    ? { applicable: true, justification: "Applicabile perché esistono requisiti di sicurezza applicativa." }
    : { applicable: false, justification: "Non applicabile in assenza di sviluppo applicativo." },
  "A.8.27": (profile) => profile.softwareDevelopment
    ? { applicable: true, justification: "Applicabile per architetture e principi di sviluppo sicuro." }
    : { applicable: false, justification: "Non applicabile in assenza di attività di sviluppo." },
  "A.8.28": (profile) => profile.softwareDevelopment
    ? { applicable: true, justification: "Applicabile perché il cliente sviluppa software." }
    : { applicable: false, justification: "Non applicabile perché non risultano attività di coding interno." },
  "A.8.29": (profile) => profile.softwareDevelopment
    ? { applicable: true, justification: "Applicabile perché serve testing di sicurezza in sviluppo e accettazione." }
    : { applicable: false, justification: "Non applicabile se non si sviluppa software." },
  "A.8.30": (profile) => profile.softwareDevelopment
    ? { applicable: true, justification: "Applicabile se parti dello sviluppo sono affidate a terzi." }
    : { applicable: false, justification: "Non applicabile in assenza di sviluppo software." },
  "A.8.31": (profile) => profile.softwareDevelopment
    ? { applicable: true, justification: "Applicabile per separare sviluppo, test e produzione." }
    : { applicable: false, justification: "Non applicabile senza ambienti di sviluppo." },
  "A.6.7": (profile) => profile.remoteWorkforce
    ? { applicable: true, justification: "Applicabile perché il personale opera in remoto o ibrido." }
    : { applicable: false, justification: "Può essere escluso se non esiste lavoro remoto." },
  "A.7.1": (profile) => profile.physicalOfficeControl
    ? { applicable: true, justification: "Applicabile perché il cliente controlla locali e perimetri fisici." }
    : { applicable: false, justification: "Non applicabile se non gestisce sedi o aree protette proprie." },
  "A.7.2": (profile) => profile.physicalOfficeControl
    ? { applicable: true, justification: "Applicabile per accessi fisici a sedi o locali." }
    : { applicable: false, justification: "Non applicabile in assenza di controllo fisico diretto." },
  "A.7.3": (profile) => profile.physicalOfficeControl
    ? { applicable: true, justification: "Applicabile per la sicurezza di uffici e sale." }
    : { applicable: false, justification: "Non applicabile in assenza di locali sotto controllo diretto." },
  "A.7.4": (profile) => profile.physicalOfficeControl
    ? { applicable: true, justification: "Applicabile per monitoraggio fisico di sedi o aree." }
    : { applicable: false, justification: "Non applicabile se il cliente non gestisce direttamente la sicurezza fisica." },
  "A.7.5": (profile) => profile.physicalOfficeControl
    ? { applicable: true, justification: "Applicabile per minacce ambientali e fisiche." }
    : { applicable: false, justification: "Non applicabile in assenza di aree fisiche gestite." },
  "A.7.6": (profile) => profile.physicalOfficeControl
    ? { applicable: true, justification: "Applicabile per aree sicure." }
    : { applicable: false, justification: "Non applicabile senza aree sicure gestite." },
  "A.7.11": (profile) => profile.physicalOfficeControl
    ? { applicable: true, justification: "Applicabile se il cliente gestisce infrastrutture e utilities locali." }
    : { applicable: false, justification: "Non applicabile se strutture e utilities sono in carico a terzi." },
  "A.7.12": (profile) => profile.physicalOfficeControl
    ? { applicable: true, justification: "Applicabile se il cablaggio è sotto responsabilità diretta." }
    : { applicable: false, justification: "Non applicabile in assenza di cablaggi gestiti direttamente." },
  "A.5.19": (profile) => profile.suppliersCritical
    ? { applicable: true, justification: "Applicabile perché esistono fornitori rilevanti." }
    : { applicable: false, justification: "Può essere ridotto se non esistono fornitori critici nel perimetro." },
  "A.5.20": (profile) => profile.suppliersCritical
    ? { applicable: true, justification: "Applicabile perché i fornitori richiedono clausole di sicurezza." }
    : { applicable: false, justification: "Non applicabile se non esistono accordi con fornitori critici." },
  "A.5.21": (profile) => profile.suppliersCritical
    ? { applicable: true, justification: "Applicabile per supply chain ICT rilevante." }
    : { applicable: false, justification: "Non applicabile se la supply chain ICT non è rilevante nel perimetro." },
  "A.5.22": (profile) => profile.suppliersCritical
    ? { applicable: true, justification: "Applicabile per monitorare servizi di fornitori critici." }
    : { applicable: false, justification: "Non applicabile in assenza di fornitori critici." },
  "A.5.30": (profile) => profile.criticalProcesses
    ? { applicable: true, justification: "Applicabile per processi critici e continuità operativa." }
    : { applicable: false, justification: "Meno rilevante se non esistono processi critici o SLA stringenti." },
  "A.5.34": (profile) => profile.personalData
    ? { applicable: true, justification: "Applicabile perché il cliente tratta dati personali." }
    : { applicable: false, justification: "Può essere escluso se non tratta dati personali nel perimetro." }
};

export const BASELINE_RISKS = [
  {
    key: "phishing",
    title: "Phishing su account aziendali",
    category: "Identity",
    asset: "Email e workspace cloud",
    threat: "Furto credenziali",
    vulnerability: "Bassa consapevolezza utenti",
    likelihood: 4,
    impact: 4,
    treatment: "Mitigate",
    trigger: "always"
  },
  {
    key: "endpoint-loss",
    title: "Perdita dati da endpoint non cifrati",
    category: "Endpoint",
    asset: "Laptop e dispositivi mobili",
    threat: "Smarrimento o furto",
    vulnerability: "Cifratura incompleta",
    likelihood: 3,
    impact: 5,
    treatment: "Mitigate",
    trigger: "always"
  },
  {
    key: "cloud-outage",
    title: "Interruzione di servizio del fornitore cloud",
    category: "Third party",
    asset: "Piattaforma cloud",
    threat: "Outage fornitore",
    vulnerability: "Assenza piano di fallback",
    likelihood: 3,
    impact: 4,
    treatment: "Transfer",
    trigger: "cloud"
  },
  {
    key: "secure-dev",
    title: "Codice vulnerabile in produzione",
    category: "Application security",
    asset: "Applicazioni custom",
    threat: "Exploit software",
    vulnerability: "Secure SDLC assente",
    likelihood: 4,
    impact: 5,
    treatment: "Mitigate",
    trigger: "software"
  },
  {
    key: "supplier-breach",
    title: "Violazione di sicurezza presso fornitore critico",
    category: "Supply chain",
    asset: "Servizi terzi",
    threat: "Compromissione fornitore",
    vulnerability: "Due diligence insufficiente",
    likelihood: 3,
    impact: 4,
    treatment: "Mitigate",
    trigger: "suppliers"
  },
  {
    key: "business-disruption",
    title: "Interruzione di processo critico",
    category: "Business continuity",
    asset: "Processi core",
    threat: "Guasto o indisponibilità",
    vulnerability: "Contromisure di continuità insufficienti",
    likelihood: 3,
    impact: 5,
    treatment: "Mitigate",
    trigger: "critical"
  }
] as const;

export const BASELINE_DOCUMENTS = [
  { key: "policy", name: "Information Security Policy", category: "Policy", mandatory: true, trigger: "always" },
  { key: "risk-method", name: "Risk Assessment Methodology", category: "Methodology", mandatory: true, trigger: "always" },
  { key: "risk-register", name: "Risk Register", category: "Register", mandatory: true, trigger: "always" },
  { key: "soa", name: "Statement of Applicability", category: "Register", mandatory: true, trigger: "always" },
  { key: "asset-inventory", name: "Asset Inventory", category: "Register", mandatory: true, trigger: "always" },
  { key: "access-control", name: "Access Control Procedure", category: "Procedure", mandatory: true, trigger: "always" },
  { key: "incident", name: "Incident Response Procedure", category: "Procedure", mandatory: true, trigger: "always" },
  { key: "internal-audit", name: "Internal Audit Procedure", category: "Procedure", mandatory: true, trigger: "always" },
  { key: "management-review", name: "Management Review Minutes Template", category: "Template", mandatory: true, trigger: "always" },
  { key: "supplier", name: "Supplier Security Assessment", category: "Template", mandatory: false, trigger: "suppliers" },
  { key: "cloud", name: "Cloud Security Procedure", category: "Procedure", mandatory: false, trigger: "cloud" },
  { key: "secure-dev", name: "Secure Development Procedure", category: "Procedure", mandatory: false, trigger: "software" },
  { key: "bcp", name: "Business Continuity Procedure", category: "Procedure", mandatory: false, trigger: "critical" },
  { key: "remote", name: "Remote Working Policy", category: "Policy", mandatory: false, trigger: "remote" },
  { key: "physical", name: "Physical Security Procedure", category: "Procedure", mandatory: false, trigger: "physical" }
] as const;

export const DEFAULT_PROFILE: ProfileInput = {
  cloudServices: true,
  softwareDevelopment: false,
  suppliersCritical: true,
  remoteWorkforce: true,
  physicalOfficeControl: false,
  criticalProcesses: true,
  personalData: true,
  regulatedSector: false,
  customerDescription: "PMI che eroga servizi digitali B2B con personale in remoto e servizi in cloud.",
  uploadedContext: ""
};
