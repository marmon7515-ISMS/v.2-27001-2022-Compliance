export type { ProfileInput } from "@/lib/profile-input";

export type SessionUser = {
  id: string;
  username: string;
  role: string;
  companyId: string | null;
};

export type ProfileSuggestion = Partial<import("@/lib/profile-input").ProfileInput> & {
  reasons: string[];
  summary: string;
};
