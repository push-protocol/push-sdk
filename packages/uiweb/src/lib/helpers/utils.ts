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

// Derive Chat Id
export const deriveChatId = async (chatId: string, user: PushAPI | undefined): Promise<string> => {
  // check if chatid: is appened, if so remove it
  if (chatId?.startsWith('chatid:')) {
    // remove chatid:
    chatId = chatId.replace('chatid:', '');
  } else if (chatId.includes('eip155:')) {
    // remove eip155:
    chatId = chatId.replace('eip155:', '');
  } else if (getDomainIfExists(chatId)) {
    chatId = (await getAddress(chatId, user ? user.env : CONSTANTS.ENV.PROD))!;
  }

  return chatId;
};

// Main Logic
// Deep Copy Helper Function
export function deepCopy<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }

  if (obj instanceof Array) {
    return obj.reduce((arr, item, i) => {
      arr[i] = deepCopy(item);
      return arr;
    }, [] as any[]) as any;
  }

  if (obj instanceof Object) {
    return Object.keys(obj).reduce((newObj, key) => {
      newObj[key as keyof T] = deepCopy((obj as any)[key]);
      return newObj;
    }, {} as T);
  }

  throw new Error(`Unable to copy obj! Its type isn't supported.`);
}

export const isMessageEncrypted = (message: string) => {
  if (!message) return false;

  return message.startsWith('U2FsdGVkX1');
};

export const getDomainIfExists = (chatId: string) => (chatId.includes('.') ? chatId : null);
