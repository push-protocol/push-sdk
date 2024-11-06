import { ethers } from "ethers";
import { getChainRPC } from "./chain";
import { NFTContractABI, TokenContractABI, ERC1155ContractABI } from "./abi";
import { CATEGORY } from "../../types";
import axios from "axios";

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
  setDecimals: (value: React.SetStateAction<number>) => void,
  tokenId: number
): Promise<[boolean, string]> => {
  const isValid = ethers.utils.isAddress(contract);

  if (type === 'GUILD') {
    return [false, ''];
  }

  if (!isValid) {
    if(category === CATEGORY.ERC20 || category === CATEGORY.ERC1155){
      setUnit('TOKEN');
    }else{
      setUnit('NFT');
    }
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
  } else if (category === CATEGORY.ERC721) {
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
  } else {
    // erc 1155 logic
    const [isErr, tokenInfo] = await fetchERC1155Info(contract, _chainId, tokenId);
    if (isErr) {
      // handle error
      const errMessage = `${contract} is invalid ERC1155 on chain ${_chainId}`;
      setUnit('TOKEN');
      setDecimals(18);
      return [true, errMessage];
    } else {
      // set the token info
      setUnit(tokenInfo);
      setDecimals(18);
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

export const fetchERC1155Info = async (
  contractAddress: string,
  chainId: number,
  tokenId: number,
): Promise<[boolean, string]> => {
  try {
    const rpcURL = getChainRPC(chainId);
    const provider = new ethers.providers.JsonRpcProvider(rpcURL);

    const contract = new ethers.Contract(
      contractAddress,
      ERC1155ContractABI,
      provider
    );

    const ERC1155_INTERFACE_ID = '0xd9b67a26';
    const isERC1155 = await contract.supportsInterface(ERC1155_INTERFACE_ID);

    if(isERC1155 && tokenId !== undefined) {
      try {
        const uri: string | undefined = await contract.uri(tokenId);
        const uriToCall = uri?.toString().replace('{id}', tokenId.toString());
        const response = await axios.get(uriToCall ?? '');
        const name = response.data?.name;
        return [false, name || 'ERC1155'];
      } catch (error) {
        return [false, "ERC1155"];
      }
    }

    return [!isERC1155, "ERC1155"];
  } catch {
    return [true, "ERC1155"];
  }
};
