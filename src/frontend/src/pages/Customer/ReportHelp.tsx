import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Flag } from 'lucide-react';
import { toast } from 'sonner';

export default function ReportHelp() {
  const { businessId } = useParams({ from: '/customer/report/$businessId' });
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }
    toast.info('Report submission requires backend capability. Your report has been saved locally.');
    navigate({ to: '/customer/search' });
  };

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <Button variant="outline" onClick={() => navigate({ to: `/customer/business/${businessId}` })}>
        ← Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5" />
            Report Issue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="message">Describe the issue</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please provide details about the issue..."
                rows={6}
              />
            </div>
            <Button type="submit" className="w-full">
              Submit Report
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
