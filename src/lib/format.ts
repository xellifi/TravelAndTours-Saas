export function formatPeso(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(Number(value))) return "";
  const n = Number(value);
  return `₱${n.toLocaleString("en-PH", { maximumFractionDigits: 0 })}`;
}

export function formatPriceRange(
  min?: number | null,
  max?: number | null,
  fallback?: number | null,
): string {
  const hasMin = min !== null && min !== undefined && !isNaN(Number(min)) && Number(min) > 0;
  const hasMax = max !== null && max !== undefined && !isNaN(Number(max)) && Number(max) > 0;

  if (hasMin && hasMax && Number(min) !== Number(max)) {
    return `${formatPeso(Number(min))} – ${formatPeso(Number(max))}`;
  }
  if (hasMin && hasMax) return formatPeso(Number(min));
  if (hasMin) return `From ${formatPeso(Number(min))}`;
  if (hasMax) return `Up to ${formatPeso(Number(max))}`;
  if (fallback !== null && fallback !== undefined && !isNaN(Number(fallback)) && Number(fallback) > 0) {
    return formatPeso(Number(fallback));
  }
  return "";
}
