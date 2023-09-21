import {
  CreateGroupEvent,
  Meta,
  GroupEventRawData,
  UpdateGroupEvent,
  MessageRawData,
  MessageEvent,
} from './pushStreamTypes';

export class DataModifier {
  public static handleChatGroupEvent(
    data: any,
    includeRaw = false
  ): any {
    if (data.eventType === 'create') {
      return this.mapToCreateGroupEvent(data, includeRaw);
    } else if (data.eventType === 'update') {
      return this.mapToUpdateGroupEvent(data, includeRaw);
    } else {
      console.warn('Unknown eventType:', data.eventType);
      return data;
    }
  }

  private static buildChatGroupEventMetaAndRaw(
    incomingData: any,
    includeRaw: boolean
  ): {
    meta: Meta;
    raw?: GroupEventRawData;
  } {
    const meta: Meta = {
      name: incomingData.groupName,
      description: incomingData.groupDescription,
      image: incomingData.groupImage,
      owner: incomingData.groupCreator,
      members: incomingData?.members || [], // TODO: only latest 20, TODO: Fix member user profiles
      admins: incomingData?.admins || [], // TODO: only latest 20
      pending: incomingData?.pending || [], // TODO: only latest 20
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

  public static mapToCreateGroupEvent(
    incomingData: any,
    includeRaw: boolean
  ): CreateGroupEvent {
    const { meta, raw } = this.buildChatGroupEventMetaAndRaw(
      incomingData,
      includeRaw
    );

    const createGroupEvent: CreateGroupEvent = {
      event: 'createGroup',
      origin: 'self', // TODO: This is missing in the event
      timestamp: String(Date.now()), // TODO: This is missing in the event
      chatId: incomingData.chatId,
      from: incomingData.groupCreator,
      meta,
    };

    if (includeRaw) {
      createGroupEvent.raw = raw;
    }
    return createGroupEvent;
  }

  public static mapToUpdateGroupEvent(
    incomingData: any,
    includeRaw: boolean
  ): UpdateGroupEvent {
    const { meta, raw } = this.buildChatGroupEventMetaAndRaw(
      incomingData,
      includeRaw
    );

    const updateGroupEvent: UpdateGroupEvent = {
      event: 'updateGroup',
      origin: incomingData.origin, // TODO: This is missing in the event
      timestamp: String(Date.now()), // TODO: This is missing in the event
      chatId: incomingData.chatId,
      from: incomingData.from, // TODO: This is missing in the event
      meta,
    };

    if (includeRaw) {
      updateGroupEvent.raw = raw;
    }

    return updateGroupEvent;
  }

  public static mapToMessageEvent(
    data: any,
    includeRaw = false
  ): MessageEvent {
    const messageEvent: MessageEvent = {
      event: 'message',
      origin: data.messageOrigin === 'other' ? 'other' : 'self', // Replace with the actual logic
      timestamp: data.timestamp.toString(),
      chatId: data.chatId,
      from: data.fromCAIP10,
      to: [data.toCAIP10], // Assuming 'to' is an array in MessageEvent. Update as necessary.
      message: {
        type: data.messageType,
        content: data.messageContent,
      },
      meta: {
        group: true, // Replace with the actual logic
      },
    };

    if (includeRaw) {
      const rawData: MessageRawData = {
        fromCAIP10: data.fromCAIP10,
        toCAIP10: data.toCAIP10,
        fromDID: data.fromDID,
        toDID: data.toDID,
        messageObj: data.messageObj,
        messageContent: data.messageContent,
        messageType: data.messageType,
        timestamp: data.timestamp,
        encType: data.encType,
        encryptedSecret: data.encryptedSecret,
        signature: data.signature,
        sigType: data.sigType,
        verificationProof: data.verificationProof,
        link: data.link,
        cid: data.cid,
        chatId: data.chatId,
      };
      messageEvent.raw = rawData;
    }
    return messageEvent;
  }

  public static handleChatEvent(data: any, includeRaw = false): any {
    if (data.messageCategory === 'Chat') {
      return this.mapToMessageEvent(data, includeRaw);
    } else {
      console.warn('Unknown eventType:', data.eventType);
      return data;
    }
  }
}
