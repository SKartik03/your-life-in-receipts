import type { Receipt, Chapter, ReceiptType } from '../types';

/**
 * Chapter Clustering Engine
 *
 * Segments the chronological timeline into 4 to 8 distinct "Life Chapters"
 * by detecting behavioral shifts (dominant tags, spending intensity,
 * music listening habits, travel locations, and temporal gaps).
 */

const THEME_COLORS = [
  '#8b5cf6', // Violet
  '#06b6d4', // Cyan
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#10b981', // Emerald
  '#3b82f6', // Sky blue
  '#f97316', // Orange
  '#a855f7', // Purple
];

function formatDateDisplay(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return isoString.split('T')[0];
  }
}

function computeChapterStats(receipts: Receipt[]): Chapter['stats'] {
  const typeCounts: Record<ReceiptType, number> = {
    music: 0,
    movie: 0,
    place: 0,
    purchase: 0,
    photo: 0,
    message: 0,
    search: 0,
    event: 0,
    note: 0,
  };

  let totalSpend = 0;
  let purchaseCount = 0;
  let lateNightCount = 0;
  const tagCounts: Map<string, number> = new Map();
  const cityCounts: Map<string, number> = new Map();

  for (const r of receipts) {
    typeCounts[r.type] = (typeCounts[r.type] || 0) + 1;

    if (r.amount !== null && r.amount > 0) {
      totalSpend += r.amount;
      purchaseCount++;
    }

    const hour = new Date(r.timestamp).getHours();
    if (hour >= 23 || hour <= 5 || r.tags.includes('late_night')) {
      lateNightCount++;
    }

    for (const t of r.tags) {
      if (t !== 'expense' && t !== 'income') {
        tagCounts.set(t, (tagCounts.get(t) || 0) + 1);
      }
    }

    if (r.location?.city) {
      const c = r.location.city;
      cityCounts.set(c, (cityCounts.get(c) || 0) + 1);
    }
  }

  // Top type
  let topType: ReceiptType = 'purchase';
  let maxTypeCount = -1;
  for (const [t, cnt] of Object.entries(typeCounts)) {
    if (cnt > maxTypeCount) {
      maxTypeCount = cnt;
      topType = t as ReceiptType;
    }
  }

  // Dominant tags
  const dominantTags = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([tag]) => tag);

  // Top city
  let topCity: string | undefined;
  let maxCityCount = 0;
  for (const [c, cnt] of cityCounts.entries()) {
    if (cnt > maxCityCount) {
      maxCityCount = cnt;
      topCity = c;
    }
  }

  const lateNightPercent = receipts.length > 0 ? Math.round((lateNightCount / receipts.length) * 100) : 0;

  return {
    totalReceipts: receipts.length,
    totalSpend: Math.round(totalSpend),
    topType,
    musicCount: typeCounts.music,
    purchaseCount: typeCounts.purchase,
    placeCount: typeCounts.place,
    dominantTags,
    topCity,
    lateNightPercent,
  };
}

function generateChapterNarrative(
  stats: Chapter['stats'],
  startDate: string,
  endDate: string
): { narrative: string; subtitle: string } {
  const formattedStart = formatDateDisplay(startDate);
  const formattedEnd = formatDateDisplay(endDate);
  const subtitle = `${formattedStart} – ${formattedEnd} · ${stats.totalReceipts} digital moments`;

  const topTagsText =
    stats.dominantTags.length > 0
      ? `revolving around #${stats.dominantTags.join(', #')}`
      : 'spanning diverse everyday pursuits';

  let spendingPhrase = '';
  if (stats.totalSpend > 20000) {
    spendingPhrase = `with major investments totaling ₹${stats.totalSpend.toLocaleString()}`;
  } else if (stats.totalSpend > 0) {
    spendingPhrase = `with disciplined spending of ₹${stats.totalSpend.toLocaleString()}`;
  } else {
    spendingPhrase = 'characterized by quiet, non-commercial contemplation';
  }

  let nocturnalPhrase = '';
  if (stats.lateNightPercent >= 25) {
    nocturnalPhrase = `, with ${stats.lateNightPercent}% of activity taking place in the solitary stillness between midnight and dawn.`;
  } else {
    nocturnalPhrase = ', aligned closely with regular daylight routines.';
  }

  const cityPhrase = stats.topCity ? ` Anchored in ${stats.topCity}, ` : ' Throughout this period, ';

  const narrative = `${cityPhrase}this chapter saw ${stats.totalReceipts} recorded milestones ${topTagsText}, ${spendingPhrase}${nocturnalPhrase}`;

  return { narrative, subtitle };
}

function generateChapterTitle(
  idx: number,
  stats: Chapter['stats']
): string {
  const topTag = stats.dominantTags[0];
  const city = stats.topCity;

  if (stats.lateNightPercent > 35 && stats.musicCount > 10) {
    return 'The Midnight Nocturnes & Reverie';
  }
  if (stats.dominantTags.includes('transportation') || stats.dominantTags.includes('travel')) {
    return city ? `The ${city} Transit & Crossroads` : 'The Wanderlust & Commuter Rhythms';
  }
  if (stats.dominantTags.includes('household') || stats.dominantTags.includes('kirana')) {
    return 'The Hearth, Home & Domestic Solace';
  }
  if (stats.dominantTags.includes('health') || stats.dominantTags.includes('medicine')) {
    return 'The Restoration & Wellness Era';
  }
  if (stats.dominantTags.includes('food') || stats.dominantTags.includes('dinner')) {
    return 'The Shared Tables & Evening Sustenance';
  }
  if (stats.totalSpend > 60000) {
    return 'The Bold Milestones & Big Leaps';
  }

  if (topTag) {
    const formattedTag = topTag.charAt(0).toUpperCase() + topTag.slice(1).replace(/_/g, ' ');
    return `The ${formattedTag} Chapters`;
  }

  if (city) {
    return `The ${city} Chronicle`;
  }

  const fallbackNames = [
    'The Winter Awakening',
    'The Spring Resurgence',
    'The Summer Drift',
    'The Monsoon Transitions',
    'The Autumn Contemplation',
    'The Year-End Solstice',
  ];

  return fallbackNames[idx % fallbackNames.length];
}

export function clusterChapters(receipts: Receipt[], targetChapterCount: number = 6): Chapter[] {
  if (receipts.length === 0) return [];

  const sorted = [...receipts].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const total = sorted.length;
  const k = Math.min(8, Math.max(4, Math.min(targetChapterCount, Math.floor(total / 15) || 4)));

  if (total < k) {
    const stats = computeChapterStats(sorted);
    const { narrative, subtitle } = generateChapterNarrative(stats, sorted[0].timestamp, sorted[sorted.length - 1].timestamp);
    return [
      {
        id: 'chapter_1',
        title: 'The Complete Chronicle',
        subtitle,
        narrative,
        dateRange: { start: sorted[0].timestamp, end: sorted[sorted.length - 1].timestamp },
        receiptIds: sorted.map((r) => r.id),
        stats,
        colorTheme: THEME_COLORS[0],
      },
    ];
  }

  const boundaries: number[] = [0];
  const segmentLength = total / k;

  for (let c = 1; c < k; c++) {
    const idealIdx = Math.round(c * segmentLength);
    const searchWindow = Math.round(segmentLength * 0.35);
    const searchStart = Math.max(boundaries[c - 1] + 10, idealIdx - searchWindow);
    const searchEnd = Math.min(total - (k - c) * 10, idealIdx + searchWindow);

    let bestIdx = idealIdx;
    let maxGapScore = -1;

    for (let i = searchStart; i < searchEnd; i++) {
      const tPrev = new Date(sorted[i].timestamp).getTime();
      const tNext = new Date(sorted[i + 1].timestamp).getTime();
      const gapHours = (tNext - tPrev) / (1000 * 3600);

      let changeScore = gapHours;
      if (sorted[i].location?.city !== sorted[i + 1].location?.city) {
        changeScore += 24;
      }
      if (sorted[i].type !== sorted[i + 1].type) {
        changeScore += 8;
      }

      if (changeScore > maxGapScore) {
        maxGapScore = changeScore;
        bestIdx = i + 1;
      }
    }

    boundaries.push(bestIdx);
  }
  boundaries.push(total);

  const chapters: Chapter[] = [];

  for (let c = 0; c < k; c++) {
    const start = boundaries[c];
    const end = boundaries[c + 1];
    const chapterReceipts = sorted.slice(start, end);

    if (chapterReceipts.length === 0) continue;

    const stats = computeChapterStats(chapterReceipts);
    const startDate = chapterReceipts[0].timestamp;
    const endDate = chapterReceipts[chapterReceipts.length - 1].timestamp;

    const title = generateChapterTitle(c, stats);
    const { narrative, subtitle } = generateChapterNarrative(stats, startDate, endDate);

    chapters.push({
      id: `chapter_${c + 1}`,
      title,
      subtitle,
      narrative,
      dateRange: { start: startDate, end: endDate },
      receiptIds: chapterReceipts.map((r) => r.id),
      stats,
      colorTheme: THEME_COLORS[c % THEME_COLORS.length],
    });
  }

  return chapters;
}
