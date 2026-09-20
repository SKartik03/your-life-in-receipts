import type { Receipt, ReceiptType, Location } from '../types';

/**
 * Universal Data Adapter
 *
 * Converts arbitrary raw datasets into the canonical Receipt schema.
 * All downstream modules (connection engine, UI, insights) strictly
 * depend ONLY on the internal Receipt schema.
 *
 * Swapping in a completely different dataset format requires changing
 * ONLY this file.
 */

const KNOWN_TYPES: Set<ReceiptType> = new Set([
  'music',
  'movie',
  'place',
  'purchase',
  'photo',
  'message',
  'search',
  'event',
  'note',
]);

function normalizeType(rawType: any): ReceiptType {
  if (typeof rawType !== 'string') return 'note';
  const lower = rawType.toLowerCase().trim();

  if (KNOWN_TYPES.has(lower as ReceiptType)) {
    return lower as ReceiptType;
  }

  // Common aliases
  if (lower.includes('song') || lower.includes('audio') || lower.includes('track')) return 'music';
  if (lower.includes('film') || lower.includes('cinema') || lower.includes('video')) return 'movie';
  if (lower.includes('travel') || lower.includes('visit') || lower.includes('geo')) return 'place';
  if (lower.includes('expense') || lower.includes('transaction') || lower.includes('buy') || lower.includes('shop')) return 'purchase';
  if (lower.includes('image') || lower.includes('pic')) return 'photo';
  if (lower.includes('chat') || lower.includes('sms') || lower.includes('text')) return 'message';
  if (lower.includes('query')) return 'search';
  if (lower.includes('calendar') || lower.includes('meet')) return 'event';

  return 'note';
}

function normalizeTimestamp(rawTime: any): string {
  if (!rawTime) return new Date().toISOString();
  try {
    const d = new Date(rawTime);
    if (!isNaN(d.getTime())) {
      return d.toISOString();
    }
  } catch {
    // fallback
  }
  return new Date().toISOString();
}

function normalizeLocation(rawLoc: any): Location | null {
  if (!rawLoc) return null;
  if (typeof rawLoc === 'string') {
    return { lat: 0, lng: 0, city: rawLoc.trim() };
  }
  if (typeof rawLoc === 'object') {
    const lat = Number(rawLoc.lat ?? rawLoc.latitude ?? 0);
    const lng = Number(rawLoc.lng ?? rawLoc.lon ?? rawLoc.longitude ?? 0);
    const city = String(rawLoc.city ?? rawLoc.name ?? rawLoc.town ?? 'Unknown').trim();
    if (city || lat !== 0 || lng !== 0) {
      return { lat, lng, city: city || 'Unknown Location' };
    }
  }
  return null;
}

function normalizeTags(rawTags: any): string[] {
  if (!rawTags) return [];
  if (Array.isArray(rawTags)) {
    return rawTags
      .filter((t) => typeof t === 'string' && t.trim().length > 0)
      .map((t) => t.toLowerCase().trim());
  }
  if (typeof rawTags === 'string') {
    return rawTags
      .split(/[,;#]+/)
      .map((t) => t.toLowerCase().trim())
      .filter((t) => t.length > 0);
  }
  return [];
}

export function adaptRawReceipt(raw: any, index: number): Receipt {
  if (!raw || typeof raw !== 'object') {
    return {
      id: `synthetic_${index}`,
      type: 'note',
      timestamp: new Date().toISOString(),
      title: 'Unknown Entry',
      subtitle: '',
      amount: null,
      location: null,
      tags: [],
      meta: {},
    };
  }

  const id = String(raw.id ?? raw._id ?? raw.receipt_id ?? raw.uuid ?? `rcpt_${index}`);
  const type = normalizeType(raw.type ?? raw.kind ?? raw.category ?? raw.item_type);
  const timestamp = normalizeTimestamp(raw.timestamp ?? raw.date ?? raw.datetime ?? raw.time ?? raw.created_at);

  const title = String(
    raw.title ??
      raw.name ??
      raw.track_name ??
      raw.song_title ??
      raw.merchant_name ??
      raw.place_name ??
      raw.item_name ??
      raw.subject ??
      'Untitled Moment'
  ).trim();

  const subtitle = String(
    raw.subtitle ??
      raw.artist ??
      raw.merchant ??
      raw.author ??
      raw.sender ??
      raw.description ??
      raw.vendor ??
      ''
  ).trim();

  let amount: number | null = null;
  const rawAmount = raw.amount ?? raw.price ?? raw.cost ?? raw.total ?? raw.value;
  if (rawAmount !== undefined && rawAmount !== null && rawAmount !== '') {
    const num = Number(rawAmount);
    if (!isNaN(num)) {
      amount = Math.round(num * 100) / 100;
    }
  }

  const location = normalizeLocation(raw.location ?? raw.geo ?? raw.coords);
  const tags = normalizeTags(raw.tags ?? raw.categories ?? raw.labels);

  // Preserve extra metadata cleanly
  const meta = { ...(raw.meta ?? {}) };
  const standardKeys = new Set([
    'id', '_id', 'receipt_id', 'uuid',
    'type', 'kind', 'category', 'item_type',
    'timestamp', 'date', 'datetime', 'time', 'created_at',
    'title', 'name', 'track_name', 'song_title', 'merchant_name', 'place_name', 'item_name', 'subject',
    'subtitle', 'artist', 'merchant', 'author', 'sender', 'description', 'vendor',
    'amount', 'price', 'cost', 'total', 'value',
    'location', 'geo', 'coords',
    'tags', 'categories', 'labels',
    'meta', 'relatedIds',
  ]);

  for (const [key, value] of Object.entries(raw)) {
    if (!standardKeys.has(key) && value !== undefined) {
      meta[key] = value;
    }
  }

  return {
    id,
    type,
    timestamp,
    title: title || 'Untitled Moment',
    subtitle,
    amount,
    location,
    tags,
    meta,
  };
}

/**
 * Ingests any raw dataset (array or envelope object) and outputs standard Receipt[].
 */
export function adaptRawDataset(rawInput: any): Receipt[] {
  let list: any[] = [];

  if (Array.isArray(rawInput)) {
    list = rawInput;
  } else if (rawInput && typeof rawInput === 'object') {
    if (Array.isArray(rawInput.receipts)) {
      list = rawInput.receipts;
    } else if (Array.isArray(rawInput.data)) {
      list = rawInput.data;
    } else if (Array.isArray(rawInput.items)) {
      list = rawInput.items;
    } else if (Array.isArray(rawInput.records)) {
      list = rawInput.records;
    }
  }

  return list.map((item, idx) => adaptRawReceipt(item, idx));
}
