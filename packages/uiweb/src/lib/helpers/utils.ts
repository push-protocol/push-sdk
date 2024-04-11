export const deriveChatId = (chatId: string): string => {
    // check if chatid: is appened, if so remove it
    if (chatId?.startsWith('chatid:')) {
      // remove chatid:
      chatId = chatId.replace('chatid:', '');
    }

    return chatId;
};
