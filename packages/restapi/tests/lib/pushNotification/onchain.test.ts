// import * as path from 'path';
// import * as dotenv from 'dotenv';
// dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
// import { expect } from 'chai';
// import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';

// import { PushNotification } from '../../../../src/lib/pushNotification/PushNotification';
// import {
//   createWalletClient,
//   http,
//   getContract,
//   createPublicClient,
// } from 'viem';
// import { abi } from './tokenABI';
// import { goerli, polygonMumbai } from 'viem/chains';
// import { BigNumber, ethers } from 'ethers';

// describe.only('test', () => {
//   const signer = createWalletClient({
//     account: privateKeyToAccount(`0x${process.env['WALLET_PRIVATE_KEY']}`),
//     chain: goerli,
//     transport: http(
//       'https://goerli.blockpi.network/v1/rpc/public'
//     ),
//   });

//   const signer3 = createWalletClient({
//     account: privateKeyToAccount(`0x${process.env['WALLET_PRIVATE_KEY']}`),
//     chain: polygonMumbai,
//     transport: http(),
//   });

//   const provider = new ethers.providers.JsonRpcProvider(
//     'https://goerli.blockpi.network/v1/rpc/public'
//   );
//   const signer2 = new ethers.Wallet(
//     `0x${process.env['WALLET_PRIVATE_KEY']}`,
//     provider
//   );

//   it.only('testing with viem', async () => {
//     const userViem = await PushNotification.initialize(signer);
//     const viemContract = await userViem.createContractInstance(
//       '0x2b9bE9259a4F5Ba6344c1b1c07911539642a2D33',
//       abi,
//       goerli
//     );
//     // const balance = await userViem.fetchBalance(
//     //   viemContract,
//     //   '0xD8634C39BBFd4033c0d3289C4515275102423681'
//     // );
//     // console.log(balance);
//     // const allowance = await userViem.fetchAllownace(
//     //   viemContract,
//     //   '0xD8634C39BBFd4033c0d3289C4515275102423681',
//     //   '0xd4E3ceC407cD36d9e3767cD189ccCaFBF549202C'
//     // );
//     // console.log(allowance);
//     // const approveAmount = ethers.BigNumber.from(10000);
//     // const approveRes = await userViem.approveToken(
//     //   viemContract,
//     //   '0xd4E3ceC407cD36d9e3767cD189ccCaFBF549202C',
//     //   approveAmount
//     // );
//     // console.log(approveRes);

//     const addDelegate = await userViem.delegate.add(
//       'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681'
//     );
//     console.log(addDelegate);
//   });

//   it('test with ethers', async () => {
//     const userEthers = await PushNotification.initialize(signer2);
//     const ethersContract = await userEthers.createContractInstance(
//       '0x2b9bE9259a4F5Ba6344c1b1c07911539642a2D33',
//       abi,
//       goerli
//     );
//     const balance2 = await userEthers.fetchBalance(
//       ethersContract,
//       '0xD8634C39BBFd4033c0d3289C4515275102423681'
//     );
//     console.log(balance2);
//     const allowance2 = await userEthers.fetchAllownace(
//       ethersContract,
//       '0xD8634C39BBFd4033c0d3289C4515275102423681',
//       '0xd4E3ceC407cD36d9e3767cD189ccCaFBF549202C'
//     );
//     console.log(allowance2);
//     const approveAmount2 = ethers.BigNumber.from(10000);
//     const approveRes2 = await userEthers.approveToken(
//       ethersContract,
//       '0xd4E3ceC407cD36d9e3767cD189ccCaFBF549202C',
//       approveAmount2
//     );
//     console.log(approveRes2);
//   });
// });
