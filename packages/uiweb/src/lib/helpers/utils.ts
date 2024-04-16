import {
  ENV
} from '../config';
import {
  getAddress
} from './';

export const deriveChatId = async (chatId: string, env: ENV): Promise<string> => {
    // check if chatid: is appened, if so remove it
    if (chatId?.startsWith('chatid:')) {
      // remove chatid:
      chatId = chatId.replace('chatid:', '');
    } else if (chatId.includes('eip155:')) {
      // remove eip155:
      chatId = chatId.replace('eip155:', '');
    } else if (chatId.includes('.')) {
      chatId = (await getAddress(chatId, env))!;
    }

    return chatId;
};
