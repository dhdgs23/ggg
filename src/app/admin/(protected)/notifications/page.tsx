'use client';

import { useState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { sendNotification, sendNotificationToAll } from '@/app/actions';
import { Loader2, Send, SendToBack } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

function SubmitButton({ isSendingAll }: { isSendingAll: boolean }) {
    const { pending } = useFormStatus();
    return (
         <Button type="submit" className="w-full" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {pending ? 'Sending...' : isSendingAll ? 'Yes, Send to All' : 'Send to Specific User' }
        </Button>
    )
}

export default function NotificationsPage() {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSendSingle = async (formData: FormData) => {
    const result = await sendNotification(formData);
    if (result.success) {
      toast({ title: 'Success', description: result.message });
      formRef.current?.reset();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.message });
    }
  };

  const handleSendAll = async (formData: FormData) => {
    const result = await sendNotificationToAll(formData);
     if (result.success) {
      toast({ title: 'Success', description: result.message });
      formRef.current?.reset();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.message });
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Send Notification</CardTitle>
          <CardDescription>
            Send a message and an optional image to a specific user or to all users.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={formRef} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="gamingId">User's Gaming ID (for single user)</Label>
              <Input id="gamingId" name="gamingId" placeholder="Enter Gaming ID" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" required placeholder="Your notification message..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL (Optional)</Label>
              <Input id="imageUrl" name="imageUrl" placeholder="https://example.com/image.png" />
            </div>
            <div className="space-y-2">
                <Button formAction={handleSendSingle} className="w-full"><Send className="mr-2"/> Send to Specific User</Button>
                
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button type="button" variant="secondary" className="w-full">
                            <SendToBack className="mr-2 h-4 w-4" />
                            Send to All Users
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                         <form action={handleSendAll}>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will send the notification to every single user. This action cannot be undone. You must re-enter the message below to confirm.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                             <div className="space-y-2 my-4">
                                <Label htmlFor="message-all">Message</Label>
                                <Textarea id="message-all" name="message" required placeholder="Your notification message..."/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="imageUrl-all">Image URL (Optional)</Label>
                                <Input id="imageUrl-all" name="imageUrl" placeholder="https://example.com/image.png" />
                            </div>
                            <AlertDialogFooter className="mt-4">
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction asChild>
                                    <SubmitButton isSendingAll={true} />
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </form>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
