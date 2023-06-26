import { MouseEventHandler } from "react";

import { ENV } from "../../config";
import { SignerType } from "../../types";

export interface ISpacesUIProps {
  account: string;
  signer: SignerType;
  pgpPrivateKey: string;
  env: ENV;
}

export interface ISpaceWidgetProps {
  // Add props specific to the SpaceWidget class method
  bottomOffset?: number;
  rightOffset?: number;
  zIndex?: number;
  spaceId?: string;
  width?: number;
  shareUrl?: string;
  onClose?: MouseEventHandler;

  // props only for testing demo purpose for now
  isHost?: boolean;
  isLive?: boolean;
  isJoined?: boolean;
  isTimeToStartSpace? :boolean;
  isMember?: boolean;
}
