import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useSearchBusinesses } from '@/hooks/useQueries';
import { LoadingScreen, ErrorScreen, EmptyScreen } from '@/lib/StateScreens';
import { Input } from '@/components/ui/input';
import BusinessCard from '@/components/business/BusinessCard';
import { Search as SearchIcon, Store } from 'lucide-react';

export default function Search() {
  const navigate = useNavigate();
  const { data: businesses, isLoading, error, refetch } = useSearchBusinesses();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBusinesses = businesses?.filter((business) =>
    business.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <LoadingScreen message="Loading businesses..." />;
  if (error) return <ErrorScreen message="Failed to load businesses" onRetry={() => refetch()} />;
  if (!businesses || businesses.length === 0)
    return <EmptyScreen message="No businesses found" icon={<Store className="h-12 w-12 text-muted-foreground" />} />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Discover Businesses</h2>
        <p className="text-muted-foreground">Find verified local businesses near you</p>
      </div>

      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search businesses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBusinesses?.map((business) => (
          <BusinessCard
            key={business.id}
            business={business}
            onClick={() => navigate({ to: `/customer/business/${business.id}` })}
            isVerified
          />
        ))}
      </div>
    </div>
  );
}
