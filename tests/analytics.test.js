import test from 'node:test';
import assert from 'node:assert/strict';

import { getAnalyticsConsent, saveAnalyticsConsent, trackAnonymousEvent } from '../src/lib/analytics.js';

function installAnalytics(consent = null) {
  const calls = [];
  const values = new Map(consent ? [['mora-analytics-consent', consent]] : []);
  globalThis.window = {
    zaraz: { track: (...args) => calls.push(args) },
    localStorage: {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value),
    },
  };
  return calls;
}

test('tracks allowed aggregate event properties and discards personal fields', () => {
  const calls = installAnalytics('granted');

  try {
    const tracked = trackAnonymousEvent('whatsapp_order_click', {
      item_count: 2,
      total_amount: 120,
      name: 'Ana',
      phone: '5551234567',
    });

    assert.equal(tracked, true);
    assert.deepEqual(calls, [['whatsapp_order_click', { item_count: 2, total_amount: 120 }]]);
  } finally {
    delete globalThis.window;
  }
});

test('rejects unknown events and does not fail when Zaraz is unavailable', () => {
  globalThis.window = { localStorage: { getItem: () => 'granted' } };
  try {
    assert.equal(trackAnonymousEvent('unknown_event'), false);
    assert.equal(trackAnonymousEvent('add_to_cart', { base: 'chamoy', quantity: 1 }), false);
  } finally {
    delete globalThis.window;
  }
});

test('validates event values and omits unsupported properties', () => {
  const calls = installAnalytics('granted');

  try {
    trackAnonymousEvent('add_to_cart', {
      base: 'chocolate',
      quantity: 2,
      customer: 'Ana',
    });
    trackAnonymousEvent('base_selected', { base: 'other' });

    assert.deepEqual(calls, [['add_to_cart', { base: 'chocolate', quantity: 2 }], ['base_selected', {}]]);
  } finally {
    delete globalThis.window;
  }
});

test('does not send interaction events before affirmative consent', () => {
  const calls = installAnalytics();

  try {
    assert.equal(getAnalyticsConsent(), null);
    assert.equal(trackAnonymousEvent('instagram_profile_click'), false);
    assert.equal(saveAnalyticsConsent('denied'), true);
    assert.equal(getAnalyticsConsent(), false);
    assert.equal(trackAnonymousEvent('instagram_profile_click'), false);
    assert.equal(saveAnalyticsConsent('granted'), true);
    assert.equal(getAnalyticsConsent(), true);
    assert.equal(trackAnonymousEvent('instagram_profile_click'), true);
    assert.equal(calls.length, 1);
  } finally {
    delete globalThis.window;
  }
});
