/** Convert admin dollar input (e.g. 9.99) to integer cents for storage. */
export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}

export function centsToDollars(cents: number): string {
  return (cents / 100).toFixed(2);
}

export function parseDollarsInput(
  value: FormDataEntryValue | null,
): number | undefined {
  if (value === null || value === "") return undefined;
  const dollars = Number(value);
  if (Number.isNaN(dollars) || dollars < 0) return undefined;
  return dollarsToCents(dollars);
}
