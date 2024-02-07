import { ModalBackgroundType, ModalPositionType } from '../../../../types';

export enum WidgetErrorCodes {
    NOTIFICATION_WIDGET_SUBSCRIBE_ERROR = 'NW-001',
    NOTIFICATION_WIDGET_UNSUBSCRIBE_ERROR = 'NW-002',
    NOTIFICATION_WIDGET_PREFERENCE_UPDATION_ERROR = 'NW-003',
    NOTIFICATION_WIDGET_CHANNEL_INFO_ERROR = 'NW-004',
  }

  export const WidgetErrorMessages = {
    'NW-001' : {
        title:'',
        subTitle:''
    },
    'NW-002' : {
        title:'',
        subTitle:''
    },
    'NW-003' : {
        title:'',
        subTitle:''
    },
    'NW-004' : {
        title:'Error in fetching details',
        subTitle:'We encountered an error while fetching channel details. Please try again.'
    },
  }



export interface  ISubscriptionManagerProps {
    autoconnect?:boolean;
    channelAddress: string,
    modalBackground?: ModalBackgroundType;
    modalPositionType?: ModalPositionType;
    onClose: ()=>void;
}