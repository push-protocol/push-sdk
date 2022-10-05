import { format } from "date-fns";
import { FormatBody } from './formatbody';

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
      timeStamp: "",
      originalBody: notificationBody,
    };
    const matches = notificationBody.match(/\[timestamp:(.*?)\]/);
    if (matches) {
      parsedBody.timeStamp = matches[1];
      const textWithoutTimeStamp = notificationBody.replace(
        / *\[timestamp:[^)]*\] */g,
        ""
      );
      parsedBody.notificationBody = FormatBody(textWithoutTimeStamp);
      parsedBody.originalBody = textWithoutTimeStamp;
    }
    return parsedBody;
  }
  
  export function convertTimeStamp(timeStamp: string) {
    return format(new Date(Number(timeStamp) * 1000), 'dd MMM yyyy | hh:mm a')
  }