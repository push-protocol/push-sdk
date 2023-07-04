/**
 * Get Status of the Space.
 * @param {string | Date} datestring - The JavaScript Date String or Date Object.
 * @returns {string} - The Status of the Space.
 */

export type ISpaceStatus = 'Live' | 'Scheduled' | 'Ended';
export function getSpaceStatus(status: any): ISpaceStatus {
  if (status === 'ACTIVE') return 'Live';
  if (status === 'PENDING') return 'Scheduled';
  return 'Ended';
}
