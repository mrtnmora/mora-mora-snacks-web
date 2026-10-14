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
  map_loaded: {},
};

const consentKey = 'mora-analytics-consent';

export function getAnalyticsConsent() {
  try {
    const choice = globalThis.window?.localStorage?.getItem(consentKey);
    if (choice === 'granted') return true;
    if (choice === 'denied') return false;
    return null;
  } catch {
    return null;
  }
}

export function saveAnalyticsConsent(choice) {
  if (choice !== 'granted' && choice !== 'denied') return false;
  try {
    globalThis.window?.localStorage?.setItem(consentKey, choice);
    return true;
  } catch {
    return false;
  }
}

export function trackAnonymousEvent(eventName, properties = {}) {
  const zaraz = globalThis.window?.zaraz;
  const rules = eventRules[eventName];

  if (getAnalyticsConsent() !== true || !rules || typeof zaraz?.track !== 'function') {
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
