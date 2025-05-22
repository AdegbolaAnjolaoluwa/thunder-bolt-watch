
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

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  const exportSingleMemoToWord = (memo: Memo) => {
    const today = new Date();
    const formattedDate = formatDateTime(today.toISOString());
    
    // Create standardized memo content
    let content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
      <head>
        <meta charset="utf-8">
        <title>Fund Request Memo</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 1in; }
          .header { text-align: center; margin-bottom: 30px; }
          .memo-header { border-bottom: 1px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
          .memo-field { margin-bottom: 15px; }
          .memo-field-label { font-weight: bold; }
          .memo-title { text-align: center; text-transform: uppercase; font-weight: bold; margin: 20px 0; }
          .signature-area { margin-top: 50px; }
          .signature-line { border-top: 1px solid #000; width: 200px; margin-top: 50px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>INTERNAL MEMORANDUM</h1>
          <p>CONFIDENTIAL</p>
        </div>
        
        <div class="memo-header">
          <div class="memo-field">
            <span class="memo-field-label">DATE:</span> ${formattedDate}
          </div>
          <div class="memo-field">
            <span class="memo-field-label">TO:</span> Accounting Department
          </div>
          <div class="memo-field">
            <span class="memo-field-label">FROM:</span> ${memo.createdBy}
          </div>
          <div class="memo-field">
            <span class="memo-field-label">SUBJECT:</span> Fund Request for ${memo.requestedFor} - ${memo.purpose}
          </div>
          <div class="memo-field">
            <span class="memo-field-label">REFERENCE:</span> MEMO-${memo.id}
          </div>
        </div>
        
        <div class="memo-title">FUND REQUEST MEMORANDUM</div>
        
        <p>This memorandum is to formally request the disbursement of funds as detailed below:</p>
        
        <div class="memo-field">
          <span class="memo-field-label">Amount Requested:</span> ₦${memo.amount.toLocaleString()}
        </div>
        <div class="memo-field">
          <span class="memo-field-label">Requested For:</span> ${memo.requestedFor}
        </div>
        <div class="memo-field">
          <span class="memo-field-label">Purpose:</span> ${memo.purpose}
        </div>
        <div class="memo-field">
          <span class="memo-field-label">Memo Details:</span> ${memo.text}
        </div>
        <div class="memo-field">
          <span class="memo-field-label">Request Date:</span> ${formatDate(memo.createdAt)}
        </div>
        
        <p>The funds are required to be disbursed as soon as possible to ensure timely execution of the intended purpose.</p>
        
        <p>Please process this request according to the company's financial protocols and procedures.</p>
        
        <div class="signature-area">
          <p>Approved by:</p>
          <div class="signature-line"></div>
          <p>${memo.createdBy}<br>
          Date: ${formattedDate}</p>
        </div>
      </body>
      </html>
    `;
    
    // Create a Blob with the content
    const blob = new Blob([content], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    // Create a link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `Fund_Request_Memo_${memo.requestedFor.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.doc`;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success("Memo exported", {
      description: `Memo for ${memo.requestedFor} has been exported to Word`
    });
  };
  
  const exportAllMemosToWord = () => {
    // Create content for the Word document with all memos
    let content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
      <head>
        <meta charset="utf-8">
        <title>Accounting Memos Export</title>
        <style>
          body { font-family: Arial, sans-serif; }
          h1 { text-align: center; margin: 20px 0; }
          table { border-collapse: collapse; width: 100%; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; }
          th { background-color: #f2f2f2; text-align: left; }
          .amount { color: #991b1b; font-weight: 500; }
          .memo-summary { margin-bottom: 40px; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <p>Exported on ${new Date().toLocaleDateString()}</p>
        
        <h2>Summary of All Memos</h2>
        <table>
          <thead>
            <tr>
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
          <td class="amount">₦${memo.amount.toLocaleString()}</td>
          <td>${memo.purpose}</td>
          <td>${memo.createdBy}</td>
        </tr>
      `;
    });
    
    content += `
          </tbody>
        </table>
        
        <h2>Detailed Memos</h2>
    `;
    
    // Add detailed section for each memo
    memos.forEach((memo, index) => {
      content += `
        <div class="memo-summary">
          <h3>Memo #${index + 1}: ${memo.purpose}</h3>
          <p><strong>Date:</strong> ${formatDate(memo.createdAt)}</p>
          <p><strong>Requested For:</strong> ${memo.requestedFor}</p>
          <p><strong>Amount:</strong> ₦${memo.amount.toLocaleString()}</p>
          <p><strong>Created By:</strong> ${memo.createdBy}</p>
          <p><strong>Details:</strong> ${memo.text}</p>
        </div>
      `;
    });
    
    // Close the document
    content += `
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
      description: "All memos have been exported to Word document"
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
              onClick={exportAllMemosToWord} 
              variant="outline" 
              className="border-red-200 bg-white hover:bg-red-50"
              size="sm"
            >
              <Download className="mr-2 h-4 w-4 text-red-800" />
              Export All Memos
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
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {memos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500">
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
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => exportSingleMemoToWord(memo)}
                      className="hover:bg-red-50"
                    >
                      <Download className="h-4 w-4 text-red-800 mr-1" />
                      Export
                    </Button>
                  </TableCell>
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
