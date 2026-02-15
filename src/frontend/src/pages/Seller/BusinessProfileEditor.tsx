import { useState, useEffect } from 'react';
import { useGetMyBusinessProfile, useCreateBusinessProfile, useUpdateBusinessProfile } from '@/hooks/useQueries';
import { LoadingScreen, ErrorScreen } from '@/lib/StateScreens';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import type { BusinessProfile } from '@/backend';
import { Principal } from '@dfinity/principal';

export default function BusinessProfileEditor() {
  const { data: profile, isLoading, error, refetch } = useGetMyBusinessProfile();
  const createProfile = useCreateBusinessProfile();
  const updateProfile = useUpdateBusinessProfile();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    contactInfo: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        description: profile.description,
        address: profile.address,
        contactInfo: profile.contactInfo,
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.address.trim() || !formData.contactInfo.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const profileData: BusinessProfile = {
        principal: Principal.anonymous(),
        name: formData.name.trim(),
        description: formData.description.trim(),
        address: formData.address.trim(),
        contactInfo: formData.contactInfo.trim(),
        kycStatus: 'pending' as any,
        isBlocked: false,
        createdAt: 0n,
        updatedAt: 0n,
      };

      if (profile) {
        await updateProfile.mutateAsync(profileData);
        toast.success('Profile updated successfully');
      } else {
        await createProfile.mutateAsync(profileData);
        toast.success('Profile created successfully');
      }
    } catch (error) {
      toast.error('Failed to save profile');
    }
  };

  if (isLoading) return <LoadingScreen message="Loading your profile..." />;
  if (error) return <ErrorScreen message="Failed to load profile" onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Business Profile</h2>
        <p className="text-muted-foreground">Manage your business information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{profile ? 'Edit Profile' : 'Create Profile'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Business Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter business name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your business"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter business address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactInfo">Contact Information *</Label>
              <Input
                id="contactInfo"
                value={formData.contactInfo}
                onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                placeholder="Phone number or email"
              />
            </div>

            <Button type="submit" disabled={createProfile.isPending || updateProfile.isPending} className="w-full">
              {createProfile.isPending || updateProfile.isPending ? 'Saving...' : profile ? 'Update Profile' : 'Create Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
