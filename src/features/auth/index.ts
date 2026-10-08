export type { AuthenticatedUser } from './types';
/** Reserved protection hook. Replace only when a real, verified session provider exists. */
export function isAdminAccessEnabled(): boolean {
  return false;
}
