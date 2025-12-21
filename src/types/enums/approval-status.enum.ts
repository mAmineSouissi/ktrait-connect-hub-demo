/**
 * User approval status enum
 */
export enum ApprovalStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export type ApprovalStatusType =
  | ApprovalStatus.PENDING
  | ApprovalStatus.APPROVED
  | ApprovalStatus.REJECTED;
