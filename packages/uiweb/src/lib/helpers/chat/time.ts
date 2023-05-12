import moment from "moment";

export const dateToFromNowDaily = (timestamp: number): string => {
    const timestampDate = moment(timestamp).calendar(null, {
      lastWeek: '[Last] dddd',
      lastDay: '[Yesterday]',
      sameDay: '[Today]',
      nextWeek: 'dddd',
      sameElse: 'DD/MM/YYYY'
    });
    return timestampDate;
  };