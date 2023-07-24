import { ChatStatus } from '@pushprotocol/restapi';

export const stringToChatStatus = (status: string | undefined): ChatStatus => {
  if (!status) {
    throw new Error(`Invalid ChatStatus string: ${status}`);
  }
  switch (status.toUpperCase()) {
    case 'ACTIVE':
      return ChatStatus.ACTIVE;
    case 'ENDED':
      return ChatStatus.ENDED;
    case 'PENDING':
      return ChatStatus.PENDING;
    default:
      throw new Error(`Invalid ChatStatus string: ${status}`);
  }
};
