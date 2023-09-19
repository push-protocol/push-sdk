// import {
//   ISpaceFeedProps,
//   ISpaceBannerProps,
//   ISpaceWidgetProps,
//   ISpaceCreateWidgetProps,
//   SpacesUI,
//   ISpaceInvitesProps,
// } from '@pushprotocol/uiweb';
// import { useAccount, useSigner } from 'wagmi';
// import React, { useContext} from 'react';
// import { ENV } from '@pushprotocol/restapi/src/lib/constants';
// import * as PushAPI from '@pushprotocol/restapi';
// import { AccountContext } from '../../contexts';

// export interface IUseSpaceReturnValues {
//   spaceUI: SpacesUI;
//   SpaceInvitesComponent: React.FC<ISpaceInvitesProps>;
//   SpaceWidgetComponent: React.FC<ISpaceWidgetProps>;
//   SpaceFeedComponent: React.FC<ISpaceFeedProps>;
//   SpaceBannerComponent: React.FC<ISpaceBannerProps>;
//   CreateSpaceComponent: React.FC<ISpaceCreateWidgetProps>;
// }

// export const useSpaceComponents = (): IUseSpaceReturnValues => {
//   const env = ENV.DEV;

//   const { address } = useAccount();
//   const { data: signer } = useSigner();

//   const { pgpPrivateKey } = useContext<any>(AccountContext);

//   const spaceUI = new SpacesUI({
//     account: address as string,
//     signer: signer as PushAPI.SignerType,
//     pgpPrivateKey: pgpPrivateKey,
//     env: env,
//   });

//   return {
//     spaceUI,
//     SpaceInvitesComponent: spaceUI.SpaceInvites,
//     SpaceWidgetComponent: spaceUI.SpaceWidget,
//     SpaceBannerComponent: spaceUI.SpaceBanner,
//     SpaceFeedComponent: spaceUI.SpaceFeed,
//     CreateSpaceComponent: spaceUI.SpaceCreationButtonWidget,
//   };
// };
