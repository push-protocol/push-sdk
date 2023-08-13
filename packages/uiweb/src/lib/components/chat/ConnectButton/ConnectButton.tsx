import React, { useEffect } from "react";
import styled from "styled-components";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from "@web3-react/core";
import { useChatData } from "../../../hooks";
import * as PUSHAPI from "@pushprotocol/restapi"

interface NwMappingType {
    [key: number]: string;
}


const NETWORK_MAPPING: NwMappingType = {
    1: 'ETH_MAIN_NET',
    5: 'ETH_GOERLI',
    3: 'ETH_ROPSTEN',
    137: 'POLYGON_MAINNET',
    80001: 'POLYGON_MUMBAI',
    56: 'BSC_MAINNET',
    97: 'BSC_TESTNET',
    420: 'OPTIMISM_TESTNET',
    10: 'OPTIMISM_MAINNET',
    1442: 'POLYGON_ZK_EVM_TESTNET',
    1101: 'POLYGON_ZK_EVM_MAINNET',
};

const injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42, 137, 80001, 56, 97, 10, 420, 1442, 1101],
});

const ConnectWrapper = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    margin: 20;
  
    & .account {
      font-size: 1.2rem;
      border: 1px solid green;
      border-radius: 3px;
      padding: 4px 7px;
      font-weight: 500;
      font-family: monospace;
    }
  
    & .network {
      margin: 5px 0;
    }
  `;

const StyledButton = styled.button`
    border: 0px;
    outline: 0px;
    padding: 8px 15px;
    margin: 10px;
    border-radius: 20px;
    font-size: 14px;
    cursor: pointer;
  `;

const Connect = styled(StyledButton)`
    color: rgb(255, 255, 255);
    background: rgb(103, 76, 159);
  `;

const Disconnect = styled(StyledButton)`
    color: rgb(255, 255, 255);
    background: rgb(226, 8, 128);
  `;

// interface ConnectButtonProps {
//     account?: string;
//     pgpPrivateKey?: string;
// }

export const ConnectButton = () => {
    const { active, activate, deactivate, chainId, library } = useWeb3React();
    const { pgpPrivateKey, account, env, setPgpPrivateKey } = useChatData();
    const librarySigner = library.getSigner()

    const connectBtn = async () => {
        if (!account || !env || !library) return;

        const user = await PUSHAPI.user.get({ account: account, env: env });
        if (user == null) {
            console.log("createProfile")
            createProfile()
        }
        console.log(user, "user")
        console.log(pgpPrivateKey, "pgpPrivateKey")
        if (user?.encryptedPrivateKey && !pgpPrivateKey) {
            const decryptPgpKey = await PUSHAPI.chat.decryptPGPKey({
                encryptedPGPPrivateKey: user.encryptedPrivateKey,
                account: account,
                signer: librarySigner,
                env: env,
            });
            console.log(decryptPgpKey, "decryptPgpKey")
            setPgpPrivateKey(decryptPgpKey);
        }
    }

    useEffect(() => {
        connectBtn()
    }, [account, env])

    const createProfile = async () => {
        const user = await PUSHAPI.user.create({
            signer: librarySigner,
            env: env
        })
        const createdUser = await PUSHAPI.user.get({
            account: account ? account : "",
            env: env
        });
        console.log(createdUser, "createdUser")
        const pvtKey = await PUSHAPI.chat.decryptPGPKey({
            encryptedPGPPrivateKey: createdUser.encryptedPrivateKey ? createdUser.encryptedPrivateKey : "",
            signer: librarySigner,
            env: env,
            toUpgrade: true,
        })
        setPgpPrivateKey(pvtKey)
        console.log(pvtKey, "pvtKey")
    }

    async function connect() {
        try {
            await activate(injected);
            localStorage.setItem('isWalletConnected', 'true');
        } catch (ex) {
            console.log(ex);
        }
    }

    async function disconnect() {
        try {
            deactivate();
            localStorage.setItem('isWalletConnected', 'false');
        } catch (ex) {
            console.log(ex);
        }
    }

    useEffect(() => {

        const connectWalletOnPageLoad = async () => {
            if (localStorage?.getItem('isWalletConnected') === 'true') {
                try {
                    await activate(injected);
                    localStorage.setItem('isWalletConnected', 'true');
                } catch (ex) {
                    console.log(ex);
                }
            }
        };
        connectWalletOnPageLoad();
    }, [activate]);

    return (
        <ConnectWrapper>
            {active ? (
                <>
                    <p>
                        Connected with <span className="account">{account}</span>
                    </p>
                    {chainId ? (
                        <p className="network">{NETWORK_MAPPING[chainId]}</p>
                    ) : null}
                    <Disconnect onClick={disconnect}>Disconnect Metamask</Disconnect>
                </>
            ) : (
                <Connect onClick={connect}>Connect to MetaMask</Connect>
            )}
        </ConnectWrapper>
    );
};
