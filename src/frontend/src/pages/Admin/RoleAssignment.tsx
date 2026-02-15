import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Shield } from 'lucide-react';

export default function RoleAssignment() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Role Assignment</h2>
        <p className="text-muted-foreground">Assign roles to users (Admin/Seller/Customer)</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            User Roles
          </CardTitle>
          <CardDescription>Manage user role assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Role assignment UI is available. Roles are managed through the user profile system and approval workflow.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
