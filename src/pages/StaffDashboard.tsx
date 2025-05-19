
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRequests } from '@/contexts/RequestContext';
import DashboardLayout from '@/components/DashboardLayout';
import RequestForm from '@/components/RequestForm';
import RequestList from '@/components/RequestList';
import StatsCards from '@/components/StatsCards';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const StaffDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { getUserRequests } = useRequests();
  
  if (!currentUser) return null;
  
  const userRequests = getUserRequests(currentUser.id);
  const pendingRequests = userRequests.filter(req => req.status === 'pending');
  const approvedRequests = userRequests.filter(req => req.status === 'approved');
  const rejectedRequests = userRequests.filter(req => req.status === 'rejected');
  const releasedRequests = userRequests.filter(req => req.status === 'released');
  
  return (
    <DashboardLayout title="Staff Dashboard">
      <StatsCards requests={userRequests} userRole="staff" />
      
      <div className="grid md:grid-cols-3 gap-6 mt-6">
        <div className="md:col-span-1">
          <RequestForm />
        </div>
        
        <div className="md:col-span-2">
          <Tabs defaultValue="pending">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="pending">Pending ({pendingRequests.length})</TabsTrigger>
              <TabsTrigger value="approved">Approved ({approvedRequests.length})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({rejectedRequests.length})</TabsTrigger>
              <TabsTrigger value="released">Released ({releasedRequests.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending">
              <RequestList
                requests={pendingRequests}
                title="Pending Requests"
                description="Requests awaiting CEO approval"
              />
            </TabsContent>
            
            <TabsContent value="approved">
              <RequestList
                requests={approvedRequests}
                title="Approved Requests"
                description="Requests approved by CEO, awaiting fund release"
              />
            </TabsContent>
            
            <TabsContent value="rejected">
              <RequestList
                requests={rejectedRequests}
                title="Rejected Requests"
                description="Requests that were rejected by CEO"
              />
            </TabsContent>
            
            <TabsContent value="released">
              <RequestList
                requests={releasedRequests}
                title="Released Requests"
                description="Requests with funds already released"
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StaffDashboard;
