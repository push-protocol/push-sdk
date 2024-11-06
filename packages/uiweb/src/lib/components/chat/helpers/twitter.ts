import { TwitterFeedReturnType } from '../exportedTypes';

export const checkTwitterUrl = (message: string): TwitterFeedReturnType => {
  let tweetId = '';
  let isTweet = false;

  const URL_REGEX = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/)?([\w#!:.?+=&%@!-]+)/;
  const messageContent = typeof message === 'string' ? message.split(' ') : [];

  messageContent?.forEach((message) => {
    if (isTweet) return; // Exit the iteration if the tweet was already found

    const lowerCaseMessage = message.toLowerCase();

    // Check if the message contains a Twitter URL or the letter 'x'
    if (URL_REGEX.test(message) && (lowerCaseMessage.includes('twitter') || lowerCaseMessage.includes('x'))) {
      // Extract tweetId by splitting the URL before the '?' and then splitting by '/'
      const urlParts = message.split('?')[0].split('/');

      // Ensure the URL has at least 6 parts to extract the tweetId
      if (urlParts.length >= 6) {
        tweetId = urlParts[urlParts.length - 1];
        isTweet = true;
      } else {
        isTweet = false;
      }
    }
  });

  return { tweetId, isTweet };
};
