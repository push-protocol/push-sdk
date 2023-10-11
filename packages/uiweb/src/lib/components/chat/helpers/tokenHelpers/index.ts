import { ethers } from 'ethers';
import { CATEGORY } from '../../types';
import { fetchERC20Info, fetchERC721nfo } from './fetch';

export const tokenFetchHandler = async (
  contract: string,
  type: string,
  category: string,
  chainInfo: string,
  setUnit: (value: React.SetStateAction<string>) => void,
  setDecimals: (value: React.SetStateAction<number>) => void
): Promise<[boolean, string]> => {
  const isValid = ethers.utils.isAddress(contract);

  if (type === 'GUILD') {
    return [false, ''];
  }

  if (!isValid) {
    return [true, `${contract} is invalid invalid contract address`];
  }

  const _chainId = parseInt(chainInfo.split(':')[1]);

  if (category === CATEGORY.ERC20) {
    // erc 20 logic
    const [isErr, tokenInfo] = await fetchERC20Info(contract, _chainId);
    if (isErr) {
      // handle error
      const errMessage = `${contract} is invalid ERC20 on chain ${_chainId}`;
      setUnit('TOKEN');
      setDecimals(18);

      return [true, errMessage];
    } else {
      // set the token info
      setUnit(tokenInfo.symbol);
      setDecimals(tokenInfo.decimals);

      return [false, ''];
    }
  } else {
    // erc 721 logic
    const [isErr, tokenInfo] = await fetchERC721nfo(contract, _chainId);
    if (isErr) {
      // handle error
      const errMessage = `${contract} is invalid ERC721 on chain ${_chainId}`;
      setUnit('TOKEN');
      setDecimals(18);
      return [true, errMessage];
    } else {
      // set the token info
      setUnit(tokenInfo);
      return [false, ''];
    }
  }
};

export {fetchERC20Info, fetchERC721nfo}
