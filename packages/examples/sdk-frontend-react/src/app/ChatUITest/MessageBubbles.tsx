import { MessageBubble } from "@pushprotocol/uiweb";
import { useEffect, useContext, useState } from "react";
import { EnvContext, Web3Context } from "../context";
import * as PUSHAPI from "@pushprotocol/restapi"
import { ENV } from "@pushprotocol/uiweb";
import { IMessagePayload } from "@pushprotocol/uiweb";

export const MessageBubbles = () => {
    const { env } = useContext<any>(EnvContext);

    const { library, account } = useContext<any>(Web3Context)
    const [message, setMessage] = useState<IMessagePayload[]>([])
    const [ conversationHash , setConversationHash] = useState<string>('');

    const librarySigner = library.getSigner()

    const fetchMessage = async () => {
        const user = await PUSHAPI.user.get({
            account: account
        })
        const pgpPrivateKey = await PUSHAPI.chat.decryptPGPKey({
            encryptedPGPPrivateKey: user.encryptedPrivateKey,
            signer: librarySigner,
            env: env
        })

        const ConversationHash = await PUSHAPI.chat.conversationHash({
            account: `eip155:${account}`,
            conversationId: '24b029b8e07e60291bf9d8c0c48ff993fa1e0a99105459f7404c425c92e91bac',
            env: env
        });
        setConversationHash(ConversationHash.threadHash);
        if(ConversationHash?.threadHash){
        const chatHistory = await PUSHAPI.chat.history({
            threadhash: conversationHash,
            account: account,
            limit: 10,
            toDecrypt: true,
            pgpPrivateKey: pgpPrivateKey ? pgpPrivateKey : undefined,
            env: env
        })
        setMessage(chatHistory)
        console.log(chatHistory)
    }
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
