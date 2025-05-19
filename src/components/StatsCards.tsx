
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FundRequest } from '@/types/request';

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, className }) => (
  <Card className={className}>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

interface StatsCardsProps {
  requests: FundRequest[];
  userRole: string;
}

const StatsCards: React.FC<StatsCardsProps> = ({ requests, userRole }) => {
  // Calculate statistics based on the requests
  const pendingCount = requests.filter(req => req.status === 'pending').length;
  const approvedCount = requests.filter(req => req.status === 'approved').length;
  const rejectedCount = requests.filter(req => req.status === 'rejected').length;
  const releasedCount = requests.filter(req => req.status === 'released').length;
  const doneCount = requests.filter(req => req.status === 'done').length;
  
  const totalAmount = requests.reduce((sum, req) => sum + req.amount, 0);
  const releasedAmount = requests
    .filter(req => req.status === 'released' || req.status === 'done')
    .reduce((sum, req) => sum + req.amount, 0);
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {userRole === 'ceo' && (
        <>
          <StatCard 
            title="Pending Approval" 
            value={pendingCount.toString()} 
            description="Requests awaiting your approval"
            className="border-yellow-200"
          />
          <StatCard 
            title="Approved" 
            value={approvedCount.toString()} 
            description="Requests you've approved"
            className="border-blue-200"
          />
          <StatCard 
            title="Rejected" 
            value={rejectedCount.toString()} 
            description="Requests you've rejected"
            className="border-red-200"
          />
          <StatCard 
            title="Total Amount" 
            value={`₦${totalAmount.toLocaleString()}`} 
            description="Value of all requests"
          />
        </>
      )}
      
      {userRole === 'accountant' && (
        <>
          <StatCard 
            title="Pending Approval" 
            value={pendingCount.toString()} 
            description="Requests awaiting CEO approval"
            className="border-yellow-200"
          />
          <StatCard 
            title="Approved" 
            value={approvedCount.toString()} 
            description="Approved requests awaiting release"
            className="border-blue-200"
          />
          <StatCard 
            title="Released" 
            value={releasedCount.toString()} 
            description="Requests with funds released"
            className="border-green-200"
          />
          <StatCard 
            title="Completed" 
            value={doneCount.toString()} 
            description="Requests marked as done"
            className="border-black"
          />
          <StatCard 
            title="Released Amount" 
            value={`₦${releasedAmount.toLocaleString()}`} 
            description="Total funds released"
            className="border-green-200"
          />
          <StatCard 
            title="Pending Amount" 
            value={`₦${(totalAmount - releasedAmount).toLocaleString()}`} 
            description="Funds pending release"
            className="border-yellow-200"
          />
        </>
      )}
    </div>
  );
};

export default StatsCards;
