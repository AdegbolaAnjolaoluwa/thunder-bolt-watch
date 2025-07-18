import React, { createContext, useContext, useState } from 'react';
import { FundRequest, RequestStatus, Memo } from '@/types/request';
import { User } from '@/types/auth';
import { toast } from "@/components/ui/sonner";

interface RequestContextType {
  requests: FundRequest[];
  memos: Memo[];
  createRequest: (data: Omit<FundRequest, 'id' | 'status' | 'dateCreated' | 'userId' | 'userName'>) => void;
  approveRequest: (requestId: string, comments?: string) => void;
  rejectRequest: (requestId: string, comments?: string) => void;
  releaseFunds: (requestId: string) => void;
  markAsDone: (requestId: string) => void;
  convertToMemo: (requestId: string, memoText?: string) => void; // New function
  getUserRequests: (userId: string) => FundRequest[];
  getPendingRequests: () => FundRequest[];
  getApprovedRequests: () => FundRequest[];
  getRejectedRequests: () => FundRequest[];
  getReleasedRequests: () => FundRequest[];
  getDoneRequests: () => FundRequest[];
  getMemos: () => Memo[];
}

// Mock initial requests for demonstration
const INITIAL_REQUESTS: FundRequest[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Mark Accountant',
    requestedFor: 'John Staff',
    amount: 5000,
    purpose: 'Equipment purchase',
    description: 'New security cameras for the north facility',
    status: 'pending',
    dateCreated: new Date(2023, 4, 10).toISOString(),
  },
  {
    id: '2',
    userId: '1',
    userName: 'Mark Accountant',
    requestedFor: 'John Staff',
    amount: 2500,
    purpose: 'Vehicle maintenance',
    description: 'Routine maintenance for patrol vehicles',
    status: 'approved',
    dateCreated: new Date(2023, 4, 5).toISOString(),
    dateApproved: new Date(2023, 4, 7).toISOString(),
    approvedBy: 'Jane CEO',
    ceoComments: 'Approved as requested',
  },
  {
    id: '3',
    userId: '1',
    userName: 'Mark Accountant',
    requestedFor: 'John Staff',
    amount: 10000,
    purpose: 'Training program',
    description: 'Annual staff security training',
    status: 'released',
    dateCreated: new Date(2023, 3, 20).toISOString(),
    dateApproved: new Date(2023, 3, 22).toISOString(),
    dateReleased: new Date(2023, 3, 25).toISOString(),
    approvedBy: 'Jane CEO',
    releasedBy: 'Mark Accountant',
  },
  {
    id: '4',
    userId: '1',
    userName: 'Mark Accountant',
    requestedFor: 'John Staff',
    amount: 3000,
    purpose: 'Travel expenses',
    description: 'Client site visit in Los Angeles',
    status: 'rejected',
    dateCreated: new Date(2023, 4, 1).toISOString(),
    dateApproved: new Date(2023, 4, 3).toISOString(),
    approvedBy: 'Jane CEO',
    ceoComments: 'Please use video conference instead',
  }
];

// Initial memos
const INITIAL_MEMOS: Memo[] = [];

const RequestContext = createContext<RequestContextType | undefined>(undefined);

export const RequestProvider: React.FC<{ children: React.ReactNode, currentUser: User | null }> = ({ 
  children, 
  currentUser 
}) => {
  const [requests, setRequests] = useState<FundRequest[]>(INITIAL_REQUESTS);
  const [memos, setMemos] = useState<Memo[]>(INITIAL_MEMOS);

  const createRequest = (data: Omit<FundRequest, 'id' | 'status' | 'dateCreated' | 'userId' | 'userName'>) => {
    if (!currentUser) {
      toast.error("Authentication required", {
        description: "You must be logged in to create a request"
      });
      return;
    }

    // Only allow accountants to create requests
    if (currentUser.role !== 'accountant') {
      toast.error("Permission denied", {
        description: "Only accountants can create fund requests"
      });
      return;
    }

    const newRequest: FundRequest = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      status: 'pending',
      dateCreated: new Date().toISOString(),
      ...data
    };

    setRequests(prevRequests => [newRequest, ...prevRequests]);
    
    toast.success("Request submitted", {
      description: `Your request for $${data.amount.toLocaleString()} has been submitted`
    });
  };

  const approveRequest = (requestId: string, comments?: string) => {
    if (!currentUser || currentUser.role !== 'ceo') {
      toast.error("Permission denied", {
        description: "Only CEOs can approve requests"
      });
      return;
    }

    setRequests(prevRequests =>
      prevRequests.map(request =>
        request.id === requestId && request.status === 'pending'
          ? {
              ...request,
              status: 'approved',
              dateApproved: new Date().toISOString(),
              approvedBy: currentUser.name,
              ceoComments: comments
            }
          : request
      )
    );

    toast.success("Request approved", {
      description: `Fund request #${requestId} has been approved`
    });
  };

  const rejectRequest = (requestId: string, comments?: string) => {
    if (!currentUser || currentUser.role !== 'ceo') {
      toast.error("Permission denied", {
        description: "Only CEOs can reject requests"
      });
      return;
    }

    setRequests(prevRequests =>
      prevRequests.map(request =>
        request.id === requestId && request.status === 'pending'
          ? {
              ...request,
              status: 'rejected',
              dateApproved: new Date().toISOString(),
              approvedBy: currentUser.name,
              ceoComments: comments
            }
          : request
      )
    );

    toast.success("Request rejected", {
      description: `Fund request #${requestId} has been rejected`
    });
  };

  const releaseFunds = (requestId: string) => {
    if (!currentUser || currentUser.role !== 'accountant') {
      toast.error("Permission denied", {
        description: "Only accountants can release funds"
      });
      return;
    }

    setRequests(prevRequests =>
      prevRequests.map(request =>
        request.id === requestId && request.status === 'approved'
          ? {
              ...request,
              status: 'released',
              dateReleased: new Date().toISOString(),
              releasedBy: currentUser.name
            }
          : request
      )
    );

    toast.success("Funds released", {
      description: `Funds for request #${requestId} have been released`
    });
  };

  // Function to mark released funds as done
  const markAsDone = (requestId: string) => {
    if (!currentUser || currentUser.role !== 'accountant') {
      toast.error("Permission denied", {
        description: "Only accountants can mark requests as done"
      });
      return;
    }

    setRequests(prevRequests =>
      prevRequests.map(request =>
        request.id === requestId && request.status === 'released'
          ? {
              ...request,
              status: 'done',
              dateDone: new Date().toISOString(),
              doneBy: currentUser.name
            }
          : request
      )
    );

    toast.success("Request completed", {
      description: `Fund request #${requestId} has been marked as done`
    });
  };

  // New function to convert a request to a memo
  const convertToMemo = (requestId: string, memoText?: string) => {
    if (!currentUser || currentUser.role !== 'accountant') {
      toast.error("Permission denied", {
        description: "Only accountants can create memos"
      });
      return;
    }

    // Find the request to convert
    const request = requests.find(req => req.id === requestId);
    if (!request) {
      toast.error("Request not found", {
        description: "The request you're trying to convert was not found"
      });
      return;
    }

    // Create a new memo
    const newMemo: Memo = {
      id: Date.now().toString(),
      requestId: request.id,
      text: memoText || `Memo regarding fund request for ${request.requestedFor}: ${request.purpose}`,
      amount: request.amount,
      createdBy: currentUser.name,
      createdById: currentUser.id,
      createdAt: new Date().toISOString(),
      purpose: request.purpose,
      requestedFor: request.requestedFor || '',
    };

    // Add the memo to the list
    setMemos(prevMemos => [newMemo, ...prevMemos]);
    
    toast.success("Memo created", {
      description: "The request has been converted to a memo"
    });
  };

  const getUserRequests = (userId: string) => {
    return requests.filter(request => request.userId === userId);
  };

  const getRequestsByStatus = (status: RequestStatus) => {
    return requests.filter(request => request.status === status);
  };

  const getPendingRequests = () => getRequestsByStatus('pending');
  const getApprovedRequests = () => getRequestsByStatus('approved');
  const getRejectedRequests = () => getRequestsByStatus('rejected');
  const getReleasedRequests = () => getRequestsByStatus('released');
  const getDoneRequests = () => getRequestsByStatus('done');
  const getMemos = () => memos;

  const value = {
    requests,
    memos,
    createRequest,
    approveRequest,
    rejectRequest,
    releaseFunds,
    markAsDone,
    convertToMemo,
    getUserRequests,
    getPendingRequests,
    getApprovedRequests,
    getRejectedRequests,
    getReleasedRequests,
    getDoneRequests,
    getMemos
  };

  return <RequestContext.Provider value={value}>{children}</RequestContext.Provider>;
};

export const useRequests = () => {
  const context = useContext(RequestContext);
  if (context === undefined) {
    throw new Error('useRequests must be used within a RequestProvider');
  }
  return context;
};
