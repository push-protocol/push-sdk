import React, { useContext, useEffect } from "react";
import styled from "styled-components";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from "@web3-react/core";
import { useChatData } from "../../../hooks";
import * as PUSHAPI from "@pushprotocol/restapi"
import { Spinner } from "../../reusables";
import { ThemeContext } from "../theme/ThemeProvider";

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
    padding: 24px 9px;
    font-weight: 500;
    margin: 10px;
    border-radius: 12px;
    font-size: 17px;
    cursor: pointer;
    width: 165px;
    height: 44px;
    text-align: start;
    align-items: center;
    display: flex;
    justify-content: center;
  `;

const Connect = styled(StyledButton)`
    color: rgb(255, 255, 255);
    background: #D53A94;
  `;

const Disconnect = styled(StyledButton)`
display: flex;
padding: 9px 24px;
justify-content: center;
align-items: center;
gap: 10px;
background: var(--general-use-creamy-pink, #D53A94);
color: var(--general-use-white, #ffffff);
  `;

export const ConnectButton = () => {
    const { active, activate, library } = useWeb3React();
    const { pgpPrivateKey, account, env, setPgpPrivateKey } = useChatData();
    const theme = useContext(ThemeContext);

    useEffect(() => {
        if (active && account && env && library) {
            const librarySigner = library.getSigner();

            const connectBtn = async () => {
                const user = await PUSHAPI.user.get({ account: account, env: env });
                if (!user) {
                    await createProfile();
                }
                if (user?.encryptedPrivateKey && !pgpPrivateKey) {
                    const decryptPgpKey = await PUSHAPI.chat.decryptPGPKey({
                        encryptedPGPPrivateKey: user.encryptedPrivateKey,
                        account: account,
                        signer: librarySigner,
                        env: env,
                    });
                    setPgpPrivateKey(decryptPgpKey);
                }
            };

            connectBtn();
        }
    }, [active, account, env, library, pgpPrivateKey, setPgpPrivateKey]);

    const createProfile = async () => {
        if (!account || !env || !library) return;

        const librarySigner = library.getSigner();

        const user = await PUSHAPI.user.create({
            signer: librarySigner,
            env: env,
        });

        const createdUser = await PUSHAPI.user.get({
            account: account,
            env: env,
        });

        const pvtKey = await PUSHAPI.chat.decryptPGPKey({
            encryptedPGPPrivateKey: createdUser.encryptedPrivateKey ? createdUser.encryptedPrivateKey : "",
            signer: librarySigner,
            env: env,
            toUpgrade: true,
        });

        setPgpPrivateKey(pvtKey);
    };

    async function connect() {
        try {
            await activate(injected);
        } catch (ex) {
            console.log(ex);
        }
    }

    const connectWalletOnPageLoad = async () => {
        try {
            await activate(injected);
        } catch (ex) {
            console.log(ex);
        }
    };

    useEffect(() => {
        if (!pgpPrivateKey && !account) {
            connectWalletOnPageLoad();
        }
    }, [pgpPrivateKey, account, activate, env]);

    return (
        <ConnectWrapper>
            {active ? (
                <>
                    <Connect theme={theme}>
                        <Spinner color={'white'} size="22" />
                    </Connect>
                </>
            ) : (
                <Connect onClick={connect}>Connect Wallet</Connect>
            )}
        </ConnectWrapper>
    );
};