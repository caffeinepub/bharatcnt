import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Flag } from 'lucide-react';

export default function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Reports & Help Tickets</h2>
        <p className="text-muted-foreground">View and manage customer reports</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5" />
            Customer Reports
          </CardTitle>
          <CardDescription>Review reports submitted by customers</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Report management functionality requires backend capability. This feature will be available once the backend
            provides report submission and listing methods.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
