import type { ReceiptType } from '../types';

export const ALL_RECEIPT_TYPES: readonly ReceiptType[] = [
  'music',
  'purchase',
  'place',
  'movie',
  'photo',
  'message',
  'search',
  'event',
  'note',
] as const;

export const RECEIPT_TYPE_COLORS: Record<ReceiptType, { color: string; glow: string; bg: string }> = {
  music: { color: '#c084fc', glow: 'rgba(192, 132, 252, 0.45)', bg: 'rgba(168, 85, 247, 0.12)' },
  purchase: { color: '#fbbf24', glow: 'rgba(251, 191, 36, 0.45)', bg: 'rgba(245, 158, 11, 0.12)' },
  place: { color: '#22d3ee', glow: 'rgba(34, 211, 238, 0.45)', bg: 'rgba(6, 182, 212, 0.12)' },
  movie: { color: '#f43f5e', glow: 'rgba(244, 63, 94, 0.45)', bg: 'rgba(225, 29, 72, 0.12)' },
  photo: { color: '#34d399', glow: 'rgba(52, 211, 153, 0.45)', bg: 'rgba(16, 185, 129, 0.12)' },
  note: { color: '#38bdf8', glow: 'rgba(56, 189, 248, 0.45)', bg: 'rgba(2, 132, 199, 0.12)' },
  event: { color: '#f472b6', glow: 'rgba(244, 114, 182, 0.45)', bg: 'rgba(219, 39, 119, 0.12)' },
  message: { color: '#a3e635', glow: 'rgba(163, 230, 53, 0.45)', bg: 'rgba(132, 204, 22, 0.12)' },
  search: { color: '#e879f9', glow: 'rgba(232, 121, 249, 0.45)', bg: 'rgba(192, 38, 211, 0.12)' },
};
