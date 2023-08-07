import { MessageBubble } from "@pushprotocol/uiweb";
import { IMessageIPFS } from "@pushprotocol/uiweb";
import { useEffect, useContext, useState } from "react";
import { Web3Context } from "../context";
import * as PUSHAPI from "@pushprotocol/restapi"
import { ENV } from "@pushprotocol/uiweb";
import { IMessagePayload } from "@pushprotocol/uiweb";

export const MessageBubbles = () => {

    const { library, account } = useContext<any>(Web3Context)
    const [message, setMessage] = useState<IMessagePayload[]>([])

    const librarySigner = library.getSigner()

    const fetchMessage = async () => {
        const user = await PUSHAPI.user.get({
            account: account
        })
        const pgpDecryptedPvtKey = await PUSHAPI.chat.decryptPGPKey({
            encryptedPGPPrivateKey: user.encryptedPrivateKey,
            signer: librarySigner,
            env: ENV.STAGING
        })

        const ConversationHash = await PUSHAPI.chat.conversationHash({
            account: account,
            conversationId: '24b029b8e07e60291bf9d8c0c48ff993fa1e0a99105459f7404c425c92e91bac',
            env: ENV.STAGING
        });
        const chatHistory = await PUSHAPI.chat.history({
            threadhash: ConversationHash.threadHash,
            account: account,
            limit: 10,
            toDecrypt: true,
            pgpPrivateKey: pgpDecryptedPvtKey ? pgpDecryptedPvtKey : undefined,
            env: ENV.STAGING
        })
        console.log(chatHistory)
        setMessage(chatHistory)
    }

    useEffect(() => {
        fetchMessage()
    }, [])

    return (
        <div style={{ height: "300px", width: "500px" }}>
            {message.map((msg) => (
                <MessageBubble chat={msg} />
            ))}
        </div>
    )
}
