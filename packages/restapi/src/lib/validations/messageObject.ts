import * as Joi from 'joi';
import {
  META_ACTION,
  META_MESSAGE_OBJECT,
  REACTION_MESSAGE_OBJECT,
  REACTION_TYPE,
} from '../types/messageObjectTypes';

export const messageObjSchema = Joi.object<META_MESSAGE_OBJECT>({
  content: Joi.string().required().allow(''),
});

export const metaMessageObjSchema = Joi.object<META_MESSAGE_OBJECT>({
  content: Joi.string().required().allow(''),
  action: Joi.number()
    .valid(...Object.values(META_ACTION))
    .required(),
  info: Joi.object({
    affected: Joi.array().items(Joi.string()).required(),
    arbitrary: Joi.object().pattern(Joi.string(), Joi.any()),
  }).required(),
});

export const reationMessageObjSchema = Joi.object<REACTION_MESSAGE_OBJECT>({
  content: Joi.string().required().allow(''),
  action: Joi.number()
    .valid(...Object.values(REACTION_TYPE))
    .required(),
  reference: Joi.string().allow(null),
});
