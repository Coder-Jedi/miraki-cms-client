import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, subMonths } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
}

export function getDateRange(months: number = 1) {
  const end = new Date();
  const start = subMonths(end, months);
  return { from: start, to: end };
}
