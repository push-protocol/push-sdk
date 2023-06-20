import moment from 'moment';

export const formatDate = (date: number): string => {
  const formattedDate = moment(date).format('Do MMM [at] h:mm A');
  return formattedDate;
}