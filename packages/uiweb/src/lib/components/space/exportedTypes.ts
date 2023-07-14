import { MouseEventHandler } from "react";

import { ENV } from "../../config";
import { SignerType } from "../../types";
import { ShareOptionsValues } from "./SpaceWidget/ScheduledWidgetContent";

export interface ISpacesUIProps {
  account: string;
  signer: SignerType;
  pgpPrivateKey: string;
  env: ENV;
}

export interface ShareConfig {
  shareUrl?: string;
  shareOptions?: Array<ShareOptionsValues>;
}
export interface ISpaceWidgetProps {
  // Add props specific to the SpaceWidget class method
  account?: string;
  bottomOffset?: number;
  rightOffset?: number;
  zIndex?: number;
  spaceId?: string;
  width?: number;
  share?: ShareConfig;
  onClose?: MouseEventHandler;

  // props only for testing demo purpose for now
  isHost?: boolean;
  isLive?: boolean;
  isJoined?: boolean;
  isTimeToStartSpace? :boolean;
  isMember?: boolean;
}
