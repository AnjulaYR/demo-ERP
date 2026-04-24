export function buildEntityId(prefix: string, sequence: number): string {
  return `${prefix}-${sequence.toString().padStart(4, '0')}`;
}

export function toDisplayDate(value: string | Date): string {
  return new Intl.DateTimeFormat('en-AU', {
    dateStyle: 'medium',
  }).format(new Date(value));
}

