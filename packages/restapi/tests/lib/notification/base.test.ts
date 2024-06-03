import { expect } from 'chai';
import { privateKeyToAccount } from 'viem/accounts';
import { PushNotificationBaseClass } from '../../../src/lib/pushNotification/pushNotificationBase';
import * as config from '../../../src/lib/config';
import { createWalletClient, http } from 'viem';
import { abi } from './tokenABI';
import { goerli, polygonMumbai } from 'viem/chains';
import { ethers } from 'ethers';
import { ENV } from '../../../src/lib/constants';
import * as sinon from 'sinon';

describe('testcases for PushNotificationBaseClass (internal)', () => {
  const signer = createWalletClient({
    account: privateKeyToAccount(`0x${process.env['WALLET_PRIVATE_KEY']}`),
    chain: goerli,
    transport: http('https://goerli.blockpi.network/v1/rpc/public'),
  });

  const signer3 = createWalletClient({
    account: privateKeyToAccount(`0x${process.env['WALLET_PRIVATE_KEY']}`),
    chain: polygonMumbai,
    transport: http(),
  });

  const provider = new ethers.providers.JsonRpcProvider(
    'https://goerli.blockpi.network/v1/rpc/public'
  );
  const signer2 = new ethers.Wallet(
    `0x${process.env['WALLET_PRIVATE_KEY']}`,
    provider
  );

  it('test verifyAndBuildMinimalUserSetting', async () => {
    const account2 = await signer2.getAddress();
    const viemUser = new PushNotificationBaseClass(
      signer,
      ENV.STAGING,
      account2
    );
    const mockGetChannelOrAliasInfo = sinon
      .stub((PushNotificationBaseClass.prototype as any), 'getChannelOrAliasInfo')
      .resolves({
        channel_settings: [
          {
            index: 1,
            type: 1,
            default: false,
            notificationDescription: 'xyz2',
          },
          {
            index: 2,
            type: 2,
            upperLimit: 100,
            lowerLimit: 20,
            default: 50,
            enabled: true,
            notificationDescription: 'abcd',
          },
          {
            index: 3,
            type: 1,
            default: false,
            notificationDescription: 'xyz3',
          },
          {
            index: 4,
            type: 2,
            upperLimit: 100,
            lowerLimit: 20,
            default: 50,
            enabled: true,
            notificationDescription: 'abcd2',
          },
          {
            index: 5,
            type: 4,
            enabled: false,
            allowMultiple: true,
            description: 'test6',
            options: ['abc', 'bcd', 'efg'],
          },
          {
            index: 6,
            type: 5,
            enabled: true,
            description: 'test5',
          },
          {
            index: 7,
            type: 5,
            enabled: false,
            description: 'test6',
          },
        ],
      });
    const minimalSetting = await (
      viemUser as any
    ).verifyAndBuildMinimalUserSetting([
      { enabled: true },
      { enabled: false, value: 10 },
      { enabled: false },
      { enabled: true, value: 10 },
      { enabled: true, value: ['abc', 'bcd'] },
      { enabled: true, value: ['abcd', 'efgh', 'ijkl'] },
      { enabled: false, value: [] },
    ]);
    console.log(minimalSetting);
  });

  it('testing with viem', async () => {
    const account2 = await signer2.getAddress();
    const viemUser = new PushNotificationBaseClass(
      signer,
      ENV.STAGING,
      account2
    );
    const contract = (viemUser as any).createContractInstance(
      '0xd4E3ceC407cD36d9e3767cD189ccCaFBF549202C',
      config.ABIS.CORE,
      goerli
    );
    const res = await (viemUser as any).fetchUpdateCounter(contract, account2);
    console.log(res);
    const viemContract = await (viemUser as any).createContractInstance(
      '0x2b9bE9259a4F5Ba6344c1b1c07911539642a2D33',
      abi,
      goerli
    );
    const balance = await (viemUser as any).fetchBalance(
      viemContract,
      '0xD8634C39BBFd4033c0d3289C4515275102423681'
    );
    console.log(balance);
    const allowance = await (viemUser as any).fetchAllownace(
      viemContract,
      '0xD8634C39BBFd4033c0d3289C4515275102423681',
      '0xd4E3ceC407cD36d9e3767cD189ccCaFBF549202C'
    );
    console.log(allowance);
    const approveAmount = ethers.BigNumber.from(10000);
    const approveRes = await (viemUser as any).approveToken(
      viemContract,
      '0xd4E3ceC407cD36d9e3767cD189ccCaFBF549202C',
      approveAmount
    );
    console.log(approveRes);

    const addDelegate = await (viemUser as any).delegate.add(
      'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681'
    );
    console.log(addDelegate);
  });

  it('test with ethers', async () => {
    const account2 = await signer2.getAddress();
    const userEthers = new PushNotificationBaseClass(
      signer2,
      ENV.STAGING,
      account2
    );
    const contract = (userEthers as any).createContractInstance(
      '0xd4E3ceC407cD36d9e3767cD189ccCaFBF549202C',
      config.ABIS.CORE,
      goerli
    );
    const res = await (userEthers as any).fetchUpdateCounter(
      contract,
      account2
    );
    console.log(res);
    const ethersContract = await (userEthers as any).createContractInstance(
      '0x2b9bE9259a4F5Ba6344c1b1c07911539642a2D33',
      abi,
      goerli
    );
    const balance2 = await (userEthers as any).fetchBalance(
      ethersContract,
      '0xD8634C39BBFd4033c0d3289C4515275102423681'
    );
    console.log(balance2);
    const allowance2 = await (userEthers as any).fetchAllownace(
      ethersContract,
      '0xD8634C39BBFd4033c0d3289C4515275102423681',
      '0xd4E3ceC407cD36d9e3767cD189ccCaFBF549202C'
    );
    console.log(allowance2);
    const approveAmount2 = ethers.BigNumber.from(10000);
    const approveRes2 = await (userEthers as any).approveToken(
      ethersContract,
      '0xd4E3ceC407cD36d9e3767cD189ccCaFBF549202C',
      approveAmount2
    );
    console.log(approveRes2);
  });
  it('Should get proper minnimal payload', async () => {
    const inputData = [
      {
        type: 1,
        default: 1,
        description: 'test1',
      },
      {
        type: 2,
        default: 10,
        description: 'test2',
        data: {
          upper: 100,
          lower: 1,
        },
      },
      {
        type: 3,
        default: {
          lower: 10,
          upper: 50,
        },
        description: 'test3',
        data: {
          upper: 100,
          lower: 1,
          enabled: true,
          ticker: 2,
        },
      },
      {
        type: 4,
        description: 'test4',
        default: 'abcd',
        data: {
          choices: ['abcd', 'efgh', 'ijkl'],
          multiple: false,
          enabled: false,
        },
      },
      {
        type: 5,
        description: 'test5',
        data: {
          enabled: false,
        },
      },
      {
        type: 5,
        description: 'test6',
        data: {
          enabled: true,
        },
      },
    ];
    const account2 = await signer2.getAddress();
    const userAlice = new PushNotificationBaseClass(
      signer2,
      ENV.STAGING,
      account2
    );
    const minimalSettings = (userAlice as any).getMinimalSetting(inputData);
    console.log(minimalSettings);
    expect(minimalSettings).not.null;
  });

  it('testing with viem', async () => {
    const account2 = await signer2.getAddress();
    const viemUser = new PushNotificationBaseClass(
      signer,
      ENV.STAGING,
      account2
    );
    const contract = (viemUser as any).createContractInstance(
      '0xd4E3ceC407cD36d9e3767cD189ccCaFBF549202C',
      config.ABIS.CORE,
      goerli
    );
    const res = await (viemUser as any).fetchUpdateCounter(contract, account2);
    console.log(res);
    const viemContract = await (viemUser as any).createContractInstance(
      '0x2b9bE9259a4F5Ba6344c1b1c07911539642a2D33',
      abi,
      goerli
    );
    const balance = await (viemUser as any).fetchBalance(
      viemContract,
      '0xD8634C39BBFd4033c0d3289C4515275102423681'
    );
    console.log(balance);
    const allowance = await (viemUser as any).fetchAllownace(
      viemContract,
      '0xD8634C39BBFd4033c0d3289C4515275102423681',
      '0xd4E3ceC407cD36d9e3767cD189ccCaFBF549202C'
    );
    console.log(allowance);
    const approveAmount = ethers.BigNumber.from(10000);
    const approveRes = await (viemUser as any).approveToken(
      viemContract,
      '0xd4E3ceC407cD36d9e3767cD189ccCaFBF549202C',
      approveAmount
    );
    console.log(approveRes);

    const addDelegate = await (viemUser as any).delegate.add(
      'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681'
    );
    console.log(addDelegate);
  });

  it('test with ethers', async () => {
    const account2 = await signer2.getAddress();
    const userEthers = new PushNotificationBaseClass(
      signer2,
      ENV.STAGING,
      account2
    );
    const contract = (userEthers as any).createContractInstance(
      '0xd4E3ceC407cD36d9e3767cD189ccCaFBF549202C',
      config.ABIS.CORE,
      goerli
    );
    const res = await (userEthers as any).fetchUpdateCounter(
      contract,
      account2
    );
    console.log(res);
    const ethersContract = await (userEthers as any).createContractInstance(
      '0x2b9bE9259a4F5Ba6344c1b1c07911539642a2D33',
      abi,
      goerli
    );
    const balance2 = await (userEthers as any).fetchBalance(
      ethersContract,
      '0xD8634C39BBFd4033c0d3289C4515275102423681'
    );
    console.log(balance2);
    const allowance2 = await (userEthers as any).fetchAllownace(
      ethersContract,
      '0xD8634C39BBFd4033c0d3289C4515275102423681',
      '0xd4E3ceC407cD36d9e3767cD189ccCaFBF549202C'
    );
    console.log(allowance2);
    const approveAmount2 = ethers.BigNumber.from(10000);
    const approveRes2 = await (userEthers as any).approveToken(
      ethersContract,
      '0xd4E3ceC407cD36d9e3767cD189ccCaFBF549202C',
      approveAmount2
    );
    console.log(approveRes2);
  });
});
