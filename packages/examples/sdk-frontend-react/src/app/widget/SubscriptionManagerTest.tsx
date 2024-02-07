import { SubscriptionManager } from "@pushprotocol/uiweb";

export const SubscriptionManagerTest = () => {

    return (
        <div>
            <SubscriptionManager 
               channelAddress="eip155:11155111:0x74415Bc4C4Bf4Baecc2DD372426F0a1D016Fa924"
               onClose={()=>console.debug('on close modal')}
            />
        </div>
    )
}
