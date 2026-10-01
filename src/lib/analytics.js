const eventRules = {
  base_selected: {
    base: (value) => value === 'chamoy' || value === 'chocolate',
  },
  add_to_cart: {
    base: (value) => value === 'chamoy' || value === 'chocolate',
    quantity: (value) => Number.isInteger(value) && value > 0 && value <= 100,
  },
  whatsapp_order_click: {
    item_count: (value) => Number.isInteger(value) && value > 0 && value <= 100,
    total_amount: (value) => Number.isFinite(value) && value >= 0,
  },
  wholesale_quote_click: {},
  instagram_profile_click: {},
  whatsapp_contact_click: {},
};

export function trackAnonymousEvent(eventName, properties = {}) {
  const zaraz = globalThis.window?.zaraz;
  const rules = eventRules[eventName];

  if (!rules || typeof zaraz?.track !== 'function') {
    return false;
  }

  const safeProperties = Object.fromEntries(
    Object.entries(rules)
      .filter(([key, isValid]) => isValid(properties[key]))
      .map(([key]) => [key, properties[key]]),
  );

  try {
    Promise.resolve(zaraz.track(eventName, safeProperties)).catch(() => {});
    return true;
  } catch {
    return false;
  }
}
