'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { sendNotification } from '@/app/actions';
import { Loader2, Send } from 'lucide-react';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            {pending ? 'Sending...' : 'Send Notification'}
        </Button>
    )
}

export default function NotificationsPage() {
  const { toast } = useToast();
  const [formKey, setFormKey] = useState(Date.now()); // To reset the form

  const handleSendNotification = async (formData: FormData) => {
    const result = await sendNotification(formData);
    if (result.success) {
      toast({ title: 'Success', description: result.message });
      setFormKey(Date.now()); // Reset form by changing key
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.message });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Send Notification</CardTitle>
          <CardDescription>
            Send a message and an optional image to a specific user via their Gaming ID.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form key={formKey} action={handleSendNotification} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="gamingId">User's Gaming ID</Label>
              <Input id="gamingId" name="gamingId" required placeholder="Enter Gaming ID" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" required placeholder="Your notification message..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL (Optional)</Label>
              <Input id="imageUrl" name="imageUrl" placeholder="https://example.com/image.png" />
            </div>
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
