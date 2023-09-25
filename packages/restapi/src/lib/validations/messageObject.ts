import * as Joi from 'joi';
import { CHAT, MessageObj } from '../types/messageTypes';
import { MessageType } from '../constants';
import { ca } from 'date-fns/locale';

const extractValidValues = (obj: any): string[] => {
  const validValues: string[] = [];
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      validValues.push(obj[key]);
    } else if (typeof obj[key] === 'object') {
      validValues.push(...extractValidValues(obj[key]));
    }
  }
  return validValues;
};

const messageObjSchema = Joi.object({
  content: Joi.string().required().allow(''),
});

const metaMessageObjSchema = Joi.object({
  content: Joi.string()
    .valid(...Object.values(extractValidValues(CHAT.META)))
    .required(),
  info: Joi.object({
    affected: Joi.array().items(Joi.string()).required(),
    arbitrary: Joi.object().pattern(Joi.string(), Joi.any()),
  }).required(),
});

const reationMessageObjSchema = Joi.object({
  content: Joi.string()
    .valid(...Object.values(extractValidValues(CHAT.REACTION)))
    .required(),
  reference: Joi.string().required(),
});

const readReceiptMessageObjSchema = Joi.object({
  content: Joi.string().valid(CHAT.READ_RECEIPT).required(),
  reference: Joi.string().required(),
});

const intentMessageObjSchema = Joi.object({
  content: Joi.string().valid(
    ...Object.values(extractValidValues(CHAT.INTENT))
  ),
});

export const validateMessageObj = (
  messageObj: MessageObj,
  messageType: MessageType
) => {
  let error: Joi.ValidationError | undefined = undefined;
  switch (messageType) {
    case MessageType.TEXT:
    case MessageType.IMAGE:
    case MessageType.VIDEO:
    case MessageType.AUDIO:
    case MessageType.FILE:
    case MessageType.MEDIA_EMBED:
    case MessageType.GIF: {
      error = messageObjSchema.validate(messageObj).error;
      break;
    }
    case MessageType.META: {
      error = metaMessageObjSchema.validate(messageObj).error;
      break;
    }
    case MessageType.REACTION: {
      error = reationMessageObjSchema.validate(messageObj).error;
      break;
    }
    case MessageType.READ_RECEIPT: {
      error = readReceiptMessageObjSchema.validate(messageObj).error;
      break;
    }
    case MessageType.INTENT: {
      error = intentMessageObjSchema.validate(messageObj).error;
      break;
    }
    default: {
      throw new Error('Invalid MessageType');
    }
  }

  if (error) {
    throw new Error(
      `Unable to parse this messageType. Please ensure 'messageObj' is properly defined.`
    );
  }
};
