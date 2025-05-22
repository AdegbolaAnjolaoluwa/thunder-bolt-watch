
import React from 'react';
import { Memo } from '@/types/request';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

interface MemoListProps {
  memos: Memo[];
  title?: string;
  description?: string;
}

const MemoList: React.FC<MemoListProps> = ({ memos, title = "Memos", description }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <Card className="border-gold-200 bg-white shadow">
      <CardHeader className="bg-black/5 border-b border-gold-100">
        <div className="flex items-center">
          <FileText className="mr-2 h-5 w-5 text-red-800" />
          <CardTitle className="text-red-900">{title}</CardTitle>
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableCaption>List of {memos.length} memos</TableCaption>
          <TableHeader className="bg-black/5">
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Requested For</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead>Created By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {memos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500">
                  No memos found
                </TableCell>
              </TableRow>
            ) : (
              memos.map((memo) => (
                <TableRow key={memo.id}>
                  <TableCell>{formatDate(memo.createdAt)}</TableCell>
                  <TableCell>{memo.requestedFor}</TableCell>
                  <TableCell className="text-red-800 font-medium">₦{memo.amount.toLocaleString()}</TableCell>
                  <TableCell>{memo.purpose}</TableCell>
                  <TableCell>{memo.createdBy}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default MemoList;
