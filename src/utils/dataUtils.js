/**
 * GLOBAL DATA UTILITIES
 * Standardized helpers for safe data casting and null safety.
 */

export const FALLBACK = "—";

/**
 * Safely casts a value to a string.
 */
export const safeString = (val) => {
  if (val === null || val === undefined) return "";
  if (typeof val === "object") return "";
  return String(val);
};

/**
 * Safely ensures a value is an array.
 */
export const safeArray = (val) => {
  return Array.isArray(val) ? val : [];
};

/**
 * Safely casts a value to a number.
 * More strict and predictable for production use.
 */
export const safeNumber = (val) => {
  if (val === null || val === undefined || val === "") return 0;
  const num = Number(val);
  return Number.isFinite(num) ? num : 0;
};

/**
 * Log missing critical data for debugging.
 */
export const logMissing = (label, data) => {
  if (data == null) {
    console.warn(`[DATA WARNING] Missing ${label}:`, data);
  }
};

/**
 * Safely parse ISO date strings with fallback to today.
 */
export const safeParseISO = (val, fallback = new Date()) => {
  if (!val) return fallback;
  try {
    const d = new Date(val);
    return isFinite(d.getTime()) ? d : fallback;
  } catch (e) {
    return fallback;
  }
};
