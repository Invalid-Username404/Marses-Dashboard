/**
 * Formats a number or string value with appropriate formatting
 * @param value - The value to format (can be a number or string)
 * @returns Formatted string representation
 */
export function formatNumber(value: string | number): string {
  // Handle string values
  if (typeof value === "string") {
    // Handle values with 'k' suffix (e.g., "22.8k")
    if (value.endsWith("k")) {
      return value.replace("k", ",000");
    }
    // Handle percentage values
    if (value.endsWith("%")) {
      return value;
    }
    // Try parsing as number if it's a numeric string
    const num = parseFloat(value);
    if (!isNaN(num)) {
      return new Intl.NumberFormat().format(num);
    }
    return value;
  }

  // Handle number values
  return new Intl.NumberFormat().format(value);
}

/**
 * Formats a currency value
 * @param value - The numeric value to format as currency
 * @param currency - The currency code (default: 'USD')
 * @returns Formatted currency string
 */
export function formatCurrency(
  value: number,
  currency: string = "USD"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);
}

/**
 * Formats a percentage value
 * @param value - The decimal value to format as percentage
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}
