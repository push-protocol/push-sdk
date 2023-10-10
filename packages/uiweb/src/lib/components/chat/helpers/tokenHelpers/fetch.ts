import { ethers } from "ethers";
import { getChainRPC } from "./chain";
import { NFTContractABI, TokenContractABI } from "./abi";

interface ERC20InfoType {
  symbol: string;
  decimals: number;
}

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
