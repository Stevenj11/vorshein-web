export type MemberStatus = "active" | "retained" | "inactive";

export type Member = {
  id: string; // VRSN-#### (permanent, no "A", never changes on promotion)
  applicationId: string;
  generationId: string;
  division: "A" | "B";
  entryLevel: "foundation" | "performance" | "tactical";
  currentLevel: "foundation" | "performance" | "tactical";
  status: MemberStatus;
  admittedAt: string;
  firstName: string;
  lastName: string;
  photoUrl: string | null;
  clearances: {
    foundation: "cleared" | "retained" | null;
    performance: "certified" | "retained" | null;
    tactical: "certified" | "retained" | null;
  };
  rosterConsent: boolean;
  rosterDisplay: "full_name" | "first_initial" | "id_only" | null;
};
