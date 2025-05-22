
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
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

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

  const exportToWord = () => {
    // Create content for the Word document
    let content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
      <head>
        <meta charset="utf-8">
        <title>Accounting Memos Export</title>
      </head>
      <body>
        <h1>${title}</h1>
        <p>Exported on ${new Date().toLocaleDateString()}</p>
        <table border="1" cellpadding="8" style="border-collapse: collapse; width: 100%;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th>Date</th>
              <th>Requested For</th>
              <th>Amount</th>
              <th>Purpose</th>
              <th>Created By</th>
            </tr>
          </thead>
          <tbody>
    `;
    
    // Add each memo as a row in the table
    memos.forEach(memo => {
      content += `
        <tr>
          <td>${formatDate(memo.createdAt)}</td>
          <td>${memo.requestedFor}</td>
          <td style="color: #991b1b; font-weight: 500;">₦${memo.amount.toLocaleString()}</td>
          <td>${memo.purpose}</td>
          <td>${memo.createdBy}</td>
        </tr>
      `;
    });
    
    // Close the table and document
    content += `
          </tbody>
        </table>
      </body>
      </html>
    `;
    
    // Create a Blob with the content
    const blob = new Blob([content], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    // Create a link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.doc`;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success("Export successful", {
      description: "Memos have been exported to Word document"
    });
  };

  return (
    <Card className="border-gold-200 bg-white shadow">
      <CardHeader className="bg-black/5 border-b border-gold-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-red-800" />
            <CardTitle className="text-red-900">{title}</CardTitle>
          </div>
          {memos.length > 0 && (
            <Button 
              onClick={exportToWord} 
              variant="outline" 
              className="border-red-200 bg-white hover:bg-red-50"
              size="sm"
            >
              <Download className="mr-2 h-4 w-4 text-red-800" />
              Export to Word
            </Button>
          )}
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
