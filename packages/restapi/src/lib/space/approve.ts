import {
  isValidETHAddress,
} from '../helpers';
import Constants from '../constants';
import {
  EnvOptionsType,
  SignerType
} from '../types';
import {
  approve as approveRequest
} from '../chat/approveRequest';
interface ApproveRequestOptionsType extends EnvOptionsType {
  senderAddress: string;
  pgpPrivateKey ? : string | null;
  status ? : 'Approved';
  account ? : string | null;
  signer ? : SignerType | null;
}

export const approve = async (
  options: ApproveRequestOptionsType
): Promise < string > => {
  const {
      status = 'Approved',
          account = null,
          signer = null,
          senderAddress,
          env = Constants.ENV.PROD,
          pgpPrivateKey = null,
  } = options || {};

  try {

      if (account == null && signer == null) {
          throw new Error(`At least one from account or signer is necessary!`);
      }

      if (!isValidETHAddress(senderAddress) && !senderAddress.startsWith("spaces:")) {
          throw new Error("Not a valid spaceId or ETH address");
      }
      return await approveRequest({
          status: status,
          account: account,
          signer: signer,
          senderAddress: senderAddress,
          env: env,
          pgpPrivateKey: pgpPrivateKey
      })
  } catch (err) {
      console.error(
          `[Push SDK] - API  - Error - API ${approve.name} -:  `,
          err
      );
      throw Error(
          `[Push SDK] - API  - Error - API ${approve.name} -: ${err}`
      );
  }
};