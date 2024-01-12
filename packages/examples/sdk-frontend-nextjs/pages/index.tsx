import Image from 'next/image'
import { Inter } from 'next/font/google'
import { ChatView } from '../../../uiweb/src';
import { ChatUIProvider } from '../../../uiweb/src';
import { ethers } from 'ethers';
import { useState } from 'react';
const inter = Inter({ subsets: ['latin'] })
const [signer, setSigner] = useState<any>(null);
const connectWallet = async () => {
  // Demo only supports MetaMask (or other browser based wallets) and gets provider that injects as window.ethereum into each page
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  // Get provider
 await provider.send("eth_requestAccounts", []);

  // Grabbing signer from provider
  const signer = provider.getSigner();

  // store signer
  setSigner(signer);
}

const disconnectWallet = async () => {
  setSigner(null);
};
export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      {  !signer ?  (
       <button type="button" onClick={connectWallet} className="text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Connect Wallet</button>
    )

    :
   
    <ChatUIProvider theme={darkChatTheme} signer={signer}>
      <ChatView
        chatId="1c07072548248e3b465f7fe9e61d3f32d6b779033d933326f221cde558882e46"
        limit={10}
        isConnected={true}
       
      />
    </ChatUIProvider>
  }
    </main>
  )
}
