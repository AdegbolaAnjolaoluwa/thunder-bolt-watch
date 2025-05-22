
export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'released' | 'done';

export interface FundRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  purpose: string;
  description: string;
  status: RequestStatus;
  dateCreated: string;
  dateApproved?: string;
  dateReleased?: string;
  dateDone?: string;
  approvedBy?: string;
  releasedBy?: string;
  doneBy?: string;
  ceoComments?: string;
  attachmentUrl?: string;
  requestedFor?: string; // Added to track who the request is for (staff name)
}

export interface Memo {
  id: string;
  requestId: string;
  text: string;
  amount: number;
  purpose: string;
  requestedFor: string;
  createdBy: string;
  createdById: string;
  createdAt: string;
}
