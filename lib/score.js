// Common Ground Score: average partisan gap in support across the topic's key
// policies, inverted so 100 means both parties support them equally.
export const computeOverlapScore = (policySupport) => {
  const rows = (policySupport || []).filter(
    (p) => Number.isFinite(p?.democratPct) && Number.isFinite(p?.republicanPct)
  );
  if (rows.length === 0) return null;
  const avgGap = rows.reduce((sum, p) => sum + Math.abs(p.democratPct - p.republicanPct), 0) / rows.length;
  return Math.round(100 - avgGap);
};
