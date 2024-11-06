import { FormatBody } from './formatbody';
import moment from 'moment';

/**
 * @description parse and extract the timestamp from the body of the notification and remove the text from the body
 * @param notificationBody the text which would represent the body of the notification
 * @returns
 */
export function extractTimeStamp(notificationBody: string): {
  notificationBody: string;
  timeStamp: string;
  originalBody: string;
} {
  const parsedBody = {
    notificationBody: FormatBody(notificationBody),
    timeStamp: '',
    originalBody: notificationBody,
  };
  const matches = notificationBody.match(/\[timestamp:(.*?)\]/);
  if (matches) {
    parsedBody.timeStamp = matches[1];
    const textWithoutTimeStamp = notificationBody.replace(/ *\[timestamp:[^)]*\] */g, '');
    parsedBody.notificationBody = FormatBody(textWithoutTimeStamp);
    parsedBody.originalBody = textWithoutTimeStamp;
  }
  return parsedBody;
}

export function convertTimeStamp(timeStamp: string) {
  const date = moment.unix(Number(timeStamp));

  if (moment().isSame(date, 'day')) {
    return `Today | ${date.format('hh:mm A')}`;
  } else if (moment().subtract(1, 'days').isSame(date, 'day')) {
    return `Yesterday | ${date.format('hh:mm A')}`;
  } else if (moment().add(1, 'days').isSame(date, 'day')) {
    return `Tomorrow | ${date.format('hh:mm A')}`;
  } else {
    return date.format('DD MMM YYYY | hh:mm A');
  }
}
