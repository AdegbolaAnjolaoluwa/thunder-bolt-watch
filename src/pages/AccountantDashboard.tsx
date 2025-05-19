
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRequests } from '@/contexts/RequestContext';
import DashboardLayout from '@/components/DashboardLayout';
import RequestList from '@/components/RequestList';
import StatsCards from '@/components/StatsCards';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const AccountantDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { 
    requests, 
    getApprovedRequests, 
    getReleasedRequests,
    releaseFunds
  } = useRequests();

  if (!currentUser) return null;

  const approvedRequests = getApprovedRequests();
  const releasedRequests = getReleasedRequests();

  const handleExportReports = () => {
    toast.success("Report generated", {
      description: "Fund release report has been downloaded"
    });
    // In a real application, this would generate and download a real report
  };
  
  return (
    <DashboardLayout title="Accountant Dashboard">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <StatsCards requests={requests} userRole="accountant" />
        </div>
        <div className="ml-4">
          <Button onClick={handleExportReports}>
            <Download className="mr-2 h-4 w-4" />
            Export Reports
          </Button>
        </div>
      </div>
      
      <div className="mt-6">
        <Tabs defaultValue="pending">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="pending">Pending Release ({approvedRequests.length})</TabsTrigger>
            <TabsTrigger value="released">Released ({releasedRequests.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            <RequestList
              requests={approvedRequests}
              title="Pending Fund Release"
              description="Requests approved by CEO, awaiting your fund release"
              onRelease={releaseFunds}
            />
          </TabsContent>
          
          <TabsContent value="released">
            <RequestList
              requests={releasedRequests}
              title="Released Funds"
              description="Requests with funds already released"
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AccountantDashboard;
