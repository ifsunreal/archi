export const BLANK_TEXT = "Blank";

function normalizeText(value?: string | null): string {
  if (typeof value !== "string") return "";
  return value.trim();
}

export function textOrBlank(value?: string | null): string {
  const normalized = normalizeText(value);
  return normalized || BLANK_TEXT;
}

export function textOrFallback(value: string | null | undefined, fallback: string): string {
  const normalized = normalizeText(value);
  return normalized || fallback;
}

export function listOrBlank(values?: Array<string | null | undefined>, minItems = 1): string[] {
  const cleaned = (values || []).map((item) => normalizeText(item)).filter(Boolean);
  if (cleaned.length >= minItems) {
    return cleaned;
  }

  return Array.from({ length: Math.max(1, minItems) }, (_, index) => cleaned[index] || BLANK_TEXT);
}

export function hrefOrHash(value?: string | null): string {
  const normalized = normalizeText(value);
  return normalized || "#";
}
