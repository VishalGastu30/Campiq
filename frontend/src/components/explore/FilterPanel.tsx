import { ChevronUp, ChevronDown, X } from 'lucide-react';
import { useState } from 'react';
import { FilterMeta } from '@/types';
import { Button } from '@/components/ui/Button';

interface FilterPanelProps {
  meta: FilterMeta | null;
  filters: any;
  setFilters: (filters: any) => void;
  onCloseMobile?: () => void;
}

export function FilterPanel({ meta, filters, setFilters, onCloseMobile }: FilterPanelProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setCollapsed(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const clearFilters = () => {
    setFilters({
      state: '',
      type: 'All',
      minFees: 0,
      maxFees: 1000000,
      course: ''
    });
  };

  if (!meta) return null;

  return (
    <div className="bg-campiq-surface border border-campiq-border rounded-2xl p-5 w-full h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-campiq-border">
        <h3 className="text-lg font-bold text-campiq-text-primary">Filters</h3>
        {onCloseMobile ? (
          <button onClick={onCloseMobile} className="md:hidden text-campiq-text-muted hover:text-white">
            <X size={20} />
          </button>
        ) : (
          <button onClick={clearFilters} className="text-xs text-campiq-teal hover:underline font-medium">
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* State Filter */}
        <div>
          <button 
            className="flex items-center justify-between w-full font-medium text-campiq-text-primary mb-3"
            onClick={() => toggleSection('state')}
          >
            Location (State)
            {collapsed['state'] ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
          {!collapsed['state'] && (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="state"
                  checked={filters.state === ''}
                  onChange={() => setFilters({ ...filters, state: '' })}
                  className="appearance-none w-4 h-4 rounded-full border border-campiq-text-muted checked:border-[4px] checked:border-campiq-teal transition-all"
                />
                <span className="text-sm text-campiq-text-secondary group-hover:text-campiq-text-primary">All States</span>
              </label>
              {meta.states.map(state => (
                <label key={state} className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="state"
                    checked={filters.state === state}
                    onChange={() => setFilters({ ...filters, state })}
                    className="appearance-none w-4 h-4 rounded-full border border-campiq-text-muted checked:border-[4px] checked:border-campiq-teal transition-all"
                  />
                  <span className="text-sm text-campiq-text-secondary group-hover:text-campiq-text-primary">{state}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* College Type Filter */}
        <div className="pt-4 border-t border-campiq-border">
          <button 
            className="flex items-center justify-between w-full font-medium text-campiq-text-primary mb-3"
            onClick={() => toggleSection('type')}
          >
            Institution Type
            {collapsed['type'] ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
          {!collapsed['type'] && (
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="type"
                  checked={filters.type === 'All'}
                  onChange={() => setFilters({ ...filters, type: 'All' })}
                  className="appearance-none w-4 h-4 rounded-full border border-campiq-text-muted checked:border-[4px] checked:border-campiq-teal transition-all"
                />
                <span className="text-sm text-campiq-text-secondary group-hover:text-campiq-text-primary">All Types</span>
              </label>
              {meta.types.map(type => (
                <label key={type} className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="type"
                    checked={filters.type === type}
                    onChange={() => setFilters({ ...filters, type })}
                    className="appearance-none w-4 h-4 rounded-full border border-campiq-text-muted checked:border-[4px] checked:border-campiq-teal transition-all"
                  />
                  <span className="text-sm text-campiq-text-secondary group-hover:text-campiq-text-primary capitalize">{type.toLowerCase()}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Fees Range Filter */}
        <div className="pt-4 border-t border-campiq-border">
          <button 
            className="flex items-center justify-between w-full font-medium text-campiq-text-primary mb-3"
            onClick={() => toggleSection('fees')}
          >
            Annual Fees Range
            {collapsed['fees'] ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
          {!collapsed['fees'] && (
            <div className="space-y-4 px-1">
              <input 
                type="range" 
                min={0} 
                max={1000000} 
                step={50000}
                value={filters.maxFees}
                onChange={(e) => setFilters({ ...filters, maxFees: parseInt(e.target.value) })}
                className="w-full accent-campiq-teal h-1.5 bg-campiq-raised rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-campiq-text-muted">
                <span>₹0</span>
                <span>₹{(filters.maxFees / 100000).toFixed(1)}L</span>
              </div>
            </div>
          )}
        </div>

        {/* Course Category Filter */}
        <div className="pt-4 border-t border-campiq-border">
          <button 
            className="flex items-center justify-between w-full font-medium text-campiq-text-primary mb-3"
            onClick={() => toggleSection('course')}
          >
            Programs Offered
            {collapsed['course'] ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
          {!collapsed['course'] && (
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="course"
                  checked={filters.course === ''}
                  onChange={() => setFilters({ ...filters, course: '' })}
                  className="appearance-none w-4 h-4 rounded-full border border-campiq-text-muted checked:border-[4px] checked:border-campiq-teal transition-all"
                />
                <span className="text-sm text-campiq-text-secondary group-hover:text-campiq-text-primary">All Programs</span>
              </label>
              {meta.courseCategories.map(cat => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="course"
                    checked={filters.course === cat}
                    onChange={() => setFilters({ ...filters, course: cat })}
                    className="appearance-none w-4 h-4 rounded-full border border-campiq-text-muted checked:border-[4px] checked:border-campiq-teal transition-all"
                  />
                  <span className="text-sm text-campiq-text-secondary group-hover:text-campiq-text-primary">{cat}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {onCloseMobile && (
        <div className="mt-8 md:hidden">
          <Button className="w-full" onClick={onCloseMobile}>Apply Filters</Button>
          <Button variant="ghost" className="w-full mt-2" onClick={clearFilters}>Clear All</Button>
        </div>
      )}
    </div>
  );
}
