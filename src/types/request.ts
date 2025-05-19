
export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'released';

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
  approvedBy?: string;
  releasedBy?: string;
  ceoComments?: string;
  attachmentUrl?: string;
}
