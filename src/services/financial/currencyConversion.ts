export function convertAmount(amount: number, rate: number): number {
  if (!Number.isFinite(amount)) {
    throw new Error("Amount must be a finite number.");
  }

  if (!Number.isFinite(rate) || rate <= 0) {
    throw new Error("Exchange rate must be a positive finite number.");
  }

  return Number((amount * rate).toFixed(2));
}
