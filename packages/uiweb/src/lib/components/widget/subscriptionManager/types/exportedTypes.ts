import { ModalBackgroundType, ModalPositionType } from '../../../../types';

export enum WidgetErrorCodes {
    NOTIFICATION_WIDGET_SUBSCRIBE_ERROR = 'NW-001',
    NOTIFICATION_WIDGET_UNSUBSCRIBE_ERROR = 'NW-002',
    NOTIFICATION_WIDGET_PREFERENCE_UPDATION_ERROR = 'NW-003',
    NOTIFICATION_WIDGET_CHANNEL_INFO_ERROR = 'NW-004',
  }





export interface  ISubscriptionManagerProps {
    autoconnect?:boolean;
    channelAddress: string,
    modalBackground?: ModalBackgroundType;
    modalPositionType?: ModalPositionType;
    onClose: ()=>void;
}