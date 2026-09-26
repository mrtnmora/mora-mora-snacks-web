export const BASE_PRICES = {
  chamoy: 35,
  chocolate: 45,
};

export const TOPPING_OPTIONS = {
  chamoy: ['Gomitas', 'Skwinkles'],
  chocolate: ['Chispas de chocolate', 'Coco'],
};

export function normalizeToppings(base, toppings = []) {
  const valid = TOPPING_OPTIONS[base] ?? [];
  const unique = [...new Set((toppings ?? []).filter(Boolean))].filter((topping) => valid.includes(topping));

  if (base === 'chocolate') {
    return unique.slice(0, 1);
  }

  return unique;
}

export function getItemPrice(base, toppings = []) {
  const basePrice = BASE_PRICES[base] ?? 0;
  const normalized = normalizeToppings(base, toppings);

  if (base === 'chamoy') {
    return basePrice + normalized.length * 10;
  }

  return basePrice;
}

export function getOrderTotal(items = []) {
  return items.reduce((total, item) => {
    const quantity = Number(item.quantity) || 0;
    return total + getItemPrice(item.base, item.toppings) * quantity;
  }, 0);
}

export function formatMoney(value) {
  return `$${Number(value).toLocaleString('es-MX')} MXN`;
}

export function buildWhatsAppMessage(items = [], customerName = '') {
  const orderLines = items.map((item) => {
    const toppings = item.toppings.length ? `, toppings: ${item.toppings.join(', ')}` : '';
    const itemTotal = getItemPrice(item.base, item.toppings) * (Number(item.quantity) || 0);
    return `${item.quantity} x ${item.base}, sabor: ${item.flavor}${toppings} (${formatMoney(itemTotal).replace(' MXN', '')})`;
  }).join('\n');

  const total = getOrderTotal(items);
  const nameLine = customerName ? `\nNombre: ${customerName}` : '';

  return `Hola Mora Mora!\n\nQuiero pedir:\n${orderLines}\n\nTotal estimado: ${formatMoney(total)}${nameLine}`;
}
