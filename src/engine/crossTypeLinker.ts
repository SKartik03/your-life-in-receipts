import type { Receipt, ReceiptType } from '../types';

/**
 * Cross-Type Linking Engine
 *
 * For every receipt, discovers up to 3 highly related receipts of a DIFFERENT type.
 * Combines temporal proximity, geospatial proximity, and tag/contextual affinity.
 */

function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export interface LinkScoreDetail {
  targetId: string;
  score: number;
  reasons: string[];
}

export function computeReceiptLinkScore(r1: Receipt, r2: Receipt): LinkScoreDetail | null {
  // STRICT RULE: Only link across DIFFERENT types!
  if (r1.type === r2.type || r1.id === r2.id) {
    return null;
  }

  let score = 0;
  const reasons: string[] = [];

  const t1 = new Date(r1.timestamp).getTime();
  const t2 = new Date(r2.timestamp).getTime();
  const diffHours = Math.abs(t1 - t2) / (1000 * 3600);

  // 1. Time proximity
  if (diffHours <= 2) {
    score += 55;
    reasons.push('Happened within ~2 hours');
  } else if (diffHours <= 12) {
    score += 45;
    reasons.push('Same day & time window');
  } else if (diffHours <= 24) {
    score += 35;
    reasons.push('Within 24 hours');
  } else if (diffHours <= 48) {
    score += 22;
    reasons.push('Within 48 hours');
  } else if (diffHours <= 120) {
    score += 10;
    reasons.push('Same week');
  }

  // 2. Shared tags
  const tags1 = new Set(r1.tags.map((t) => t.toLowerCase()));
  const sharedTags = r2.tags.filter((t) => tags1.has(t.toLowerCase()));
  if (sharedTags.length > 0) {
    const tagBonus = sharedTags.length * 25;
    score += tagBonus;
    reasons.push(`Shared context: #${sharedTags.join(', #')}`);
  }

  // 3. Location proximity
  if (r1.location && r2.location) {
    const city1 = r1.location.city.toLowerCase().trim();
    const city2 = r2.location.city.toLowerCase().trim();

    if (city1 && city2 && city1 === city2 && city1 !== 'unknown') {
      score += 40;
      reasons.push(`Same city: ${r1.location.city}`);
    } else if (
      r1.location.lat !== 0 &&
      r1.location.lng !== 0 &&
      r2.location.lat !== 0 &&
      r2.location.lng !== 0
    ) {
      const dist = haversineDistanceKm(
        r1.location.lat,
        r1.location.lng,
        r2.location.lat,
        r2.location.lng
      );
      if (dist < 30) {
        score += 35;
        reasons.push(`Within ${Math.round(dist)}km`);
      } else if (dist < 100) {
        score += 20;
        reasons.push(`Regional proximity (${Math.round(dist)}km)`);
      }
    }
  }

  // 4. Synergistic behavioral affinity
  const h1 = new Date(r1.timestamp).getHours();
  const h2 = new Date(r2.timestamp).getHours();
  const isLateNight1 = h1 >= 23 || h1 <= 5 || r1.tags.includes('late_night');
  const isLateNight2 = h2 >= 23 || h2 <= 5 || r2.tags.includes('late_night');

  if (isLateNight1 && isLateNight2 && diffHours <= 18) {
    score += 25;
    reasons.push('Late-night nocturnal nexus');
  }

  // Travel / Transit synergy
  const isTravel1 = r1.tags.includes('travel') || r1.tags.includes('transportation');
  const isTravel2 = r2.tags.includes('travel') || r2.tags.includes('transportation');
  if (isTravel1 && isTravel2 && diffHours <= 36) {
    score += 30;
    reasons.push('Travel & transit itinerary');
  }

  if (score < 15) {
    return null;
  }

  return {
    targetId: r2.id,
    score,
    reasons,
  };
}

/**
 * Computes top 3 related receipts of different types for every receipt in the list.
 * Returns an extended copy of receipts without mutating the originals.
 */
export function linkReceipts(receipts: Receipt[]): Receipt[] {
  const n = receipts.length;
  const scoreMatrix: Map<string, { id: string; score: number }[]> = new Map();

  for (let i = 0; i < n; i++) {
    scoreMatrix.set(receipts[i].id, []);
  }

  for (let i = 0; i < n; i++) {
    const r1 = receipts[i];
    const r1Scores = scoreMatrix.get(r1.id)!;

    for (let j = i + 1; j < n; j++) {
      const r2 = receipts[j];

      if (r1.type === r2.type) continue;

      const link = computeReceiptLinkScore(r1, r2);
      if (link) {
        r1Scores.push({ id: r2.id, score: link.score });
        scoreMatrix.get(r2.id)!.push({ id: r1.id, score: link.score });
      }
    }
  }

  return receipts.map((r) => {
    const candidates = scoreMatrix.get(r.id) || [];
    candidates.sort((a, b) => b.score - a.score);

    const selectedIds: string[] = [];
    const usedTypes = new Set<ReceiptType>();

    for (const c of candidates) {
      if (selectedIds.length >= 3) break;
      const target = receipts.find((x) => x.id === c.id);
      if (target) {
        if (!usedTypes.has(target.type) || selectedIds.length + (candidates.length - selectedIds.length) <= 3) {
          selectedIds.push(target.id);
          usedTypes.add(target.type);
        }
      }
    }

    for (const c of candidates) {
      if (selectedIds.length >= 3) break;
      if (!selectedIds.includes(c.id)) {
        selectedIds.push(c.id);
      }
    }

    return {
      ...r,
      relatedIds: selectedIds,
    };
  });
}
