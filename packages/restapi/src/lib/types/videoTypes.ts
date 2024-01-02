import { VideoNotificationRules } from ".";

export type VideoPeerInfo = {
  address: string;
  signal: any;
  meta: {
    rules: VideoNotificationRules;
  };
};
