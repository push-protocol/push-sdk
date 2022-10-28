import { Signer } from "ethers";
import { IUser } from "../../types";
import { get } from "../../user";

const checkConnectedUser = (connectedUser: IUser): boolean => {
  if (
    !(
      connectedUser.allowedNumMsg === 0 &&
      connectedUser.numMsg === 0 &&
      connectedUser.about === '' &&
      connectedUser.signature === '' &&
      connectedUser.encryptedPrivateKey === '' &&
      connectedUser.publicKey === ''
    )
  ) {
    return true;
  } else return false;
}

export const createUserIfNecessary = async(signer: Signer): Promise<IUser> =>{
  const account = await signer.getAddress();
  const connectedUser = await get({account:account}); 
  if (!checkConnectedUser(connectedUser)) {
    // const createdUser: IUser = await create({signer:signer});
    return connectedUser;
  } else {
    return connectedUser;
  }
}


export const checkIfPvtKeyExists = async(signer: Signer,privateKey:string | null): Promise<boolean> =>{
  const account = await signer.getAddress();
  const user = await get({account:account});
  if(user.encryptedPrivateKey && !privateKey)
  {
    return true;
  }
  return false;
}

