export const TRASH_RETENTION_DAYS = 30;

export function isTrashExpired(trashedAt: string): boolean {
  const retentionMs = TRASH_RETENTION_DAYS * 24 * 60 * 60 * 1000;
  return Date.now() - new Date(trashedAt).getTime() > retentionMs;
}
