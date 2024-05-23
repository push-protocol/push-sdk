import { ChatProfile } from '@pushprotocol/uiweb';
import { CHAT_ID } from '../constants';

export const ChatProfileTest = () => {
  return (
    <div>
      <ChatProfile
        chatProfileLeftHelperComponent={<div>left component</div>}
        chatProfileRightHelperComponent={<div>right component</div>}
        chatId={CHAT_ID}
      />
    </div>
  );
};
