export const formatPKR = (n: number) => {
  if (n >= 10_000_000) return `PKR ${(n / 10_000_000).toFixed(2)} Cr`;
  if (n >= 100_000) return `PKR ${(n / 100_000).toFixed(2)} Lac`;
  if (n >= 1000) return `PKR ${(n / 1000).toFixed(1)}k`;
  return `PKR ${n.toLocaleString()}`;
};

export const formatNum = (n: number) => n.toLocaleString();
