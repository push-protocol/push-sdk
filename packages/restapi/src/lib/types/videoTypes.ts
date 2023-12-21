import { VideNotificationRules } from ".";

export type VideoPeerInfo = {
  address: string;
  signal: any;
  meta: {
    rules: VideNotificationRules;
  };
};
