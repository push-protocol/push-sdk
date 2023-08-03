import { MessageBubble } from "@pushprotocol/uiweb";
import { IMessageIPFS } from "@pushprotocol/uiweb";
import { useEffect, useContext, useState } from "react";
import { Web3Context } from "../context";
import * as PUSHAPI from "@pushprotocol/restapi"
import { ENV } from "packages/restapi/src/lib/constants";

export const MessageBubbles = () => {

    const { library } = useContext<any>(Web3Context)
    const [message, setMessage] = useState<IMessageIPFS[]>([])

    const librarySigner = library.getSigner()

    const fetchMessage = async () => {
        const user = await PUSHAPI.user.get({
            account: 'eip155:0xEDF59F183584107B20e2c95189A4423224bba8F2'
        })
        const pgpDecryptedPvtKey = await PUSHAPI.chat.decryptPGPKey({
            encryptedPGPPrivateKey: user.encryptedPrivateKey,
            signer: librarySigner,
            env: ENV.STAGING
        })

        const ConversationHash = await PUSHAPI.chat.conversationHash({
            account: 'eip155:0xEDF59F183584107B20e2c95189A4423224bba8F2',
            conversationId: '24b029b8e07e60291bf9d8c0c48ff993fa1e0a99105459f7404c425c92e91bac',
            env: ENV.STAGING
        });
        console.log(ConversationHash, "conversationhash")
        const chatHistory = await PUSHAPI.chat.history({
            threadhash: ConversationHash.threadHash,
            account: 'eip155:0xEDF59F183584107B20e2c95189A4423224bba8F2',
            limit: 10,
            toDecrypt: true,
            // pgpPrivateKey: pgpDecryptedPvtKey,
            env: ENV.STAGING
        })
        setMessage(chatHistory)
    }

    useEffect(() => {
        fetchMessage()
    }, [])

    return (
        <div>
            {message.map((msg) => (
                <MessageBubble account={"0xEDF59F183584107B20e2c95189A4423224bba8F2"} chat={msg} />
            ))}
        </div>
    )
}
