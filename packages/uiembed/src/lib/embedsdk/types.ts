
export interface ConfigType {
  targetID: string,
  chainId: number,
  appName: string,
  user: string,
  headerText?: string,
  viewOptions: {
    type?: string,
    showUnreadIndicator?: boolean,
    unreadIndicatorColor?: string,
    unreadIndicatorPosition?: string
  },  
  onOpen?: () => void,
  onClose?: () => void,
  isInitialized?: boolean,
  theme?: string
}

export interface MessagePayloadType {
  msg: unknown,
	channel: string,
	topic: string
}

export interface NotificationType {
  payload_id: number
}

export interface EmbedSDKType {
  init: (options: ConfigType) => boolean | undefined
  cleanup: () => void
}