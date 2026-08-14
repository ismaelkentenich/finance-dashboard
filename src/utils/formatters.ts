export function formatCurrency(value: number): string {
  const sanitizedValue = Object.is(value, -0) || value === 0 ? 0 : value;

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(sanitizedValue);
}

export function formatPercentage(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function formatDate(dateString: string): string {
  const sanitizedDate = dateString.includes("T")
    ? new Date(dateString)
    : new Date(`${dateString}T12:00:00Z`);

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
    .format(sanitizedDate)
    .replace(".", "");
}

export function normalizeSpaces(value: string): string {
  return value.replace(/[\u00a0\u202f]/g, " ");
}
