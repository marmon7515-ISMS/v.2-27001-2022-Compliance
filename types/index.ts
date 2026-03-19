export type ProfileInput = {
  cloudServices: boolean;
  softwareDevelopment: boolean;
  suppliersCritical: boolean;
  remoteWorkforce: boolean;
  physicalOfficeControl: boolean;
  criticalProcesses: boolean;
  personalData: boolean;
  regulatedSector: boolean;
  customerDescription: string;
  uploadedContext: string;
};

export type SessionUser = {
  id: string;
  username: string;
  role: string;
  companyId: string | null;
};

export type ProfileSuggestion = Partial<ProfileInput> & {
  reasons: string[];
  summary: string;
};
