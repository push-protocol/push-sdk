import { SubscriptionManager } from "@pushprotocol/uiweb";

export const SubscriptionManagerTest = () => {

    return (
        <div>
            <SubscriptionManager 
               channelAddress="qrgqor"
               onClose={()=>console.debug('on close modal')}
            />
        </div>
    )
}
