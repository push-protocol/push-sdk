// React + Web3 Essentials
import type { Env } from '@pushprotocol/restapi';
import { ethers } from 'ethers';
import { useContext, useEffect, useState } from 'react';
import { ChatMainStateContext } from '../context';
import type { ChatMainStateContextType } from '../context/chatAndNotification/chat/chatMainStateContext';

// Internal Components

// Internal Configs
import { pCAIP10ToWallet, resolveWeb3Name } from '../helpers';

export function useResolveWeb3Name(address: string, env: Env) {
  const { web3NameList, setWeb3Name, selectedChatId } = useContext<ChatMainStateContextType>(ChatMainStateContext);

  useEffect(() => {
    (async () => {
      if (address) {
        const walletLowercase = pCAIP10ToWallet(address)?.toLowerCase();
        const checksumWallet = ethers.utils.getAddress(walletLowercase);
        if (ethers.utils.isAddress(checksumWallet)) {
          try {
            // attempt ENS name resolution first, with a fallback to Unstoppable Domains if
            // a value is not found from ENS.
            Object.keys(web3NameList).forEach((element) => {
              if (web3NameList[checksumWallet.toLowerCase()]) {
                return;
              }
            });
            const result = await resolveWeb3Name(checksumWallet, env);
            if (result) setWeb3Name(checksumWallet.toLowerCase(), result);
          } catch (e) {
            console.error(e);
          }
        }
      }
    })();
  }, [address, selectedChatId]);
}
