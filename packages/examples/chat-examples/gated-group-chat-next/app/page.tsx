'use client';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  ChatView,
  ChatUIProvider,
  darkChatTheme,
  CreateGroupModal,
} from '@pushprotocol/uiweb';
import { useWalletClient, useAccount } from 'wagmi';
import { CONSTANTS, PushAPI } from '@pushprotocol/restapi';
import { useEffect, useState } from 'react';

export default function Home() {
  const { data: signer } = useWalletClient();
  const { isConnected } = useAccount();
  const [latestChatID, setLatestChatID] = useState<string | null | undefined>(
    null
  );
  const fetchLatestChat = async () => {
    const userAlice = await PushAPI.initialize(signer, {
      env: CONSTANTS.ENV.STAGING,
    });
    const aliceChats = await userAlice.chat.list('CHATS');
    setLatestChatID(aliceChats[0]?.chatId);
  };
  useEffect(() => {
    fetchLatestChat();
  }, [signer]);
  return (
    <main>
      <ConnectButton />
      {isConnected && signer && latestChatID && (
        <ChatUIProvider
          theme={darkChatTheme}
          signer={signer}
          env={CONSTANTS.ENV.STAGING}
        >
          <div className="h-[80vh] w-[90%] m-auto">
            <ChatView chatId={latestChatID} limit={10} isConnected={true} />
          </div>
        </ChatUIProvider>
      )}
    </main>
  );
}
