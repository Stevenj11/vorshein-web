import { ApplicationStatus } from "./types";

export type StatusColor = "green" | "red" | "yellow" | "gray";

export type StatusDisplay = {
  color: StatusColor;
  labelKey: string;
  detailKey: string;
};

/**
 * Public-facing status semantics — collapses the 11 internal
 * ApplicationStatus values (RESERVED/CHECKED_IN/SIGNED/...) into the
 * simple red/green/yellow/gray dot an applicant actually cares about:
 * "did they confirm me yet?"
 */
export const STATUS_DISPLAY: Record<ApplicationStatus, StatusDisplay> = {
  RESERVED: { color: "red", labelKey: "pending", detailKey: "pendingDetail" },
  WAITLIST: { color: "yellow", labelKey: "waitlist", detailKey: "waitlistDetail" },
  CONFIRMED: { color: "green", labelKey: "confirmed", detailKey: "confirmedDetail" },
  CHECKED_IN: { color: "green", labelKey: "confirmed", detailKey: "confirmedDetail" },
  SIGNED: { color: "green", labelKey: "confirmed", detailKey: "confirmedDetail" },
  PAID: { color: "green", labelKey: "confirmed", detailKey: "confirmedDetail" },
  ASSESSED: { color: "green", labelKey: "confirmed", detailKey: "confirmedDetail" },
  MANUAL_REVIEW: { color: "yellow", labelKey: "review", detailKey: "reviewDetail" },
  ADMITTED: { color: "green", labelKey: "admitted", detailKey: "admittedDetail" },
  NOT_YET_ELIGIBLE: { color: "gray", labelKey: "notYetEligible", detailKey: "notYetEligibleDetail" },
  NO_SHOW: { color: "gray", labelKey: "noShow", detailKey: "noShowDetail" },
};
