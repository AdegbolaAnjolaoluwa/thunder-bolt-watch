
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRequests } from '@/contexts/RequestContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  amount: z.coerce.number().positive('Amount must be positive').min(1, 'Amount is required'),
  purpose: z.string().min(5, 'Purpose must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  attachmentUrl: z.string().optional(),
  requestedFor: z.string().min(1, 'Please select who this request is for'),
});

type FormValues = z.infer<typeof formSchema>;

// Mock staff list
const staffList = [
  { id: '101', name: 'John Staff' },
  { id: '102', name: 'Sarah Security' },
  { id: '103', name: 'Mike Guard' },
  { id: '104', name: 'Lisa Patrol' },
];

const RequestForm: React.FC = () => {
  const { createRequest } = useRequests();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      purpose: '',
      description: '',
      attachmentUrl: '',
      requestedFor: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    createRequest(data);
    form.reset();
  };

  return (
    <Card className="border-gold-200 bg-white shadow">
      <CardHeader className="bg-black/5">
        <CardTitle className="text-red-900">New Fund Request</CardTitle>
        <CardDescription>
          Complete the form below to submit a new fund request
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="requestedFor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Request For</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select staff member" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {staffList.map((staff) => (
                        <SelectItem key={staff.id} value={staff.name}>
                          {staff.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purpose</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Brief purpose of the request"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detailed Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide detailed information about this request"
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="attachmentUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attachment URL (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="URL to any supporting documentation"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full bg-red-900 hover:bg-red-800">Submit Request</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RequestForm;
