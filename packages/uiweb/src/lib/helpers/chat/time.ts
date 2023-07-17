import moment from "moment";

export const dateToFromNowDaily = (timestamp: number): string => {
    const timestampDate = moment(timestamp).calendar(null, {
      lastWeek: ' dddd',
      lastDay: '[Yesterday]',
      sameDay: '[Today]',
      nextWeek: 'dddd',
      sameElse: 'L'
    });
    return timestampDate;
  };