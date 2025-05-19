
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRequests } from '@/contexts/RequestContext';
import DashboardLayout from '@/components/DashboardLayout';
import RequestList from '@/components/RequestList';
import StatsCards from '@/components/StatsCards';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCircle, CalendarClock, FileText } from 'lucide-react';

const StaffDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { requests } = useRequests();
  
  if (!currentUser) return null;
  
  // Find requests that were made for this staff member (by name)
  const userRequests = requests.filter(req => req.requestedFor === currentUser.name);
  const pendingRequests = userRequests.filter(req => req.status === 'pending');
  const approvedRequests = userRequests.filter(req => req.status === 'approved');
  const rejectedRequests = userRequests.filter(req => req.status === 'rejected');
  const releasedRequests = userRequests.filter(req => req.status === 'released');
  const doneRequests = userRequests.filter(req => req.status === 'done');
  
  return (
    <DashboardLayout title="Staff Dashboard">
      <StatsCards requests={userRequests} userRole="staff" />
      
      <div className="grid md:grid-cols-3 gap-6 mt-6">
        <div className="md:col-span-1">
          <Card className="border-gold-200 bg-white shadow">
            <CardHeader className="bg-black/5">
              <CardTitle className="text-red-900">Request Instructions</CardTitle>
              <CardDescription>
                How to request funds for your operations
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-5">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <UserCircle className="h-6 w-6 text-red-800" />
                  <div>
                    <h4 className="font-medium">Talk to Accounting</h4>
                    <p className="text-sm text-gray-500">Contact the accountant with your fund request details</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <FileText className="h-6 w-6 text-red-800" />
                  <div>
                    <h4 className="font-medium">Provide Documentation</h4>
                    <p className="text-sm text-gray-500">Submit any supporting documents or invoices</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CalendarClock className="h-6 w-6 text-red-800" />
                  <div>
                    <h4 className="font-medium">Track Status</h4>
                    <p className="text-sm text-gray-500">Monitor your request status in the dashboard</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Tabs defaultValue="pending">
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="pending">Pending ({pendingRequests.length})</TabsTrigger>
              <TabsTrigger value="approved">Approved ({approvedRequests.length})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({rejectedRequests.length})</TabsTrigger>
              <TabsTrigger value="released">Active ({releasedRequests.length})</TabsTrigger>
              <TabsTrigger value="done">Completed ({doneRequests.length})</TabsTrigger>
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
                title="Active Requests"
                description="Requests with funds currently released"
              />
            </TabsContent>
            
            <TabsContent value="done">
              <RequestList
                requests={doneRequests}
                title="Completed Requests"
                description="Requests that have been fully processed"
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StaffDashboard;
