import {ChatView, ChatUIProvider, darkChatTheme} from "@pushprotocol/uiweb";

export function PushChat({chatId, signer}) {
  console.log(chatId);
  return (
    <ChatUIProvider theme={darkChatTheme} signer={signer}>
      <ChatView chatId={chatId} limit={10} isConnected={true} />
    </ChatUIProvider>
  );
}
