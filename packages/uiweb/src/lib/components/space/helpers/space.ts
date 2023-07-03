/**
 * Get Status of the Space.
 * @param {string | Date} datestring - The JavaScript Date String or Date Object.
 * @returns {string} - The Status of the Space.
 */

export type ISpaceStatus = 'Live' | 'Scheduled' | 'Ended';
export function getSpaceStatus(datestring: Date | string): ISpaceStatus {
    const date = new Date(datestring);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const diffDays = diff / (1000 * 3600 * 24);
  
    if (diffDays < 0) {
      return 'Ended';
    } else if (diffDays > 0) {
      return 'Scheduled';
    } else {
      return 'Live';
    }
  }
