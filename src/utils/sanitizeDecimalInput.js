const sanitizeDecimalInput = (value) => {
  // Remove all invalid characters
  let sanitized = value.replace(/[^0-9.,]/g, '');

  // Find the first separator (either , or .)
  const firstSeparatorMatch = sanitized.match(/[.,]/);
  const firstSeparator = firstSeparatorMatch ? firstSeparatorMatch[0] : null;

  if (firstSeparator) {
    // Split on all separators, keep only the first occurrence
    const parts = sanitized.split(/[.,]/);
    sanitized = parts[0] + firstSeparator + parts.slice(1).join('');
  }

  return sanitized;
};

const sanitizeDecimalInputTemp = (value) => {
  if (!value) return '';

  // Allow digits, . , and only one leading -
  let sanitized = value.replace(/[^0-9.,-]/g, '');

  // Allow only one leading minus
  if (sanitized.includes('-')) {
    sanitized = '-' + sanitized.replace(/-/g, '');
  }

  // Handle multiple separators: keep only the first one
  const firstSeparator = sanitized.match(/[.,]/)?.[0];
  if (firstSeparator) {
    const parts = sanitized.split(/[.,]/);
    sanitized = parts[0] + firstSeparator + parts.slice(1).join('');
  }

  // Allow partial input (like "-", "-3.", etc.)
  const normalized = sanitized.replace(',', '.');
  const number = parseFloat(normalized);

  if (sanitized === '-' || sanitized.endsWith('.') || sanitized.endsWith(',') || isNaN(number)) {
    return sanitized; // Allow partial input
  }

  // Enforce temperature range
  if (number < -30 || number > 30) {
    return '';
  }

  return sanitized;
};

export { sanitizeDecimalInput, sanitizeDecimalInputTemp };
