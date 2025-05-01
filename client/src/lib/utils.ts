import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date to local string
export function formatDate(date: string | Date | undefined | null): string {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('pt-BR');
}

// Check if string is valid URL
export function isValidURL(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Generate WhatsApp link
export function generateWhatsAppLink(phone: string): string {
  // Remove non-numeric characters
  const cleanedPhone = phone.replace(/\D/g, '');
  return `https://wa.me/${cleanedPhone}`;
}

// Truncate string with ellipsis
export function truncateString(str: string, num: number): string {
  if (!str) return '';
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + '...';
}

// Format currency (BRL)
export function formatCurrency(value: number | undefined | null): string {
  if (value === undefined || value === null) return '-';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

// Get situação financeira badge color
export function getSituacaoFinanceiraColor(situacao: string): "red" | "green" | "yellow" | "gray" {
  switch (situacao?.toLowerCase()) {
    case 'em dia':
      return 'green';
    case 'pendente':
      return 'yellow';
    case 'atrasado':
      return 'red';
    default:
      return 'gray';
  }
}

// Get boolean badge color (Sim/Não)
export function getBooleanBadgeColor(value: boolean | undefined | null): "red" | "green" | "yellow" | "gray" | "blue" | "purple" {
  if (value === true) return 'green';
  return 'gray';
}

// Format boolean as Sim/Não
export function formatBoolean(value: boolean | undefined | null): string {
  if (value === true) return 'Sim';
  if (value === false) return 'Não';
  return '-';
}
