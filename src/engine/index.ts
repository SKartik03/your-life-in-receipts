import type { Receipt, ReceiptType, ProcessedLifeData, LifeSynthesis } from '../types';
import { adaptRawDataset } from './adapter';
import { linkReceipts } from './crossTypeLinker';
import { clusterChapters } from './chapterClusterer';
import { detectNamedPatterns } from './patternDetector';

export * from './adapter';
export * from './crossTypeLinker';
export * from './chapterClusterer';
export * from './patternDetector';

function generateSynthesis(
  receipts: Receipt[]
): LifeSynthesis {
  const years = new Set(
    receipts.map((r) => {
      try {
        return new Date(r.timestamp).getFullYear();
      } catch {
        return 2018;
      }
    })
  );
  const primaryYear = Array.from(years)[0] || 2018;

  // Counts & stats
  const total = receipts.length;
  const purchaseReceipts = receipts.filter((r) => r.type === 'purchase');

  const totalSpend = purchaseReceipts.reduce((sum, r) => sum + (r.amount || 0), 0);
  const lateNightCount = receipts.filter((r) => {
    const h = new Date(r.timestamp).getHours();
    return (h >= 0 && h <= 5) || r.tags.includes('late_night');
  }).length;

  const uniqueCities = new Set(
    receipts
      .filter((r) => r.location?.city && r.location.city !== 'Unknown')
      .map((r) => r.location!.city)
  );

  // Synthesize headline based on detected patterns
  let headline = `${primaryYear}: A Year of Midnight Frequencies, Restless Motion, and Quiet Milestones`;
  let subheadline = `640 digital receipts stitched together into 6 distinct life epochs and interconnected moments.`;

  if (lateNightCount > 30) {
    headline = `${primaryYear}: The Year the Music Stopped Being Background Noise`;
    subheadline = `From 3 AM solitary melodies to spontaneous intercity travels, these digital traces reveal an unvarnished human story.`;
  }

  const statChips: LifeSynthesis['statChips'] = [
    {
      label: 'Digital Moments',
      value: `${total}`,
      detail: 'Interlinked across 3 realms',
      icon: 'sparkles',
    },
    {
      label: 'Financial Footprint',
      value: `₹${(Math.round(totalSpend / 1000)).toLocaleString()}k`,
      detail: `${purchaseReceipts.length} purchases tracked`,
      icon: 'wallet',
    },
    {
      label: 'Nocturnal Hours',
      value: `${lateNightCount}`,
      detail: 'Late-night music & check-ins',
      icon: 'moon',
    },
    {
      label: 'Sanctuaries & Cities',
      value: `${uniqueCities.size}`,
      detail: 'Distinct geographic hubs',
      icon: 'map-pin',
    },
  ];

  const summaryParagraph = `Over the course of ${primaryYear}, everyday transactions, audio streams, and geographic check-ins coalesced into a meaningful narrative. Rather than isolated events, every late-night melody correlated with waking priorities, and ordinary transit rides connected disparate phases of work, home, and reflection.`;

  return {
    headline,
    subheadline,
    summaryParagraph,
    statChips,
    dominantMood: 'Contemplative & Kinetic',
    year: primaryYear,
  };
}

/**
 * Master Processing Pipeline
 *
 * Ingests raw data -> Adapts schema -> Computes cross-type links ->
 * Segments chapters -> Detects named patterns -> Computes synthesis.
 */
export function processLifeData(rawInput: any): ProcessedLifeData {
  // 1. Adapter layer: Normalize whatever is passed into standard Receipt[]
  const rawReceipts = adaptRawDataset(rawInput);

  // 2. Cross-Type Linking Engine: Compute top 3 related receipts of different types
  const linkedReceipts = linkReceipts(rawReceipts);

  // 3. Chapter Clustering Engine: Segment timeline into 4-8 life chapters
  const chapters = clusterChapters(linkedReceipts, 6);

  // 4. Named Pattern Detection Engine: Detect rule-based patterns
  const patterns = detectNamedPatterns(linkedReceipts);

  // 5. Synthesis: Generate top-level story hook & stat chips
  const synthesis = generateSynthesis(linkedReceipts);

  // Create fast lookup map
  const receiptMap = new Map<string, Receipt>();
  for (const r of linkedReceipts) {
    receiptMap.set(r.id, r);
  }

  // Collect unique metadata for filters
  const allTagsSet = new Set<string>();
  const allTypesSet = new Set<ReceiptType>();
  const allCitiesSet = new Set<string>();

  let minDate = linkedReceipts[0]?.timestamp || new Date().toISOString();
  let maxDate = minDate;

  for (const r of linkedReceipts) {
    allTypesSet.add(r.type);
    for (const t of r.tags) {
      if (t !== 'expense' && t !== 'income') {
        allTagsSet.add(t);
      }
    }
    if (r.location?.city && r.location.city !== 'Unknown') {
      allCitiesSet.add(r.location.city);
    }
    if (r.timestamp < minDate) minDate = r.timestamp;
    if (r.timestamp > maxDate) maxDate = r.timestamp;
  }

  return {
    receipts: linkedReceipts,
    receiptMap,
    chapters,
    patterns,
    synthesis,
    allTags: Array.from(allTagsSet).sort(),
    allTypes: Array.from(allTypesSet),
    allCities: Array.from(allCitiesSet).sort(),
    timeBounds: {
      minDate,
      maxDate,
    },
  };
}
