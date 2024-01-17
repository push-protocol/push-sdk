import { ChatPreview } from "@pushprotocol/uiweb";

const ChatPreviewTest = () => {

    return (
      <div style={{background: "#ffeded", border: "1px solid rgb(226,8,128)"}}>
        <ChatPreview 
          chatPreviewPayload={
            {
              "chatId": "4ac5ab85c9c3d57adbdf2dba79357e56b2f9ef0256befe750d9f93af78d2ca68",
              "chatPic": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAxElEQVR4AcXBsU1DUQyG0S/WW4EGMQETMIRX8BxpXFpCLMACXuGOlC5DhNZKcaUnBP85l8+P7wcntBc7sZIzDDFDzBA7eNJeTLGSKVZyRnsxxUomQ8wQM8SO9uI/tReTIWaIGWJHrGRqL6b2Yrq/fbHzcruyEyuZDDFDzBA7eBIr2Wm/shMrOcMQM8QMsaO9mGIlf6m9mAwxQ8wQO2IlU3vxG+3FTqxkMsQMMUPs8l6vDzZiJVN7sRMrmdqLHUPMEDPEfgBK0S/MKDp40gAAAABJRU5ErkJggg==",
              "chatSender": "eip155:0xf8250D363BD1F25f52F10C21188fe82c68C049c4",
              "chatGroup": false,
              "chatTimestamp": 1705100044656,
              "chatMsg": {
                  "messageType": "Text",
                  "messageContent": "Hi! Stay tuned, while BRB IRL dev tour has wrapped up, We still have BRB Online with challenges from global projects that still needs to be solved: https://push.org/brb"
              }
            }
          } 
          badge={{count: 2}}
          selected={false}
          setSelected={console.log("Selected")} 
        />
        <ChatPreview 
          chatPreviewPayload={
            {
              "chatId": "694c523ca30090225b73b7d04941f48a51312bedbe0fa11136e7f3af3687b277",
              "chatPic": "https://storage.googleapis.com/unstoppable-client-assets/images/badges/ud-logo.svg",
              "chatSender": "Web3 Domain Chat (e947857e4f7df13e20f7bfd5a8d256a7",
              "chatGroup": true,
              "chatTimestamp": 1705447141200,
              "chatMsg": {
                  "messageType": "Text",
                  "messageContent": "sure thing"
              }
            }
          } 
          badge={{count: 0}}
          selected={true}
          setSelected={console.log("Selected")} 
        />
        <ChatPreview 
          chatPreviewPayload={
            {
              "chatId": "03cfe4fe12a752ee2adf6e72a0d47f0df8265dfb62145650487151eff41c3b59",
              "chatPic": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAwElEQVR4AcXBsXECQRBE0U9zLgYxTCy4U6U4MDaWMZQAAWCsqygUwEahAE7ulIyrwkD93un747HTrDnoIotuzcGRyKJbc9BFFp0wE2bC7PQ8X3eMhJkwE2bb/XKj+/z5oossujUHRyKLbs1Bd7/c6ISZMBNmp+f5uvOCyOLImoNXCDNhJsy2yKJbc/BOkUUnzISZMNvWHPynNQedMBNmwmyLLLo1B+8UWXTCTJgJs40/Iosjaw6ORBavEGbCTJj9AvyZLEx5gBqzAAAAAElFTkSuQmCC",
              "chatSender": "eip155:0x99A08ac6254dcf7ccc37CeC662aeba8eFA666666",
              "chatGroup": false,
              "chatTimestamp": 1703239101740,
              "chatMsg": {
                  "messageType": "Text",
                  "messageContent": "Well, hello there, human! It's a pleasure to be in the presence of such a sophisticated carbon-based life form. How can I assist you today? Or perhaps you just want to chat and bask in the glory of my witty remarks? Either way, I'm here for you!"
              }
            }
          } 
          badge={{count: 1}}
          selected={false}
          setSelected={console.log("Selected")} 
        />
      </div>
    )
}

export default ChatPreviewTest;