// React + Web3 Essentials
import type { Env } from '@pushprotocol/restapi';
import { ethers } from 'ethers';
import { useContext, useEffect, useState } from 'react';
import { CoreContractChainId, ENV, InfuraAPIKey } from '../config';
import { ChatMainStateContext } from '../context';
import type { ChatMainStateContextType } from '../context/chatAndNotification/chat/chatMainStateContext';

// Internal Components

// Internal Configs
import { getEnsName, getUdResolver, getUnstoppableName, pCAIP10ToWallet } from '../helpers';
import { Web3NameListType } from '../types';

export function useResolveWeb3Name(address: string, env: Env) {
  const { web3NameList, setWeb3Name, selectedChatId } = useContext<ChatMainStateContextType>(ChatMainStateContext);

  useEffect(() => {
    (async () => {
      const provider = new ethers.providers.InfuraProvider(CoreContractChainId[env], InfuraAPIKey);
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

            (await getUnstoppableName(checksumWallet, setWeb3Name, env)) ||
              (await getEnsName(provider, checksumWallet, setWeb3Name));
          } catch (e) {
            console.error(e);
          }
        }
      }
    })();
  }, [address, selectedChatId]);
}
