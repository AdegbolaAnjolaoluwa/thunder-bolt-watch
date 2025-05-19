
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRequests } from '@/contexts/RequestContext';
import DashboardLayout from '@/components/DashboardLayout';
import RequestList from '@/components/RequestList';
import StatsCards from '@/components/StatsCards';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const CEODashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { 
    requests, 
    getPendingRequests, 
    getApprovedRequests, 
    getRejectedRequests,
    getReleasedRequests,
    getDoneRequests,
    approveRequest,
    rejectRequest
  } = useRequests();

  if (!currentUser) return null;

  const pendingRequests = getPendingRequests();
  const approvedRequests = getApprovedRequests();
  const rejectedRequests = getRejectedRequests();
  const releasedRequests = getReleasedRequests();
  const doneRequests = getDoneRequests();
  
  const totalRequests = requests.length;
  
  return (
    <DashboardLayout title="CEO Dashboard">
      <StatsCards requests={requests} userRole="ceo" />
      
      <Card className="mt-6 border-red-200 bg-red-50/30">
        <CardHeader className="bg-red-100/50 border-b border-red-200">
          <CardTitle>CEO Control Panel</CardTitle>
          <CardDescription>
            Review and manage fund requests from the accounting department
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-sm text-muted-foreground mb-4">
            You have {totalRequests} total requests in the system, with {pendingRequests.length} pending your approval.
          </p>
        </CardContent>
      </Card>
      
      <div className="mt-6">
        <Tabs defaultValue="pending">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="pending">Pending ({pendingRequests.length})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({approvedRequests.length})</TabsTrigger>
            <TabsTrigger value="released">Released ({releasedRequests.length})</TabsTrigger>
            <TabsTrigger value="done">Completed ({doneRequests.length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({rejectedRequests.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            <RequestList
              requests={pendingRequests}
              title="Pending Approval Requests"
              description="Requests from accounting awaiting your approval"
              onApprove={approveRequest}
              onReject={rejectRequest}
            />
          </TabsContent>
          
          <TabsContent value="approved">
            <RequestList
              requests={approvedRequests}
              title="Approved Requests"
              description="Requests you have approved, pending fund release"
            />
          </TabsContent>
          
          <TabsContent value="released">
            <RequestList
              requests={releasedRequests}
              title="Released Requests"
              description="Requests with funds released by accounting"
            />
          </TabsContent>
          
          <TabsContent value="done">
            <RequestList
              requests={doneRequests}
              title="Completed Requests"
              description="Requests marked as completed by accounting"
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
