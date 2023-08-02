import type { Env } from '@pushprotocol/restapi';
import React from 'react'
import { Constants } from '../config';
import { pCAIP10ToWallet } from "../helpers";

export type IChatProps = {
    account: string;
    pgpPrivateKey: string;
    env?: Env;
    activeTab?: string;
    activeChat?: string;
}

export const ChatData: React.FC<IChatProps> = ({
    account,
    pgpPrivateKey,
    env = Constants.ENV.PROD,
    activeTab,
    activeChat,
}) => {
    const ChatPropsData = {
        account: pCAIP10ToWallet(account),
        pgpPrivateKey,
        activeChat: activeChat,
        env,
    };
    return(
        <></>
    )
}