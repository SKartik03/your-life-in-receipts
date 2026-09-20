export type ReceiptType =
  | 'music'
  | 'movie'
  | 'place'
  | 'purchase'
  | 'photo'
  | 'message'
  | 'search'
  | 'event'
  | 'note';

export interface Location {
  lat: number;
  lng: number;
  city: string;
}

export interface Receipt {
  id: string;
  type: ReceiptType;
  timestamp: string; // ISO 8601 string
  title: string; // primary label (song name, place name, item bought, etc.)
  subtitle: string; // secondary label (artist, merchant, sender, etc.)
  amount: number | null; // for purchases
  location: Location | null;
  tags: string[]; // lowercase, used for clustering/linking
  meta: Record<string, any>;
  relatedIds?: string[]; // computed by connection engine (top 3 cross-type links)
}

export interface Chapter {
  id: string;
  title: string;
  subtitle: string;
  narrative: string;
  dateRange: {
    start: string;
    end: string;
  };
  receiptIds: string[];
  stats: {
    totalReceipts: number;
    totalSpend: number;
    topType: ReceiptType;
    musicCount: number;
    purchaseCount: number;
    placeCount: number;
    dominantTags: string[];
    topCity?: string;
    lateNightPercent: number;
  };
  colorTheme?: string;
}

export interface InsightPattern {
  id: string;
  name: string;
  tagline: string;
  badge: string;
  category: 'chronobiology' | 'correlation' | 'recurrence' | 'lifestyle' | 'emotional';
  story: string;
  detailedAnalysis: string;
  receiptIds: string[];
  metrics: {
    label: string;
    value: string;
  }[];
  strengthScore: number; // 0 - 100
}

export interface LifeSynthesis {
  headline: string;
  subheadline: string;
  summaryParagraph: string;
  statChips: {
    label: string;
    value: string;
    detail: string;
    icon: string;
  }[];
  dominantMood: string;
  year: number | string;
}

export interface ProcessedLifeData {
  receipts: Receipt[];
  receiptMap: Map<string, Receipt>;
  chapters: Chapter[];
  patterns: InsightPattern[];
  synthesis: LifeSynthesis;
  allTags: string[];
  allTypes: ReceiptType[];
  allCities: string[];
  timeBounds: {
    minDate: string;
    maxDate: string;
  };
}
