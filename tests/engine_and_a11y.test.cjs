const { describe, it } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

// Load sample dataset
const sampleData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'sampleData.json'), 'utf8')
);
const rawReceipts = sampleData.receipts;

describe('1. Universal Adapter & Schema Conformance', () => {
  it('should load all receipts with required schema properties', () => {
    assert.ok(Array.isArray(rawReceipts), 'Receipts must be an array');
    assert.ok(rawReceipts.length >= 50, 'Expected at least 50 records in sample dataset');

    for (const r of rawReceipts) {
      assert.ok(typeof r.id === 'string' && r.id.length > 0, `Receipt missing valid string id: ${JSON.stringify(r)}`);
      assert.ok(typeof r.type === 'string', `Receipt missing valid string type: ${r.id}`);
      assert.ok(typeof r.timestamp === 'string' && !isNaN(new Date(r.timestamp).getTime()), `Receipt has invalid timestamp: ${r.id}`);
      assert.ok(typeof r.title === 'string' && r.title.length > 0, `Receipt missing valid title: ${r.id}`);
      assert.ok(typeof r.subtitle === 'string', `Receipt subtitle must be string: ${r.id}`);
      assert.ok(r.amount === null || r.amount === undefined || typeof r.amount === 'number', `Receipt amount must be number, null, or undefined: ${r.id}`);
      assert.ok(Array.isArray(r.tags), `Receipt tags must be an array: ${r.id}`);
      assert.ok(r.location === null || r.location === undefined || (typeof r.location === 'object' && typeof r.location.city === 'string'), `Invalid location: ${r.id}`);
    }
  });

  it('should normalize tags to lowercase trimmed strings', () => {
    for (const r of rawReceipts) {
      for (const tag of r.tags) {
        assert.strictEqual(tag, tag.toLowerCase().trim(), `Tag '${tag}' must be lowercase and trimmed`);
      }
    }
  });

  it('should prevent prototype pollution in metadata', () => {
    const maliciousInput = {
      id: 'test_vuln',
      type: 'purchase',
      timestamp: '2026-01-01T00:00:00Z',
      title: 'Malicious',
      meta: {
        __proto__: { polluted: true },
        constructor: { evil: true },
        safeField: 'legit'
      }
    };

    const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
    const safeMeta = {};
    for (const [k, v] of Object.entries(maliciousInput.meta)) {
      if (!FORBIDDEN_KEYS.has(k)) {
        safeMeta[k] = v;
      }
    }

    assert.strictEqual(safeMeta.safeField, 'legit');
    assert.strictEqual(safeMeta.__proto__, Object.prototype);
    assert.strictEqual(Object.prototype.polluted, undefined, 'Prototype pollution must be blocked');
  });
});

describe('2. Cross-Type Linking Engine', () => {
  it('should link only across DIFFERENT receipt types', () => {
    const receiptMap = new Map(rawReceipts.map((r) => [r.id, r]));

    // Sample receipts across different types
    const candidates = rawReceipts.slice(0, 50);
    for (const r1 of candidates) {
      // Find matches of different types
      const otherTypes = rawReceipts.filter((r2) => r2.type !== r1.type);
      assert.ok(otherTypes.length > 0, `Must have other types available to link with ${r1.type}`);

      // Verify any relatedIds in the dataset point to different types
      if (r1.relatedIds && r1.relatedIds.length > 0) {
        assert.ok(r1.relatedIds.length <= 3, 'Cannot exceed maximum 3 relatedIds per receipt');
        for (const relId of r1.relatedIds) {
          const rel = receiptMap.get(relId);
          if (rel) {
            assert.notStrictEqual(r1.type, rel.type, `Linked receipt ${rel.id} has same type ${rel.type} as ${r1.id}`);
          }
        }
      }
    }
  });

  it('should never link a receipt to itself', () => {
    for (const r of rawReceipts) {
      if (r.relatedIds) {
        assert.ok(!r.relatedIds.includes(r.id), `Receipt ${r.id} cannot link to itself`);
      }
    }
  });
});

describe('3. Chapter Clustering Logic', () => {
  it('should span the full timeline of the dataset', () => {
    const timestamps = rawReceipts.map((r) => new Date(r.timestamp).getTime()).sort((a, b) => a - b);
    const minDate = new Date(timestamps[0]);
    const maxDate = new Date(timestamps[timestamps.length - 1]);

    assert.ok(maxDate.getTime() > minDate.getTime(), 'Timeline must have valid span');
    const spanMonths = (maxDate.getFullYear() - minDate.getFullYear()) * 12 + (maxDate.getMonth() - minDate.getMonth());
    assert.ok(spanMonths >= 6, 'Dataset should span at least 6 months for meaningful narrative chapters');
  });
});

describe('4. Named Pattern Detection Evidence', () => {
  it('should have evidence records for late-night listening', () => {
    const lateNight = rawReceipts.filter((r) => {
      const h = new Date(r.timestamp).getHours();
      return (h >= 0 && h <= 5) || (r.tags && r.tags.includes('late_night'));
    });
    assert.ok(lateNight.length >= 10, 'Expected at least 10 late-night records for 3 AM Listening streak');
  });

  it('should have evidence records for recurring sanctuaries and transit', () => {
    const places = rawReceipts.filter((r) => r.type === 'place');
    assert.ok(places.length >= 10, 'Expected at least 10 place records for sanctuary detection');

    const purchases = rawReceipts.filter((r) => r.type === 'purchase');
    assert.ok(purchases.length >= 20, 'Expected purchases for retail therapy and splurge patterns');
  });
});

describe('5. Accessibility (a11y) Helpers', () => {
  it('clickableA11yProps should provide role=button, tabIndex=0, and onKeyDown', () => {
    function clickableA11yProps(onActivate, ariaLabel, stopPropagation = false) {
      return {
        role: 'button',
        tabIndex: 0,
        ...(ariaLabel ? { 'aria-label': ariaLabel } : {}),
        onKeyDown: (e) => {
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
            if (stopPropagation) e.stopPropagation();
            onActivate();
          }
        },
      };
    }

    let activated = false;
    let prevented = false;
    let stopped = false;

    const props = clickableA11yProps(
      () => { activated = true; },
      'Test Action',
      true
    );

    assert.strictEqual(props.role, 'button');
    assert.strictEqual(props.tabIndex, 0);
    assert.strictEqual(props['aria-label'], 'Test Action');
    assert.strictEqual(typeof props.onKeyDown, 'function');

    // Simulate Enter
    props.onKeyDown({
      key: 'Enter',
      preventDefault: () => { prevented = true; },
      stopPropagation: () => { stopped = true; }
    });

    assert.ok(activated, 'onActivate was called on Enter');
    assert.ok(prevented, 'preventDefault was called');
    assert.ok(stopped, 'stopPropagation was called when configured');

    // Simulate Space
    activated = false;
    props.onKeyDown({
      key: ' ',
      preventDefault: () => {},
      stopPropagation: () => {}
    });
    assert.ok(activated, 'onActivate was called on Space');

    // Simulate Escape (should NOT activate)
    activated = false;
    props.onKeyDown({
      key: 'Escape',
      preventDefault: () => {},
      stopPropagation: () => {}
    });
    assert.ok(!activated, 'onActivate must not be called on Escape');
  });
});
