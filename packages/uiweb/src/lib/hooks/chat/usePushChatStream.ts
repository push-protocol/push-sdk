/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from 'react';
import { CONSTANTS, PushAPI, SignerType } from '@pushprotocol/restapi';
import { ENV } from '../../config';
import { useChatData } from './useChatData';


export type PushChatStream = {
    account?: string | null;
    env?: ENV;
};

export const pushChatStream = () => {


    const {
        account,
        isPushChatStreamConnected,
        setIsPushChatStreamConnected,
        env,
        pushUser

    } = useChatData();


    const [chatStream, setChatStream] = useState<any>({}) // to track any new messages
    const [chatRequestStream, setChatRequestStream] = useState<any>({}); // any message in request
    const [groupMetaStream, setGroupMetaStream] = useState<any>({}); //group info
    const [pushChatStream, setPushChatStream] = useState<any>({}); //stream connection

    const addSocketEvents = async () => {
        console.warn('\n--> addChatSocketEvents - stream');
        pushChatStream?.on(CONSTANTS.STREAM.CONNECT, (err: Error) => {
            console.log('CONNECTED - stream: ', err);
            setIsPushChatStreamConnected(true);
        });
        await pushChatStream.connect();

        pushChatStream?.on(CONSTANTS.STREAM.DISCONNECT, (err: Error) => {
            console.log('DIS-CONNECTED: ', err);
            setIsPushChatStreamConnected(false);
        });


        //Listen for chat messages, your message, request, accept, rejected,
        console.log('\t-->will attach eachMessage event now - stram');
        pushChatStream?.on(CONSTANTS.STREAM.CHAT, (message: any) => {


            console.log("at streammm", message)

            if ((message.event === "chat.request")) {
                setChatRequestStream(message);
            } else {
                setChatStream((chats: any) => {
                    return { ...message };
                });
            }

            // stream?.disconnect();
        });
        pushChatStream?.on(CONSTANTS.STREAM.CHAT_OPS, (chatops: any) => {
            console.log('Alice received chat ops - stream', chatops);
            setGroupMetaStream(chatops)
        });
        // stream.disconnect();

    };



    const removeSocketEvents = () => {
        pushChatStream?.disconnect();
    };

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (Object.keys(pushChatStream || {}).length !== 0) {
            addSocketEvents();
        }

        return () => {
            if (Object.keys(pushChatStream || {}).length !== 0) {
                removeSocketEvents();
            }
        }
    }, [pushChatStream]);

    console.log("checkk", pushChatStream)
    /**
     * Whenever the requisite params to create a connection object change
     *  - disconnect the old connection 
     *  - create a new connection object
     */

    useEffect(() => {
        if (pushUser) {
            if (Object.keys(pushChatStream || {}).length !== 0) {
                console.log('=================>>> disconnection in the hook');
                pushChatStream?.disconnect();
            } else {
                const main = async () => {
                    console.log("initializngggg....")
                    const newstream = await pushUser?.initStream(
                        [
                            CONSTANTS.STREAM.CHAT,
                            CONSTANTS.STREAM.CHAT_OPS,
                            CONSTANTS.STREAM.CONNECT,
                            CONSTANTS.STREAM.DISCONNECT,

                        ],
                        {

                            connection: {
                                retries: 3, // number of retries in case of error
                            },
                            raw: true   
                        }
                    );
                    // await pushChatStream.connect();
                    console.log('new connection object: ---- ', newstream);
                    setPushChatStream(newstream);

                };
                main().catch((err) =>
                    console.log("error initializing the stream", err)
                );
            }


        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account, env, pushUser, isPushChatStreamConnected, pushChatStream]);

    return {
        chatStream,
        groupMetaStream,
        chatRequestStream,
        isPushChatStreamConnected
    }
};