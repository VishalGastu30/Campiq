import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFees(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatLPA(amount: number | null) {
  if (amount === null) return 'N/A';
  return `₹${amount} LPA`;
}

export function formatNumber(amount: number) {
  return new Intl.NumberFormat('en-IN').format(amount);
}

export function getInitials(name: string) {
  const words = name.split(' ');
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}
