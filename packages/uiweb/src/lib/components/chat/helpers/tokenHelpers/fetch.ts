import { ethers } from "ethers";
import { getChainRPC } from "./chain";
import { NFTContractABI, TokenContractABI } from "./abi";
import { CATEGORY } from "../../types";

interface ERC20InfoType {
  symbol: string;
  decimals: number;
}

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
      setUnit('NFT');
      setDecimals(18);
      return [true, errMessage];
    } else {
      // set the token info
      setUnit(tokenInfo);
      return [false, ''];
    }
  }
};


export const fetchERC20Info = async (
  contractAddress: string,
  chainId: number
): Promise<[boolean, ERC20InfoType]> => {
  try {
    const rpcURL = getChainRPC(chainId);
    const provider = new ethers.providers.JsonRpcProvider(rpcURL);
    const contract:any = new ethers.Contract(
      contractAddress,
      TokenContractABI,
      provider
    );

    const [symbol, decimals] = await Promise.all([
      contract.symbol(),
      contract.decimals(),
    ]);

    return [false, { symbol: symbol, decimals: decimals }];
  } catch {
    return [true, { symbol: "", decimals: 0 }];
  }
};

export const fetchERC721nfo = async (
  contractAddress: string,
  chainId: number
): Promise<[boolean, string]> => {
  try {
    const rpcURL = getChainRPC(chainId);
    const provider = new ethers.providers.JsonRpcProvider(rpcURL);
    
    const contract:any = new ethers.Contract(
      contractAddress,
      NFTContractABI,
      provider
    );

    const name = await contract.name();
    return [false, name];
  } catch {
    return [true, ""];
  }
};
