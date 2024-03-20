import { SubscriptionManager } from "@pushprotocol/uiweb";

export const SubscriptionManagerTest = () => {

    return (
        <div>
            <SubscriptionManager 
               channelAddress="eip155:1:0xB88460Bb2696CAb9D66013A05dFF29a28330689D"
               onClose={()=>console.debug('on close modal')}
               autoconnect={false}
            />
        </div>
    )
}
