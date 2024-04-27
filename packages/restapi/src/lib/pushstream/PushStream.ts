import { EventEmitter } from 'events';
import { createSocketConnection } from './socketClient';
import { ENV, PACKAGE_BUILD } from '../constants';
import {
  GroupEventType,
  MessageEventType,
  MessageOrigin,
  NotificationEventType,
  PushStreamInitializeProps,
  SpaceEventType,
  STREAM,
  EVENTS,
} from './pushStreamTypes';
import { DataModifier } from './DataModifier';
import { pCAIP10ToWallet, walletToPCAIP10 } from '../helpers';
import { Chat } from '../pushapi/chat';
import { ProgressHookType, SignerType } from '../types';
import { ALPHA_FEATURE_CONFIG } from '../config';
import { ADDITIONAL_META_TYPE } from '../payloads';
import { v4 as uuidv4 } from 'uuid';
export class PushStream extends EventEmitter {
  private pushChatSocket: any;
  private pushNotificationSocket: any;

  private account: string;
  private raw: boolean;
  private options: PushStreamInitializeProps;
  private chatInstance: Chat;
  private listen: STREAM[];
  private disconnected: boolean;
  public uid: string;
  public chatSocketCount: number;
  public notifSocketCount: number;
  public chatSocketConnected: boolean;
  public notifSocketConnected: boolean;
  constructor(
    account: string,
    private _listen: STREAM[],
    options: PushStreamInitializeProps,
    private decryptedPgpPvtKey?: string,
    private progressHook?: (progress: ProgressHookType) => void,
    private signer?: SignerType
  ) {
    super();

    this.account = account;

    this.raw = options.raw ?? false;
    this.options = options;
    this.listen = _listen;
    this.disconnected = false;
    this.uid = uuidv4();
    this.chatSocketCount = 0;
    this.notifSocketCount = 0;
    this.chatSocketConnected = false;
    this.notifSocketConnected = false;
    this.chatInstance = new Chat(
      this.account,
      this.options.env as ENV,
      ALPHA_FEATURE_CONFIG[PACKAGE_BUILD],
      this.decryptedPgpPvtKey,
      this.signer,
      this.progressHook
    );
  }

  static async initialize(
    account: string,
    listen: STREAM[],
    env: ENV,
    decryptedPgpPvtKey?: string,
    progressHook?: (progress: ProgressHookType) => void,
    signer?: SignerType,
    options?: PushStreamInitializeProps
  ): Promise<PushStream> {
    const defaultOptions: PushStreamInitializeProps = {
      raw: false,
      connection: {
        auto: true,
        retries: 3,
      },
      env: env,
    };

    if (!listen || listen.length === 0) {
      throw new Error(
        'The listen property must have at least one STREAM type.'
      );
    }

    const settings = {
      ...defaultOptions,
      ...options,
    };

    const accountToUse = settings.overrideAccount || account;

    const stream = new PushStream(
      accountToUse,
      listen,
      settings,
      decryptedPgpPvtKey,
      progressHook,
      signer
    );
    return stream;
  }

  public async reinit(
    listen: STREAM[],
    newOptions: PushStreamInitializeProps
  ): Promise<void> {
    this.uid = uuidv4();
    this.listen = listen;
    this.options = { ...this.options, ...newOptions };
    await this.disconnect();
    await this.connect();
  }

  public async connect(): Promise<void> {
    const shouldInitializeChatSocket =
      !this.listen ||
      this.listen.length === 0 ||
      this.listen.includes(STREAM.CHAT) ||
      this.listen.includes(STREAM.CHAT_OPS) ||
      this.listen.includes(STREAM.SPACE) ||
      this.listen.includes(STREAM.SPACE_OPS);
    const shouldInitializeNotifSocket =
      !this.listen ||
      this.listen.length === 0 ||
      this.listen.includes(STREAM.NOTIF) ||
      this.listen.includes(STREAM.NOTIF_OPS) ||
      this.listen.includes(STREAM.VIDEO);

    let isChatSocketConnected = false;
    let isNotifSocketConnected = false;

    // Function to check and emit the STREAM.CONNECT event
    const checkAndEmitConnectEvent = () => {
      if (
        ((shouldInitializeChatSocket && isChatSocketConnected) ||
          !shouldInitializeChatSocket) &&
        ((shouldInitializeNotifSocket && isNotifSocketConnected) ||
          !shouldInitializeNotifSocket)
      ) {
        this.emit(STREAM.CONNECT);
        console.log('Emitted STREAM.CONNECT');
      }
    };

    const handleSocketDisconnection = async (socketType: 'chat' | 'notif') => {
      if (socketType === 'chat') {
        isChatSocketConnected = false;
        this.chatSocketConnected = false;
        this.chatSocketCount--;
        if (isNotifSocketConnected) {
          if (
            this.pushNotificationSocket &&
            this.pushNotificationSocket.connected
          ) {
            console.log(
              'RestAPI::PushStream::handleSocketDisconnection - Disconnecting Notification Socket...'
            );
            this.pushNotificationSocket.disconnect();
          }
        } else {
          // Emit STREAM.DISCONNECT only if the notification socket was already disconnected
          this.emit(STREAM.DISCONNECT);
          console.log(
            'RestAPI::PushStream::handleSocketDisconnection - Emitted STREAM.DISCONNECT for chat.'
          );
        }
      } else if (socketType === 'notif') {
        isNotifSocketConnected = false;
        this.notifSocketConnected = false;
        this.notifSocketCount--;
        if (isChatSocketConnected) {
          if (this.pushChatSocket && this.pushChatSocket.connected) {
            console.log(
              'RestAPI::PushStream::handleSocketDisconnection - Disconnecting Chat Socket...'
            );
            this.pushChatSocket.disconnect();
          }
        } else {
          // Emit STREAM.DISCONNECT only if the chat socket was already disconnected
          this.emit(STREAM.DISCONNECT);
          console.log(
            'RestAPI::PushStream::handleSocketDisconnection - Emitted STREAM.DISCONNECT for notification.'
          );
        }
      }
    };

    if (shouldInitializeChatSocket) {
      if (!this.pushChatSocket) {
        // If pushChatSocket does not exist, create a new socket connection
        console.log(
          'RestAPI::PushStream::ChatSocket::Create - pushChatSocket does not exist, creating new socket connection...'
        );

        this.pushChatSocket = await createSocketConnection({
          user: walletToPCAIP10(this.account),
          socketType: 'chat',
          socketOptions: {
            autoConnect: this.options?.connection?.auto ?? true,
            reconnectionAttempts: this.options?.connection?.retries ?? 3,
          },
          env: this.options?.env as ENV,
        });

        if (!this.pushChatSocket) {
          throw new Error(
            'RestAPI::PushStream::ChatSocket::Error - Push chat socket not connected'
          );
        }
      } else if (this.pushChatSocket && !this.chatSocketConnected) {
        // If pushChatSocket exists but is not connected, attempt to reconnect
        console.log(
          'RestAPI::PushStream::ChatSocket::Reconnect - Attempting to reconnect push chat socket...'
        );
        this.pushChatSocket.connect(); // Assuming connect() is the method to re-establish connection
      } else {
        console.log(
          'RestAPI::PushStream::ChatSocket::Status - Push chat socket already connected'
        );
      }
    }

    if (shouldInitializeNotifSocket) {
      if (!this.pushNotificationSocket) {
        // If pushNotificationSocket does not exist, create a new socket connection
        console.log(
          'RestAPI::PushStream::NotifSocket::Create - pushNotificationSocket does not exist, creating new socket connection...'
        );
        this.pushNotificationSocket = await createSocketConnection({
          user: pCAIP10ToWallet(this.account),
          env: this.options?.env as ENV,
          socketOptions: {
            autoConnect: this.options?.connection?.auto ?? true,
            reconnectionAttempts: this.options?.connection?.retries ?? 3,
          },
        });

        if (!this.pushNotificationSocket) {
          throw new Error(
            'RestAPI::PushStream::NotifSocket::Error - Push notification socket not connected'
          );
        }
      } else if (this.pushNotificationSocket && !this.notifSocketConnected) {
        // If pushNotificationSocket exists but is not connected, attempt to reconnect
        console.log(
          'RestAPI::PushStream::NotifSocket::Reconnect - Attempting to reconnect push notification socket...'
        );
        this.notifSocketCount++;
        this.pushNotificationSocket.connect(); // Assuming connect() is the method to re-establish connection
      } else {
        // If pushNotificationSocket is already connected
        console.log(
          'RestAPI::PushStream::NotifSocket::Status - Push notification socket already connected'
        );
      }
    }

    const shouldEmit = (eventType: STREAM): boolean => {
      if (!this.listen || this.listen.length === 0) {
        return true;
      }
      return this.listen.includes(eventType);
    };

    if (this.pushChatSocket) {
      this.pushChatSocket.on(EVENTS.CONNECT, async () => {
        isChatSocketConnected = true;
        this.chatSocketCount++;
        this.chatSocketConnected = true;
        checkAndEmitConnectEvent();
        console.log(
          `RestAPI::PushStream::EVENTS.CONNECT::Chat Socket Connected (ID: ${this.pushChatSocket.id})`
        );
      });

      this.pushChatSocket.on(EVENTS.DISCONNECT, async () => {
        await handleSocketDisconnection('chat');
      });

      this.pushChatSocket.on(EVENTS.CHAT_GROUPS, (data: any) => {
        try {
          const modifiedData = DataModifier.handleChatGroupEvent(
            data,
            this.raw
          );
          modifiedData.event = DataModifier.convertToProposedName(
            modifiedData.event
          );
          DataModifier.handleToField(modifiedData);
          if (this.shouldEmitChat(data.chatId)) {
            if (
              data.eventType === GroupEventType.JoinGroup ||
              data.eventType === GroupEventType.LeaveGroup ||
              data.eventType === MessageEventType.Request ||
              data.eventType === GroupEventType.Remove ||
              data.eventType === GroupEventType.RoleChange
            ) {
              if (shouldEmit(STREAM.CHAT)) {
                this.emit(STREAM.CHAT, modifiedData);
              }
            } else {
              if (shouldEmit(STREAM.CHAT_OPS)) {
                this.emit(STREAM.CHAT_OPS, modifiedData);
              }
            }
          }
        } catch (error) {
          console.error(
            'Error handling CHAT_GROUPS event:',
            error,
            'Data:',
            data
          );
        }
      });

      this.pushChatSocket.on(
        EVENTS.CHAT_RECEIVED_MESSAGE,
        async (data: any) => {
          try {
            if (
              data.messageCategory == 'Chat' ||
              data.messageCategory == 'Request'
            ) {
              // Dont call this if read only mode ?
              if (this.decryptedPgpPvtKey) {
                data = await this.chatInstance.decrypt([data]);
                data = data[0];
              }
            }

            const modifiedData = DataModifier.handleChatEvent(data, this.raw);
            modifiedData.event = DataModifier.convertToProposedName(
              modifiedData.event
            );
            DataModifier.handleToField(modifiedData);
            if (this.shouldEmitChat(data.chatId)) {
              if (shouldEmit(STREAM.CHAT)) {
                this.emit(STREAM.CHAT, modifiedData);
              }
            }
          } catch (error) {
            console.error(
              'Error handling CHAT_RECEIVED_MESSAGE event:',
              error,
              'Data:',
              data
            );
          }
        }
      );

      this.pushChatSocket.on('SPACES', (data: any) => {
        try {
          const modifiedData = DataModifier.handleSpaceEvent(data, this.raw);
          modifiedData.event = DataModifier.convertToProposedNameForSpace(
            modifiedData.event
          );

          DataModifier.handleToField(modifiedData);

          if (this.shouldEmitSpace(data.spaceId)) {
            if (
              data.eventType === SpaceEventType.Join ||
              data.eventType === SpaceEventType.Leave ||
              data.eventType === MessageEventType.Request ||
              data.eventType === SpaceEventType.Remove ||
              data.eventType === SpaceEventType.Start ||
              data.eventType === SpaceEventType.Stop
            ) {
              if (shouldEmit(STREAM.SPACE)) {
                this.emit(STREAM.SPACE, modifiedData);
              }
            } else {
              if (shouldEmit(STREAM.SPACE_OPS)) {
                this.emit(STREAM.SPACE_OPS, modifiedData);
              }
            }
          }
        } catch (error) {
          console.error('Error handling SPACES event:', error, 'Data:', data);
        }
      });

      this.pushChatSocket.on('SPACES_MESSAGES', (data: any) => {
        try {
          const modifiedData = DataModifier.handleSpaceEvent(data, this.raw);
          modifiedData.event = DataModifier.convertToProposedNameForSpace(
            modifiedData.event
          );

          DataModifier.handleToField(modifiedData);

          if (this.shouldEmitSpace(data.spaceId)) {
            if (shouldEmit(STREAM.SPACE)) {
              this.emit(STREAM.SPACE, modifiedData);
            }
          }
        } catch (error) {
          console.error('Error handling SPACES event:', error, 'Data:', data);
        }
      });
    }

    if (this.pushNotificationSocket) {
      this.pushNotificationSocket.on(EVENTS.CONNECT, async () => {
        console.log(
          `RestAPI::PushStream::NotifSocket::Connect - Notification Socket Connected (ID: ${this.pushNotificationSocket.id})`
        );
        isNotifSocketConnected = true;
        this.notifSocketCount++;
        this.notifSocketConnected = true;
        checkAndEmitConnectEvent();
      });

      this.pushNotificationSocket.on(EVENTS.DISCONNECT, async () => {
        console.log(
          'RestAPI::PushStream::NotifSocket::Disconnect - Notification socket disconnected.'
        );
        await handleSocketDisconnection('notif');
      });

      this.pushNotificationSocket.on(EVENTS.USER_FEEDS, (data: any) => {
        try {
          if (
            data.payload.data.additionalMeta?.type ===
              `${ADDITIONAL_META_TYPE.PUSH_VIDEO}+1` &&
            shouldEmit(STREAM.VIDEO) &&
            this.shouldEmitVideo(data.sender)
          ) {
            // Video Notification
            const modifiedData = DataModifier.mapToVideoEvent(
              data,
              this.account === data.sender
                ? MessageOrigin.Self
                : MessageOrigin.Other,
              this.raw
            );

            this.emit(STREAM.VIDEO, modifiedData);
          } else {
            // Channel Notification
            const modifiedData = DataModifier.mapToNotificationEvent(
              data,
              NotificationEventType.INBOX,
              this.account === data.sender ? 'self' : 'other',
              this.raw
            );

            if (this.shouldEmitChannel(modifiedData.from)) {
              if (shouldEmit(STREAM.NOTIF)) {
                this.emit(STREAM.NOTIF, modifiedData);
              }
            }
          }
        } catch (error) {
          console.error(
            `RestAPI::PushStream::NotifSocket::UserFeeds::Error - Error handling event: ${error}, Data: ${JSON.stringify(
              data
            )}`
          );
        }
      });

      this.pushNotificationSocket.on(EVENTS.USER_SPAM_FEEDS, (data: any) => {
        try {
          const modifiedData = DataModifier.mapToNotificationEvent(
            data,
            NotificationEventType.SPAM,
            this.account === data.sender ? 'self' : 'other',
            this.raw
          );
          modifiedData.origin =
            this.account === modifiedData.from ? 'self' : 'other';
          if (this.shouldEmitChannel(modifiedData.from)) {
            if (shouldEmit(STREAM.NOTIF)) {
              this.emit(STREAM.NOTIF, modifiedData);
            }
          }
        } catch (error) {
          console.error(
            'Error handling USER_SPAM_FEEDS event:',
            error,
            'Data:',
            data
          );
        }
      });
    }

    this.disconnected = false;
  }

  public connected(): boolean {
    // Log the connection status of both sockets with detailed prefix
    console.log(
      `RestAPI::PushStream::connected::Notification Socket Connected: ${this.notifSocketConnected}`
    );
    console.log(
      `RestAPI::PushStream::connected::Chat Socket Connected: ${this.chatSocketConnected}`
    );

    return this.notifSocketConnected || this.chatSocketConnected;
  }

  public async disconnect(): Promise<void> {
    // Disconnect push chat socket if connected
    if (this.pushChatSocket && this.chatSocketConnected) {
      this.pushChatSocket.disconnect();
      console.log(
        'RestAPI::PushStream::disconnect::Push chat socket disconnected.'
      );
    }

    // Disconnect push notification socket if connected
    if (this.pushNotificationSocket && this.notifSocketConnected) {
      this.pushNotificationSocket.disconnect();
      console.log(
        'RestAPI::PushStream::disconnect::Push notification socket disconnected.'
      );
    }
  }

  public info() {
    return {
      options: this.options,
      listen: this.listen,
    };
  }

  private shouldEmitChat(dataChatId: string): boolean {
    if (
      !this.options.filter?.chats ||
      this.options.filter.chats.length === 0 ||
      this.options.filter.chats.includes('*')
    ) {
      return true;
    }
    return this.options.filter.chats.includes(dataChatId);
  }

  private shouldEmitSpace(dataSpaceId: string): boolean {
    if (
      !this.options.filter?.spaces ||
      this.options.filter.spaces.length === 0 ||
      this.options.filter.spaces.includes('*')
    ) {
      return true;
    }
    return this.options.filter.spaces.includes(dataSpaceId);
  }

  private shouldEmitChannel(dataChannelId: string): boolean {
    if (
      !this.options.filter?.channels ||
      this.options.filter.channels.length === 0 ||
      this.options.filter.channels.includes('*')
    ) {
      return true;
    }
    return this.options.filter.channels.includes(dataChannelId);
  }

  private shouldEmitVideo(dataVideoId: string): boolean {
    if (
      !this.options.filter?.video ||
      this.options.filter.video.length === 0 ||
      this.options.filter.video.includes('*')
    ) {
      return true;
    }
    return this.options.filter.video.includes(dataVideoId);
  }
}
