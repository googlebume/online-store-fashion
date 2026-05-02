/** Форматує ISO-дату у відносний текст українською (для блоку відгуків). */
export function formatRelativeTimeUk(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return '';
  }
  const diffMs = Date.now() - d.getTime();
  const days = Math.floor(diffMs / 86400000);
  if (days < 0) {
    return d.toLocaleDateString('uk-UA');
  }
  if (days === 0) {
    return 'сьогодні';
  }
  if (days === 1) {
    return 'вчора';
  }
  if (days < 7) {
    return `${days} дн. тому`;
  }
  if (days < 30) {
    return `${Math.floor(days / 7)} тиж. тому`;
  }
  if (days < 365) {
    return `${Math.floor(days / 30)} міс. тому`;
  }
  return d.toLocaleDateString('uk-UA');
}
