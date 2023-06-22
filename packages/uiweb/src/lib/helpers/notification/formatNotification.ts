import * as PushAPI from '@pushprotocol/restapi';
import { ApiNotificationType } from '@pushprotocol/restapi';
import { NotificationFeedsType, ParsedNotificationType } from '../../types';

export const convertReponseToParsedArray = (response: ApiNotificationType[]) =>{
    const parsedResponse = PushAPI.utils.parseApiResponse(response);
    const map1 = new Map();
    const map2 = new Map();
    response.forEach((each: any) => {
      map1.set(each.payload.data.sid, each.epoch);
      map2.set(each.payload.data.sid, each.sender);
    });
    parsedResponse.forEach((each: any) => {
      each['date'] = map1.get(each.sid);
      each['epoch'] = new Date(each['date']).getTime() / 1000;
      each['channel'] = map2.get(each.sid);
    });
   
    return parsedResponse as  ParsedNotificationType[];
}