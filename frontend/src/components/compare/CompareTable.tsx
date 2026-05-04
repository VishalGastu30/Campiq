import { College } from '@/types';
import { formatFees, formatLPA } from '@/lib/utils';
import { StarRating } from '@/components/ui/StarRating';
import { Check, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CompareTableProps {
  colleges: College[];
}

export function CompareTable({ colleges }: CompareTableProps) {
  if (colleges.length === 0) return null;

  // Find best values to highlight
  const bestRating = Math.max(...colleges.map(c => c.rating || 0));
  const minFeesValue = Math.min(...colleges.map(c => c.minFees || Infinity));
  const maxPlacement = Math.max(...colleges.map(c => c.placementPercent || 0));
  const maxAvgPackage = Math.max(...colleges.map(c => c.avgPackage || 0));

  const compareRows = [
    {
      label: 'Institution Type',
      render: (c: College) => <span className="capitalize">{c.type.toLowerCase()}</span>,
    },
    {
      label: 'Rating',
      render: (c: College) => (
        <div className="flex items-center gap-2">
          <StarRating rating={c.rating || 0} size="sm" />
          {(c.rating || 0) === bestRating && <span className="text-[10px] uppercase font-bold text-campiq-teal bg-campiq-teal/10 px-1.5 py-0.5 rounded">Best</span>}
        </div>
      ),
    },
    {
      label: 'NIRF Rank',
      render: (c: College) => c.nirfRank ? `#${c.nirfRank}` : 'N/A',
    },
    {
      label: 'NAAC Grade',
      render: (c: College) => c.naacGrade || 'N/A',
    },
    {
      label: 'Annual Fees (Min)',
      render: (c: College) => (
        <div className="flex items-center gap-2">
          <span className={c.minFees === minFeesValue ? 'text-campiq-teal font-medium' : ''}>{c.minFees ? formatFees(c.minFees) : 'N/A'}</span>
          {c.minFees === minFeesValue && <span className="text-[10px] uppercase font-bold text-campiq-teal bg-campiq-teal/10 px-1.5 py-0.5 rounded">Lowest</span>}
        </div>
      ),
    },
    {
      label: 'Placement Rate',
      render: (c: College) => (
        <div className="flex items-center gap-2">
          <span className={c.placementPercent === maxPlacement ? 'text-campiq-teal font-medium' : ''}>{c.placementPercent ? `${c.placementPercent}%` : 'N/A'}</span>
          {c.placementPercent === maxPlacement && c.placementPercent > 0 && <span className="text-[10px] uppercase font-bold text-campiq-teal bg-campiq-teal/10 px-1.5 py-0.5 rounded">Highest</span>}
        </div>
      ),
    },
    {
      label: 'Average Package',
      render: (c: College) => (
        <div className="flex items-center gap-2">
          <span className={c.avgPackage === maxAvgPackage ? 'text-campiq-amber font-bold' : ''}>{formatLPA(c.avgPackage)}</span>
          {c.avgPackage === maxAvgPackage && c.avgPackage > 0 && <span className="text-[10px] uppercase font-bold text-campiq-amber bg-campiq-amber/10 px-1.5 py-0.5 rounded">Best</span>}
        </div>
      ),
    },
    {
      label: 'UGC Approved',
      render: (c: College) => c.ugcApproved ? <Check className="text-campiq-teal" size={20} /> : <Minus className="text-campiq-text-muted" size={20} />,
    },
    {
      label: 'AIU Member',
      render: (c: College) => c.aiuMember ? <Check className="text-campiq-teal" size={20} /> : <Minus className="text-campiq-text-muted" size={20} />,
    },
    {
      label: 'Established',
      render: (c: College) => c.establishedYear || 'N/A',
    },
  ];

  return (
    <div className="overflow-x-auto bg-campiq-surface border border-campiq-border rounded-2xl shadow-xl">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <tbody>
          {compareRows.map((row, rowIndex) => (
            <motion.tr 
              key={row.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: rowIndex * 0.05 }}
              className="border-b border-campiq-border/50 last:border-0 hover:bg-campiq-raised/30 transition-colors"
            >
              <th className="p-4 md:p-6 w-1/4 font-semibold text-campiq-text-secondary border-r border-campiq-border/50 bg-campiq-raised/20 text-sm md:text-base">
                {row.label}
              </th>
              <AnimatePresence mode="popLayout">
                {colleges.map((college, colIndex) => (
                  <td key={`${row.label}-${college.id}`} className="p-4 md:p-6 text-sm md:text-base text-campiq-text-primary border-r border-campiq-border/50 last:border-0 w-1/4 align-middle">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -10 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25, delay: rowIndex * 0.03 }}
                    >
                      {row.render(college)}
                    </motion.div>
                  </td>
                ))}
                {/* Fill empty slots if less than 3 colleges */}
                {Array.from({ length: 3 - colleges.length }).map((_, i) => (
                  <td key={`empty-${row.label}-${i}`} className="p-4 md:p-6 border-r border-campiq-border/50 last:border-0 w-1/4 bg-campiq-base/50 text-center align-middle">
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-campiq-text-muted/30"
                    >
                      -
                    </motion.span>
                  </td>
                ))}
              </AnimatePresence>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
