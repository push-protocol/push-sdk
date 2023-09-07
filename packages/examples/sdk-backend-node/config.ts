import * as dotenv from 'dotenv';
import { ENV } from './types';
dotenv.config();

export const config = {
  env: process.env.PUSH_NODE_NETWORK
    ? (process.env.PUSH_NODE_NETWORK as ENV)
    : ('staging' as ENV), // choose ENV.STAGING or ENV.PROD
  showAPIResponse: process.env.SHOW_API_RESPONSE === 'true' ? true : false, // choose to show or hide API responses
};
