import React, { useContext, useState } from 'react';
import { Checkbox } from '../components/Checkbox';

import { ChatPreviewList } from "@pushprotocol/uiweb";

const ChatPreviewListTest = () => {
  // define controls
  const [chatRequests, setChatRequests] = useState<boolean>(false);
  const [address, setAddress] = useState<string>();

  // set controls
  const handleChatRequestsCheckbox = () => {
    setChatRequests(!chatRequests);
  };

  const handleAddressChange = (e: React.SyntheticEvent<HTMLElement>) => {
    setAddress((e.target as HTMLInputElement).value);
  };

  return (
    <>
      <Checkbox
        id=""
        label="Fetch Chat Requests"
        value={chatRequests}
        onChange={handleChatRequestsCheckbox}
      />
      <p />
      <label>Override Address</label>
      <br />
      <input
        type="text"
        onChange={handleAddressChange}
        value={address}
        style={{ width: 400, height: 30 }}
      />
      <hr />

      <div style={{background: "#ffeded", border: "1px solid rgb(226,8,128)", height: "28.5vh"}}>
        <ChatPreviewList 
          listType={chatRequests ? "REQUESTS" : "CHATS"}
          overrideAccount={address ? address : undefined}
         onChatSelected={(chatid,chatParticipant) => { console.log("Chat id: ", chatid,chatParticipant) }}
            onUnreadCountChange={(count) => { console.log("Count is: ", count) }}
            onLoading={(loadingData) => { console.log("loading data: ", loadingData) }}
            onPaging={(chats) => { console.log("paging chats are: ", chats) }}
            onPreload={(chats) => { console.log("preload chats are: ", chats) }}
          // listType='SEARCH'
          // searchParamter='fabio.eth'
        />
      </div>
    </>
  )
}

export default ChatPreviewListTest;