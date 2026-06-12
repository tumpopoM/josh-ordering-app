const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

export function addDays(date: string, days: number): string {
  if (!isoDatePattern.test(date)) {
    throw new Error(`Expected ISO date in YYYY-MM-DD format, received ${date}`);
  }

  const value = new Date(`${date}T00:00:00.000Z`);
  value.setUTCDate(value.getUTCDate() + days);

  return value.toISOString().slice(0, 10);
}

export function isBefore(date: string, minimumDate: string): boolean {
  return date < minimumDate;
}
