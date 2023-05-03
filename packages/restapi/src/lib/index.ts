import * as alias from './alias';
import * as channels from './channels';
import * as user from './user';
import { getFeeds as getNotifications } from './user/getFeeds'
import * as utils from './utils';
import * as payloads from './payloads';
import { sendNotification } from './payloads/sendNotifications'
import * as chat from './chat';

export * from './types';

export {
  alias,
  channels,
  user,
  utils,
  payloads,
  chat,
  sendNotification,
  getNotifications
}