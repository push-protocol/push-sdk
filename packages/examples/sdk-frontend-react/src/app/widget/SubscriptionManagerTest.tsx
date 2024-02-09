import { SubscriptionManager } from "@pushprotocol/uiweb";

export const SubscriptionManagerTest = () => {

    return (
        <div>
            <SubscriptionManager 
               channelAddress="eip155:11155111:0xf9dF4b44Bb6BAf88074bb97C654bec0e4f137fE6"
               onClose={()=>console.debug('on close modal')}
               autoconnect={true}
            />
        </div>
    )
}
