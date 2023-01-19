export function isQuestion(value: string): boolean {
  if (value.length === 0) return false;

  if (value.slice(-1) !== '?') return false;

  return true;
}