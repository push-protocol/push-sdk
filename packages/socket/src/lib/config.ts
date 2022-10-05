import { ENV } from './constants';
type APIUrlType = {
    [key: string]: string
};

export const API_URLS : APIUrlType = {
  [ENV.PROD]: 'https://backend.epns.io',
  [ENV.STAGING]: 'https://backend-staging.epns.io',
  [ENV.DEV]: 'https://backend-dev.epns.io'
};
