
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRequests } from '@/contexts/RequestContext';
import DashboardLayout from '@/components/DashboardLayout';
import RequestForm from '@/components/RequestForm';
import RequestList from '@/components/RequestList';
import MemoList from '@/components/MemoList';
import StatsCards from '@/components/StatsCards';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download, Memo } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const AccountantDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { 
    requests, 
    memos,
    getApprovedRequests, 
    getReleasedRequests,
    getDoneRequests,
    getMemos,
    releaseFunds,
    markAsDone,
    convertToMemo
  } = useRequests();

  if (!currentUser) return null;

  const approvedRequests = getApprovedRequests();
  const releasedRequests = getReleasedRequests();
  const doneRequests = getDoneRequests();
  const accountantMemos = getMemos();

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
          <Button onClick={handleExportReports} className="bg-red-900 hover:bg-red-800">
            <Download className="mr-2 h-4 w-4" />
            Export Reports
          </Button>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6 mt-6">
        <div className="md:col-span-1">
          <RequestForm />
        </div>
        
        <div className="md:col-span-2">
          <Tabs defaultValue="approved">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="approved">Pending Release ({approvedRequests.length})</TabsTrigger>
              <TabsTrigger value="released">Active ({releasedRequests.length})</TabsTrigger>
              <TabsTrigger value="done">Completed ({doneRequests.length})</TabsTrigger>
              <TabsTrigger value="memos">Memos ({accountantMemos.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="approved">
              <RequestList
                requests={approvedRequests}
                title="Approved Requests"
                description="Requests approved by CEO, awaiting your fund release"
                onRelease={releaseFunds}
                onConvertToMemo={convertToMemo}
              />
            </TabsContent>
            
            <TabsContent value="released">
              <RequestList
                requests={releasedRequests}
                title="Active Requests"
                description="Requests with funds released but not yet completed"
                onMarkDone={markAsDone}
              />
            </TabsContent>
            
            <TabsContent value="done">
              <RequestList
                requests={doneRequests}
                title="Completed Requests"
                description="Requests that have been marked as done"
              />
            </TabsContent>

            <TabsContent value="memos">
              <MemoList
                memos={accountantMemos}
                title="Accounting Memos"
                description="Internal memos created from fund requests"
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AccountantDashboard;
