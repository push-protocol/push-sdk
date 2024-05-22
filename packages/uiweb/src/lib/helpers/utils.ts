// React + Web3 Essentials

// External Packages
import { CONSTANTS, PushAPI } from '@pushprotocol/restapi';

// Internal Compoonents

// Internal Configs
import { ENV } from '../config';
import { getAddress } from './';

// Assets

// Interfaces & Types

// Constants

// Exported Interfaces & Types

// Exported Functions

export const deriveChatId = async (chatId: string, user: PushAPI | undefined): Promise<string> => {
  // check if chatid: is appened, if so remove it
  if (chatId?.startsWith('chatid:')) {
    // remove chatid:
    chatId = chatId.replace('chatid:', '');
  } else if (chatId.includes('eip155:')) {
    // remove eip155:
    chatId = chatId.replace('eip155:', '');
  } else if (chatId.includes('.')) {
    chatId = (await getAddress(chatId, user ? user.env : CONSTANTS.ENV.PROD))!;
  }

  return chatId;
};
