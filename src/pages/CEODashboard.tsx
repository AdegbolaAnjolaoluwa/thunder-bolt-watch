
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRequests } from '@/contexts/RequestContext';
import DashboardLayout from '@/components/DashboardLayout';
import RequestList from '@/components/RequestList';
import StatsCards from '@/components/StatsCards';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CEODashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { 
    requests, 
    getPendingRequests, 
    getApprovedRequests, 
    getRejectedRequests,
    approveRequest,
    rejectRequest
  } = useRequests();

  if (!currentUser) return null;

  const pendingRequests = getPendingRequests();
  const approvedRequests = getApprovedRequests();
  const rejectedRequests = getRejectedRequests();
  
  return (
    <DashboardLayout title="CEO Dashboard">
      <StatsCards requests={requests} userRole="ceo" />
      
      <div className="mt-6">
        <Tabs defaultValue="pending">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="pending">Pending Approval ({pendingRequests.length})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({approvedRequests.length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({rejectedRequests.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            <RequestList
              requests={pendingRequests}
              title="Pending Requests"
              description="Requests awaiting your approval"
              onApprove={approveRequest}
              onReject={rejectRequest}
            />
          </TabsContent>
          
          <TabsContent value="approved">
            <RequestList
              requests={approvedRequests}
              title="Approved Requests"
              description="Requests you have approved"
            />
          </TabsContent>
          
          <TabsContent value="rejected">
            <RequestList
              requests={rejectedRequests}
              title="Rejected Requests"
              description="Requests you have rejected"
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default CEODashboard;
