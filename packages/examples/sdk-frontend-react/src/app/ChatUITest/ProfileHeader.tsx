import { ProfileHeader } from "@pushprotocol/uiweb";
import { useEffect, useContext, useState } from "react";
import { EnvContext, Web3Context } from "../context";
import * as PUSHAPI from "@pushprotocol/restapi"
// import { ENV } from "@pushprotocol/uiweb";
// import { IMessagePayload } from "@pushprotocol/uiweb";

export const ProfileHeaderTest = () => {
    const { env } = useContext<any>(EnvContext);

    const { library, account } = useContext<any>(Web3Context)
    const [chatInfo, setChatInfo] = useState<any>();
    // const [ conversationHash , setConversationHash] = useState<string>('');

    // const librarySigner = library.getSigner()

     const fetchChatInfo = async () => {
        // const conversationId = '831b1d93f36fa2fce6c3d8c7c41c53335c82ad13cbe05478579af235f10716dc';
        const conversationId = 'eip155:0x2249F031607353b949B40167ce076718AD4D813a'
        if(conversationId?.split(':')[0] === 'eip155') {
            const user = await PUSHAPI.user.get({
                account: conversationId,
                env: env
            })
            if (user) setChatInfo(user);
        } else {

        const response = await PUSHAPI.chat.getGroup({
            chatId: conversationId,
            env: env
        });
        if (response) setChatInfo(response);
    }
}

    useEffect(()=> {
      fetchChatInfo();
    },[])

    return (
        <div>
            <ProfileHeader chatInfo={chatInfo} />
        </div>
    )
}
