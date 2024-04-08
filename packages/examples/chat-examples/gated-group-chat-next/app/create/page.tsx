'use client';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  ChatView,
  ChatUIProvider,
  darkChatTheme,
  CreateGroupModal,
} from '@pushprotocol/uiweb';
import { useWalletClient, useAccount } from 'wagmi';

export default function Home() {
  const { data: signer } = useWalletClient();
  const { isConnected } = useAccount();

  return (
    <main>
      <ConnectButton />
      {isConnected && (
        <ChatUIProvider
          theme={darkChatTheme}
          signer={signer}
          env={CONSTANTS.ENV.STAGING}
        >
          <CreateGroupModal
            onClose={() => {
              console.log('closes the modal');
            }}
          />
        </ChatUIProvider>
      )}
    </main>
  );
}
