import { ChatPreview } from "@pushprotocol/uiweb";

const ChatPreviewTest = () => {

    return (
      <div style={{background: "#ffeded", border: "1px solid rgb(226,8,128)"}}>
        <ChatPreview 
          // chatId='0x455E5AA18469bC6ccEF49594645666C587A3a71B'
          chatId='36baf37e441fdd94e23406c6c716fc4e91a93a9ee68e070cd5b054534dbe09a6'
          // chatId='36baf37e441fdd94e23406c6c716fc4e91a93a9ee68e070cd5b054534dbe09a6'
          style="Info"
        />
      </div>
    )
}

export default ChatPreviewTest;