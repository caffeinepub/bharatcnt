import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin, Tag } from 'lucide-react';

export default function CityCategoryManager() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">City & Category Management</h2>
        <p className="text-muted-foreground">Manage cities and business categories</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Cities
            </CardTitle>
            <CardDescription>Add and manage cities where businesses operate</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              City management functionality requires backend capability. This feature will be available once the backend
              provides city CRUD methods.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Categories
            </CardTitle>
            <CardDescription>Add and manage business categories</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Category management functionality requires backend capability. This feature will be available once the
              backend provides category CRUD methods.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
