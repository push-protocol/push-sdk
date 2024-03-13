import { ChatProfile } from "@pushprotocol/uiweb";

export const ChatProfileTest = () => {

    return (
        <div>
            <ChatProfile 
                chatProfileLeftHelperComponent={<div>left component</div>}
                chatProfileRightHelperComponent={<div>right component</div>}
                chatId='0xf8250D363BD1F25f52F10C21188fe82c68C049c4'
// chatId='36baf37e441fdd94e23406c6c716fc4e91a93a9ee68e070cd5b054534dbe09a6'
            />
        </div>
    )
}
