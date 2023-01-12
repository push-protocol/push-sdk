import { getSigner } from './address';
import { ethers } from 'ethers';



export const getDomainInformation = (
    chainId: number,
    verifyingContract: string
  ) => {
    return {
      name: "EPNS COMM V1",
      chainId,
      verifyingContract,
    };
}

export const getTypeInformation = (action: string) => {
    if (action === "Create_user") {
      return {
        Data: [
          { name: "data", type: "string" },
        ],
      };
    }
  };