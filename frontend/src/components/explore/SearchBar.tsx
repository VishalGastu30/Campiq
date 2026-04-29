import { Search, X } from 'lucide-react';
import { Select } from '@/components/ui/Select';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  sortBy: string;
  setSortBy: (val: any) => void;
  totalResults: number;
}

export function SearchBar({ searchQuery, setSearchQuery, sortBy, setSortBy, totalResults }: SearchBarProps) {
  const sortOptions = [
    { label: 'Highest Rated', value: 'rating' },
    { label: 'NIRF Ranking', value: 'nirfRank' },
    { label: 'Lowest Fees', value: 'fees' },
    { label: 'Highest Placement %', value: 'placement' },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-campiq-surface border border-campiq-border p-3 rounded-2xl mb-6">
      
      <div className="relative flex-1 w-full md:max-w-lg">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-campiq-text-muted">
          <Search size={18} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by college name, city, or course..."
          className="w-full bg-campiq-raised border border-transparent rounded-xl py-2.5 pl-10 pr-10 text-sm text-campiq-text-primary placeholder:text-campiq-text-muted focus:outline-none focus:border-campiq-teal focus:ring-1 focus:ring-campiq-teal transition-all"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-3 flex items-center text-campiq-text-muted hover:text-campiq-text-primary transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="flex w-full md:w-auto items-center justify-between gap-4">
        <div className="text-sm text-campiq-text-secondary whitespace-nowrap hidden sm:block">
          Showing <span className="text-campiq-text-primary font-medium">{totalResults}</span> colleges
        </div>
        
        <div className="w-full md:w-48">
          <Select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={sortOptions}
            className="h-10 text-sm py-1.5"
          />
        </div>
      </div>

    </div>
  );
}
