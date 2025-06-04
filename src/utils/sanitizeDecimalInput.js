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

export default sanitizeDecimalInput;
