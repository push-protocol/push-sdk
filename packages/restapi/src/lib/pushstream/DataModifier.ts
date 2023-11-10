import {
  CreateGroupEvent,
  GroupMeta,
  GroupEventRawData,
  UpdateGroupEvent,
  MessageRawData,
  MessageEvent,
  MessageEventType,
  Member,
  GroupEventType,
  LeaveGroupEvent,
  JoinGroupEvent,
  RequestEvent,
  RemoveEvent,
  NotificationEvent,
  NotificationEventType,
  NotificationType,
  NOTIFICATION,
} from './pushStreamTypes';

export class DataModifier {
  public static handleChatGroupEvent(data: any, includeRaw = false): any {
    switch (data.eventType) {
      case 'create':
        return this.mapToCreateGroupEvent(data, includeRaw);
      case 'update':
        return this.mapToUpdateGroupEvent(data, includeRaw);
      case GroupEventType.JoinGroup:
        return this.mapToJoinGroupEvent(data, includeRaw);
      case GroupEventType.LeaveGroup:
        return this.mapToLeaveGroupEvent(data, includeRaw);
      case MessageEventType.Request:
        return this.mapToRequestEvent(data, includeRaw);
      case GroupEventType.Remove:
        return this.mapToRemoveEvent(data, includeRaw);
      default:
        console.warn('Unknown eventType:', data.eventType);
        return data;
    }
  }

  private static mapToJoinGroupEvent(
    data: any,
    includeRaw: boolean
  ): JoinGroupEvent {
    const baseEventData: JoinGroupEvent = {
      origin: data.messageOrigin,
      timestamp: data.timestamp,
      chatId: data.chatId,
      from: data.from,
      to: data.to,
      event: GroupEventType.JoinGroup,
    };

    return includeRaw
      ? {
          ...baseEventData,
          raw: { verificationProof: data.verificationProof },
        }
      : baseEventData;
  }

  private static mapToLeaveGroupEvent(
    data: any,
    includeRaw: boolean
  ): LeaveGroupEvent {
    const baseEventData: LeaveGroupEvent = {
      origin: data.messageOrigin,
      timestamp: data.timestamp,
      chatId: data.chatId,
      from: data.from,
      to: data.to,
      event: GroupEventType.LeaveGroup,
    };

    return includeRaw
      ? {
          ...baseEventData,
          raw: { verificationProof: data.verificationProof },
        }
      : baseEventData;
  }

  private static mapToRequestEvent(data: any, includeRaw: boolean): any {
    const eventData: RequestEvent = {
      origin: data.messageOrigin,
      timestamp: data.timestamp,
      chatId: data.chatId,
      from: data.from,
      to: data.to,
      event: MessageEventType.Request,
      meta: {
        group: data.isGroup || false,
      },
    };

    if (includeRaw) {
      eventData.raw = { verificationProof: data.verificationProof };
    }
    return eventData;
  }

  private static mapToRemoveEvent(data: any, includeRaw: boolean): any {
    // Whatever the structure of your RemoveEvent, modify accordingly
    const eventData: RemoveEvent = {
      origin: data.messageOrigin,
      timestamp: data.timestamp,
      chatId: data.chatId,
      from: data.from,
      to: data.to,
      event: GroupEventType.Remove,
    };

    if (includeRaw) {
      eventData.raw = { verificationProof: data.verificationProof };
    }
    return eventData;
  }

  private static buildChatGroupEventMetaAndRaw(
    incomingData: any,
    includeRaw: boolean
  ): {
    meta: GroupMeta;
    raw?: GroupEventRawData;
  } {
    const meta: GroupMeta = {
      name: incomingData.groupName,
      description: incomingData.groupDescription,
      image: incomingData.groupImage,
      owner: incomingData.groupCreator,
      private: !incomingData.isPublic,
      rules: incomingData.rules || {},
    };

    if (includeRaw) {
      const raw: GroupEventRawData = {
        verificationProof: incomingData.verificationProof,
      };
      return { meta, raw };
    }

    return { meta };
  }

  public static mapToGroupEvent(
    eventType: GroupEventType,
    incomingData: any,
    includeRaw: boolean
  ): CreateGroupEvent | UpdateGroupEvent {
    const { meta, raw } = this.buildChatGroupEventMetaAndRaw(
      incomingData,
      includeRaw
    );

    const groupEvent: any = {
      event: eventType,
      origin: incomingData.messageOrigin,
      timestamp: incomingData.timestamp,
      chatId: incomingData.chatId,
      from: incomingData.from,
      meta,
    };

    if (includeRaw) {
      groupEvent.raw = raw;
    }

    return groupEvent as CreateGroupEvent | UpdateGroupEvent;
  }

  public static mapToCreateGroupEvent(
    incomingData: any,
    includeRaw: boolean
  ): CreateGroupEvent {
    return this.mapToGroupEvent(
      GroupEventType.CreateGroup,
      incomingData,
      includeRaw
    ) as CreateGroupEvent;
  }

  public static mapToUpdateGroupEvent(
    incomingData: any,
    includeRaw: boolean
  ): UpdateGroupEvent {
    return this.mapToGroupEvent(
      GroupEventType.UpdateGroup,
      incomingData,
      includeRaw
    ) as UpdateGroupEvent;
  }

  public static mapToMessageEvent(
    data: any,
    includeRaw = false,
    eventType: MessageEventType
  ): MessageEvent {
    const messageEvent: MessageEvent = {
      event: eventType,
      origin: data.messageOrigin,
      timestamp: data.timestamp.toString(),
      chatId: data.chatId, // TODO: ChatId not working for w2w
      from: data.fromCAIP10,
      to: [data.toCAIP10], // TODO: Assuming 'to' is an array in MessageEvent. Update as necessary.
      message: {
        type: data.messageType,
        content: data.messageContent,
      },
      meta: {
        group: data.isGroup || false,
      },
      reference: data.cid,
    };

    if (includeRaw) {
      const rawData: MessageRawData = {
        fromCAIP10: data.fromCAIP10,
        toCAIP10: data.toCAIP10,
        fromDID: data.fromDID,
        toDID: data.toDID,
        encType: data.encType,
        encryptedSecret: data.encryptedSecret,
        signature: data.signature,
        sigType: data.sigType,
        verificationProof: data.verificationProof,
        previousReference: data.link,
      };
      messageEvent.raw = rawData;
    }

    return messageEvent;
  }

  public static handleChatEvent(data: any, includeRaw = false): any {
    if (!data) {
      console.error('Error in handleChatEvent: data is undefined or null');
      throw new Error('data is undefined or null');
    }

    const eventTypeMap: { [key: string]: MessageEventType } = {
      Chat: MessageEventType.Message,
      Request: MessageEventType.Request,
      Approve: MessageEventType.Accept,
      Reject: MessageEventType.Reject,
    };

    const key = data.eventType || data.messageCategory;

    if (!eventTypeMap[key]) {
      console.error(
        'Error in handleChatEvent: Invalid eventType or messageCategory',
        JSON.stringify(data)
      );
      throw new Error('Invalid eventType or messageCategory in data');
    }

    const eventType: MessageEventType = eventTypeMap[key];

    if (eventType) {
      return this.mapToMessageEvent(
        data,
        includeRaw,
        eventType as MessageEventType
      );
    } else {
      console.warn(
        'Unknown eventType:',
        data.eventType || data.messageCategory
      );
      return data;
    }
  }

  public static mapToNotificationEvent(
    data: any,
    notificationEventType: NotificationEventType,
    origin: 'other' | 'self',
    includeRaw = false
  ): NotificationEvent {
    const notificationType =
      (Object.keys(NOTIFICATION.TYPE) as NotificationType[]).find(
        (key) => NOTIFICATION.TYPE[key] === data.payload.data.type
      ) || 'BROADCAST'; // Assuming 'BROADCAST' as the default


       let recipients: string[];

       if (Array.isArray(data.payload.recipients)) {
         recipients = data.payload.recipients;
       } else if (typeof data.payload.recipients === 'string') {
         recipients = [data.payload.recipients];
       } else {
         recipients = Object.keys(data.payload.recipients);
       }

    const notificationEvent: NotificationEvent = {
      event: notificationEventType,
      origin: origin,
      timestamp: data.epoch,
      from: data.sender,
      to: recipients,
      notifID: data.payload_id.toString(),
      channel: {
        name: data.payload.data.app,
        icon: data.payload.data.icon,
        url: data.payload.data.url,
      },
      meta: {
        type: 'NOTIFICATION.' + notificationType,
      },
      message: {
        notification: {
          title: data.payload.notification.title,
          body: data.payload.notification.body,
        },
        payload: {
          title: data.payload.data.asub,
          body: data.payload.data.amsg,
          cta: data.payload.data.acta,
          embed: data.payload.data.aimg,
          meta: {
            domain: data.payload.data.additionalMeta?.domain || 'push.org',
            type: data.payload.data.additionalMeta?.type,
            data: data.payload.data.additionalMeta?.data,
          },
        },
      },
      config: {
        expiry: data.payload.data.etime,
        silent: data.payload.data.silent === '1',
        hidden: data.payload.data.hidden === '1',
      },
      source: data.source,
    };

    if (includeRaw) {
      notificationEvent.raw = {
        verificationProof: data.payload.verificationProof,
      };
    }

    return notificationEvent;
  }
}
