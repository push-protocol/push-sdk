import { useEffect, useState } from 'react';
import { CONSTANTS, PushAPI, SignerType } from '@pushprotocol/restapi';
import { ENV } from '../../config';
import { useChatData } from './useChatData';


export type PushChatSocketHookOptions = {
    account?: string | null;
    env?: ENV;
};

export const usePushSDKStream = () => {


    const {
        account,
        pushStream,
        pushSetStream,
        setIsPushChatStreamConnected,
        isPushChatStreamConnected,
        env,
        pushUser
    } = useChatData();

    const [chatStream, setChatStream] = useState<any>({});

    //   not needed anymore - can be found in messageSinceLastConnection
    const [chatRequestStream, setChatRequestStream] = useState<any>({});
    const [groupMetaStream, setGroupMetaStream] = useState<any>({});


    const addSocketEvents = async () => {
        console.warn('\n--> addChatSocketEvents - stream');
        pushStream.on(CONSTANTS.STREAM.CONNECT, (err: Error) => {
            console.log('CONNECTED - stream: ', err);
            setIsPushChatStreamConnected(true);
        });
        await pushStream.connect();

        pushStream.on(CONSTANTS.STREAM.DISCONNECT, (err: Error) => {
            console.log('DIS-CONNECTED: ', err);
            setIsPushChatStreamConnected(false);
        });


        //Listen for chat messages, your message, request, accept, rejected,
        console.log('\t-->will attach eachMessage event now - stram');
        pushStream.on(CONSTANTS.STREAM.CHAT, (message: any) => {


            console.log("at streammm", message)

            if ((message.event === "chat.request")) {
                setChatRequestStream(message);
            } else {
                setChatStream((chats: any) => {
                    return { ...message };
                });
            }


        });
        pushStream.on(CONSTANTS.STREAM.CHAT_OPS, (chatops: any) => {
            console.log('Alice received chat ops - stream', chatops);
            setGroupMetaStream(chatops)
        });
        // stream.disconnect();

    };



    const removeSocketEvents = () => {
        pushStream?.disconnect();
    };

    useEffect(() => {
        if (pushStream) {
            addSocketEvents();
        }

        return () => {
            if (pushStream) {
                removeSocketEvents();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pushStream]);


    /**
     * Whenever the requisite params to create a connection object change
     *  - disconnect the old connection 
     *  - create a new connection object
     */
    useEffect(() => {
        if (pushUser) {
            if (pushStream) {
                // console.log('=================>>> disconnection in the hook');
                pushStream?.disconnect();
            }
            const main = async () => {
                const newstream = await pushUser?.initStream(
                    [
                        CONSTANTS.STREAM.CHAT,
                    ],
                    {}
                );

                console.warn('new connection object: ', newstream);
                pushSetStream(newstream);
                // setEpnsSDKSocket(connectionObject);
            };
            main().catch((err) =>
                console.log("error initializing the stream", err)
            );
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account, env, pushUser, isPushChatStreamConnected]);

    return {
        pushStream,
        pushSetStream,
        chatStream,
        groupMetaStream,
        chatRequestStream,
        isPushChatStreamConnected
    }
};