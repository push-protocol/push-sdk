import { ENV } from "../constants";

export type PushStreamInitializeProps = {
  listen: string[];
  filter?: {
    channels?: string[];
    chats?: string[];
  };
  connection?: {
    auto?: boolean;
    retries?: number;
  };
  raw?: boolean;
  env: ENV;
};
