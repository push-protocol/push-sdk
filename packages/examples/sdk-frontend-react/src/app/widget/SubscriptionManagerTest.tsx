import { SubscriptionManager } from "@pushprotocol/uiweb";

export const SubscriptionManagerTest = () => {

    return (
        <div>
            <SubscriptionManager 
               channelAddress="eip155:11155111:0x778D3206374f8AC265728E18E3fE2Ae6b93E4ce4"
               onClose={()=>console.debug('on close modal')}
               autoconnect={false}
            />
        </div>
    )
}
