import { useEffect, useState } from 'react';
import { ConditionData } from '..';
import { CATEGORY, PushData } from '../components/chat/types';
import {
  fetchERC20Info,
  fetchERC721nfo,
  fetchERC1155Info,
} from '../components/chat/helpers/tokenHelpers';

export const useTokenSymbolLoader = (
  conditionData: ConditionData
): [string, boolean] => {
  const isContract = isTokenType(conditionData);
  const [tokenSymbol, setTokenSymbol] = useState('....');
  const [isTokenSymbolLoading, setIsTokenSymbolLoading] = useState(true);

  const updateTokenValue = (newVal: string) => {
    setTokenSymbol(newVal);
    setIsTokenSymbolLoading(false);
  };

  useEffect(() => {
    (async () => {
        
      if (isContract) {
        const data = conditionData.data as PushData;
        const contract = data.contract;
        const category = conditionData.category;

        if (category && contract) {
          if (data.token) {
            updateTokenValue(data.token);
            return;
          }

          const contractFormat = contract.split(':');
          const [address, chainId] = [
            contractFormat[2],
            parseInt(contractFormat[1]),
          ];

          if (category === CATEGORY.ERC20) {
            const [isErr, tokenInfo] = await fetchERC20Info(address, chainId);
            if (!isErr) {
              updateTokenValue(tokenInfo.symbol);
            }
          } else if (category === CATEGORY.ERC721) {
            const [isErr, tokenInfo] = await fetchERC721nfo(address, chainId);
            if (!isErr) {
              updateTokenValue(tokenInfo);
            }
          } else if (category === CATEGORY.ERC1155) {
            const [isErr, tokenInfo] = await fetchERC1155Info(address, chainId, data.tokenId ?? 0);
            if (!isErr) {
              updateTokenValue(tokenInfo);
            }
          }
        }
      }
    })();
  }, []);

  return [tokenSymbol, isTokenSymbolLoading];
};

const isTokenType = (conditionData: ConditionData): boolean => {
  if (conditionData.type === 'PUSH') {
    if (
      conditionData.category === CATEGORY.ERC20 ||
      conditionData.category === CATEGORY.ERC721 ||
      conditionData.category === CATEGORY.ERC1155
    ) {
      if (conditionData.data) {
        return true;
      }
    }
  }
  return false;
};
