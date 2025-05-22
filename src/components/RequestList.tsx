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
import { FileText } from 'lucide-react';

interface RequestListProps {
  requests: FundRequest[];
  title: string;
  description?: string;
  onApprove?: (id: string, comments: string) => void;
  onReject?: (id: string, comments: string) => void;
  onRelease?: (id: string) => void;
  onMarkDone?: (id: string) => void;
  onConvertToMemo?: (id: string, memoText: string) => void; // New prop
}

const RequestList: React.FC<RequestListProps> = ({
  requests,
  title,
  description,
  onApprove,
  onReject,
  onRelease,
  onMarkDone,
  onConvertToMemo // New prop
}) => {
  const { currentUser } = useAuth();
  const [selectedRequest, setSelectedRequest] = useState<FundRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'memo' | null>(null); // Added 'memo'
  const [comments, setComments] = useState('');

  const handleAction = (request: FundRequest, action: 'approve' | 'reject' | 'memo') => { // Added 'memo'
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
    } else if (actionType === 'memo' && onConvertToMemo) {
      onConvertToMemo(selectedRequest.id, comments);
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
      case 'done':
        return <Badge variant="outline" className="bg-black bg-opacity-80 text-gray-100 border-gray-700">Done</Badge>;
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
      <Card className="border-gold-200 bg-white shadow">
        <CardHeader className="bg-black/5 border-b border-gold-100">
          <CardTitle className="text-red-900">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableCaption>List of {requests.length} fund requests</TableCaption>
            <TableHeader className="bg-black/5">
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Requested For</TableHead>
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
                  <TableCell colSpan={7} className="text-center text-gray-500">
                    No requests found
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.id}</TableCell>
                    <TableCell>{request.requestedFor || '-'}</TableCell>
                    <TableCell className="text-red-800 font-medium">₦{request.amount.toLocaleString()}</TableCell>
                    <TableCell>{request.purpose}</TableCell>
                    <TableCell>{formatDate(request.dateCreated)}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      {currentUser?.role === 'ceo' && request.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button size="sm" className="bg-red-900 hover:bg-red-800" onClick={() => handleAction(request, 'approve')}>
                            Approve
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleAction(request, 'reject')}>
                            Reject
                          </Button>
                        </div>
                      )}
                      {currentUser?.role === 'accountant' && request.status === 'approved' && onRelease && (
                        <div className="flex space-x-2">
                          <Button size="sm" className="bg-red-900 hover:bg-red-800" onClick={() => onRelease(request.id)}>
                            Release Funds
                          </Button>
                          {onConvertToMemo && (
                            <Button size="sm" variant="outline" className="border-red-200" onClick={() => handleAction(request, 'memo')}>
                              <FileText className="mr-1 h-4 w-4" /> To Memo
                            </Button>
                          )}
                        </div>
                      )}
                      {currentUser?.role === 'accountant' && request.status === 'released' && onMarkDone && (
                        <Button size="sm" className="bg-black hover:bg-black/80 text-white" onClick={() => onMarkDone(request.id)}>
                          Mark as Done
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
        <DialogContent className="border-gold-200">
          <DialogHeader>
            <DialogTitle className="text-red-900">
              {actionType === 'approve' ? 'Approve Request' : 
               actionType === 'reject' ? 'Reject Request' : 'Convert to Memo'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve' 
                ? 'Add any comments to approve this fund request'
                : actionType === 'reject'
                ? 'Please provide a reason for rejecting this request'
                : 'Add memo details for this fund request'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Amount</p>
                <p className="text-sm text-red-800 font-medium">₦{selectedRequest?.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Purpose</p>
                <p className="text-sm">{selectedRequest?.purpose}</p>
              </div>
            </div>
            
            <div>
              <label htmlFor="comments" className="text-sm font-medium">
                {actionType === 'approve' ? 'Comments (Optional)' : 
                 actionType === 'reject' ? 'Reason for Rejection' : 'Memo Text'}
              </label>
              <Textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder={actionType === 'memo' 
                  ? "Enter memo details..."
                  : "Add your comments here..."}
                className="mt-1 border-gold-200"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" className="border-gold-200" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmAction} 
              className={actionType === 'approve' || actionType === 'memo' ? "bg-red-900 hover:bg-red-800 text-white" : ""}
              variant={actionType === 'approve' || actionType === 'memo' ? 'default' : 'destructive'}
              disabled={(actionType === 'reject' && !comments) || (actionType === 'memo' && !comments)}
            >
              {actionType === 'approve' ? 'Approve' : actionType === 'reject' ? 'Reject' : 'Create Memo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RequestList;
