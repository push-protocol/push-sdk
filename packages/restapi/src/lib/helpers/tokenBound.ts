import { TokenboundClient } from '@tokenbound/sdk';
import { isValidCAIP10NFTAddress } from './address';

/**
 * Returns TokenBound Address for a given NFT only if the TokenBound Address is deployed
 * @param nftDID Push Compatible NFT DID
 */
export const getTokenBoundAddress = async (nftDID: string): Promise<string> => {
  if (!isValidCAIP10NFTAddress(nftDID)) {
    throw new Error(`Account is not a valid NFT-DID`);
  }
  const [, , nftChainId, nftContractAddress, nftCTokenId] = nftDID.split(':');
  const tokenboundClient = new TokenboundClient({
    chainId: +nftChainId,
  });
  const tokenBoundAccount = tokenboundClient.getAccount({
    tokenContract: nftContractAddress as `0x${string}`,
    tokenId: nftCTokenId,
  });
  const isAddressDeployed = await tokenboundClient.checkAccountDeployment({
    accountAddress: tokenBoundAccount,
  });
  if (!isAddressDeployed) {
    throw new Error(
      `TokenBound Account : ${tokenBoundAccount} for NFT-DID : ${nftDID} is not deployed!`
    );
  }
  return tokenBoundAccount;
};

/**
 * Returns NFT DID for a given TokenBound Address only if the TokenBound Address is deployed
 * @param tokenboundAddress Deployed TokenBound Address of an NFT
 * @returns
 */
export const getNFTDID = async (
  tokenboundAddress: string,
  nftDid: string
): Promise<string> => {
  if (!isValidCAIP10NFTAddress(nftDid)) {
    throw new Error(`Account is not a valid NFT-DID`);
  }
  const nftChainId = +nftDid.split(':')[2];
  const tokenboundClient = new TokenboundClient({
    chainId: +nftChainId,
  });
  const nft = await tokenboundClient.getNFT({
    accountAddress: tokenboundAddress as `0x${string}`,
  });
  const { tokenContract, tokenId, chainId } = nft;
  const nftDID = `nft:eip155:${chainId}:${tokenContract}:${tokenId}`;
  return nftDID;
};
