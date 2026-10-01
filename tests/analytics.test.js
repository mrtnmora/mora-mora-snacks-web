import test from 'node:test';
import assert from 'node:assert/strict';

import { trackAnonymousEvent } from '../src/lib/analytics.js';

test('tracks allowed aggregate event properties and discards personal fields', () => {
  const calls = [];
  globalThis.window = { zaraz: { track: (...args) => calls.push(args) } };

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
  globalThis.window = {};
  try {
    assert.equal(trackAnonymousEvent('unknown_event'), false);
    assert.equal(trackAnonymousEvent('add_to_cart', { base: 'chamoy', quantity: 1 }), false);
  } finally {
    delete globalThis.window;
  }
});

test('validates event values and omits unsupported properties', () => {
  const calls = [];
  globalThis.window = { zaraz: { track: (...args) => calls.push(args) } };

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
