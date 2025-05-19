
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FundRequest } from '@/types/request';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

interface RequestListProps {
  requests: FundRequest[];
  title: string;
  description?: string;
  onApprove?: (id: string, comments: string) => void;
  onReject?: (id: string, comments: string) => void;
  onRelease?: (id: string) => void;
}

const RequestList: React.FC<RequestListProps> = ({
  requests,
  title,
  description,
  onApprove,
  onReject,
  onRelease,
}) => {
  const { currentUser } = useAuth();
  const [selectedRequest, setSelectedRequest] = useState<FundRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [comments, setComments] = useState('');

  const handleAction = (request: FundRequest, action: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setActionType(action);
    setIsDialogOpen(true);
    setComments('');
  };

  const confirmAction = () => {
    if (!selectedRequest) return;
    
    if (actionType === 'approve' && onApprove) {
      onApprove(selectedRequest.id, comments);
    } else if (actionType === 'reject' && onReject) {
      onReject(selectedRequest.id, comments);
    }
    
    setIsDialogOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      case 'released':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Released</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>List of {requests.length} fund requests</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                {currentUser?.role !== 'staff' && <TableHead>Requestor</TableHead>}
                <TableHead>Amount</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Date Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={currentUser?.role !== 'staff' ? 7 : 6} className="text-center text-gray-500">
                    No requests found
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.id}</TableCell>
                    {currentUser?.role !== 'staff' && <TableCell>{request.userName}</TableCell>}
                    <TableCell>${request.amount.toLocaleString()}</TableCell>
                    <TableCell>{request.purpose}</TableCell>
                    <TableCell>{formatDate(request.dateCreated)}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      {currentUser?.role === 'ceo' && request.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={() => handleAction(request, 'approve')}>
                            Approve
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleAction(request, 'reject')}>
                            Reject
                          </Button>
                        </div>
                      )}
                      {currentUser?.role === 'accountant' && request.status === 'approved' && onRelease && (
                        <Button size="sm" onClick={() => onRelease(request.id)}>
                          Release Funds
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve Request' : 'Reject Request'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve' 
                ? 'Add any comments to approve this fund request'
                : 'Please provide a reason for rejecting this request'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Amount</p>
                <p className="text-sm">${selectedRequest?.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Purpose</p>
                <p className="text-sm">{selectedRequest?.purpose}</p>
              </div>
            </div>
            
            <div>
              <label htmlFor="comments" className="text-sm font-medium">
                {actionType === 'approve' ? 'Comments (Optional)' : 'Reason for Rejection'}
              </label>
              <Textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Add your comments here..."
                className="mt-1"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmAction} 
              variant={actionType === 'approve' ? 'default' : 'destructive'}
              disabled={actionType === 'reject' && !comments}
            >
              {actionType === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RequestList;
