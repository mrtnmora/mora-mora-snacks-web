import test from 'node:test';
import assert from 'node:assert/strict';

import {
  BASE_PRICES,
  formatMoney,
  getItemPrice,
  getOrderTotal,
  normalizeToppings,
  buildWhatsAppMessage,
} from '../src/lib/order.js';

test('base prices are defined for both product types', () => {
  assert.equal(BASE_PRICES.chamoy, 35);
  assert.equal(BASE_PRICES.chocolate, 45);
});

test('chamoy price adds $10 per topping', () => {
  assert.equal(getItemPrice('chamoy', ['Gomitas']), 45);
  assert.equal(getItemPrice('chamoy', ['Gomitas', 'Skwinkles']), 55);
  assert.equal(getItemPrice('chamoy', []), 35);
});

test('chocolate price is fixed at base price and ignores extra toppings beyond one', () => {
  assert.equal(getItemPrice('chocolate', ['Coco']), 45);
  assert.equal(getItemPrice('chocolate', ['Coco', 'Chispas de chocolate']), 45);
  assert.equal(getItemPrice('chocolate', []), 45);
});

test('duplicate and invalid toppings are normalized', () => {
  assert.deepEqual(normalizeToppings('chamoy', ['Gomitas', 'Gomitas', 'Skwinkles', 'Malo']), ['Gomitas', 'Skwinkles']);
  assert.deepEqual(normalizeToppings('chocolate', ['Coco', 'Coco', 'Chispas de chocolate']), ['Coco']);
  assert.deepEqual(normalizeToppings('chocolate', ['No existe']), []);
});

test('order total adds every item quantity and topping cost correctly', () => {
  const items = [
    { base: 'chocolate', flavor: 'Blanco', toppings: ['Chispas de chocolate'], quantity: 1 },
    { base: 'chamoy', flavor: 'Mango', toppings: ['Skwinkles', 'Gomitas'], quantity: 1 },
    { base: 'chocolate', flavor: 'Obscuro', toppings: ['Coco'], quantity: 4 },
  ];

  assert.equal(getOrderTotal(items), 280);
});

test('formatMoney returns readable currency format', () => {
  assert.equal(formatMoney(280), '$280 MXN');
  assert.equal(formatMoney(1234), '$1,234 MXN');
});

test('WhatsApp message omits the customer name when blank', () => {
  const items = [
    { base: 'chocolate', flavor: 'Blanco', toppings: ['Chispas de chocolate'], quantity: 1 },
    { base: 'chamoy', flavor: 'Mango', toppings: ['Skwinkles', 'Gomitas'], quantity: 1 },
    { base: 'chocolate', flavor: 'Obscuro', toppings: ['Coco'], quantity: 4 },
  ];

  const message = buildWhatsAppMessage(items, '');
  assert.ok(message.includes('Total estimado: $280'));
  assert.ok(!message.includes('Nombre:'));
});

test('WhatsApp message includes the customer name when provided', () => {
  const message = buildWhatsAppMessage([
    { base: 'chamoy', flavor: 'Mango', toppings: ['Skwinkles', 'Gomitas'], quantity: 1 },
  ], 'Ana');

  assert.ok(message.includes('Nombre: Ana'));
});

