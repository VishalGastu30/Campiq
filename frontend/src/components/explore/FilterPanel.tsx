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
      maxFees: 5000000,
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
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              <button 
                onClick={() => setFilters({ ...filters, state: '' })}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all border ${filters.state === '' ? 'bg-campiq-teal/15 border-campiq-teal/50 text-campiq-teal shadow-[0_0_8px_rgba(0,212,160,0.1)]' : 'bg-campiq-base border-campiq-border text-campiq-text-secondary hover:border-campiq-border-strong hover:text-campiq-text-primary'}`}
              >
                All States
              </button>
              {meta.states.map(state => (
                <button 
                  key={state}
                  onClick={() => setFilters({ ...filters, state })}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all border ${filters.state === state ? 'bg-campiq-teal/15 border-campiq-teal/50 text-campiq-teal shadow-[0_0_8px_rgba(0,212,160,0.1)]' : 'bg-campiq-base border-campiq-border text-campiq-text-secondary hover:border-campiq-border-strong hover:text-campiq-text-primary'}`}
                >
                  {state}
                </button>
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
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setFilters({ ...filters, type: 'All' })}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all border ${filters.type === 'All' ? 'bg-campiq-teal/15 border-campiq-teal/50 text-campiq-teal shadow-[0_0_8px_rgba(0,212,160,0.1)]' : 'bg-campiq-base border-campiq-border text-campiq-text-secondary hover:border-campiq-border-strong hover:text-campiq-text-primary'}`}
              >
                All Types
              </button>
              {meta.types.map(type => (
                <button 
                  key={type}
                  onClick={() => setFilters({ ...filters, type })}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all border capitalize ${filters.type === type ? 'bg-campiq-teal/15 border-campiq-teal/50 text-campiq-teal shadow-[0_0_8px_rgba(0,212,160,0.1)]' : 'bg-campiq-base border-campiq-border text-campiq-text-secondary hover:border-campiq-border-strong hover:text-campiq-text-primary'}`}
                >
                  {type.toLowerCase()}
                </button>
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
            <div className="space-y-6 px-1 pt-2 pb-2">
              <div className="relative">
                <input 
                  type="range" 
                  min={0} 
                  max={5000000} 
                  step={50000}
                  value={filters.maxFees}
                  onChange={(e) => setFilters({ ...filters, maxFees: parseInt(e.target.value) })}
                  className="w-full h-1.5 bg-campiq-raised rounded-lg appearance-none cursor-pointer focus:outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-campiq-base [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-campiq-teal [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(0,212,160,0.3)] [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
                  style={{
                    background: `linear-gradient(to right, #00d4a0 ${(filters.maxFees / 5000000) * 100}%, rgba(255,255,255,0.05) ${(filters.maxFees / 5000000) * 100}%)`
                  }}
                />
              </div>
              <div className="flex justify-between items-center bg-campiq-raised/50 rounded-lg p-3 border border-campiq-border/50">
                <div className="flex flex-col">
                  <span className="text-[10px] text-campiq-text-muted uppercase tracking-wider font-semibold">Min</span>
                  <span className="text-sm font-bold text-campiq-text-primary font-mono">₹0</span>
                </div>
                <div className="h-4 w-px bg-campiq-border"></div>
                <div className="flex flex-col text-right">
                  <span className="text-[10px] text-campiq-text-muted uppercase tracking-wider font-semibold">Max Limit</span>
                  <span className="text-sm font-bold text-campiq-teal font-mono">
                    {filters.maxFees === 5000000 ? 'No Limit' : `₹${(filters.maxFees / 100000).toFixed(1)}L`}
                  </span>
                </div>
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
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setFilters({ ...filters, course: '' })}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all border ${filters.course === '' ? 'bg-campiq-teal/15 border-campiq-teal/50 text-campiq-teal shadow-[0_0_8px_rgba(0,212,160,0.1)]' : 'bg-campiq-base border-campiq-border text-campiq-text-secondary hover:border-campiq-border-strong hover:text-campiq-text-primary'}`}
              >
                All Programs
              </button>
              {meta.streams.map(stream => (
                <button 
                  key={stream}
                  onClick={() => setFilters({ ...filters, course: stream })}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all border ${filters.course === stream ? 'bg-campiq-teal/15 border-campiq-teal/50 text-campiq-teal shadow-[0_0_8px_rgba(0,212,160,0.1)]' : 'bg-campiq-base border-campiq-border text-campiq-text-secondary hover:border-campiq-border-strong hover:text-campiq-text-primary'}`}
                >
                  {stream}
                </button>
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
