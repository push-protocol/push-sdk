import { ISpaceWidgetProps, SpacesUI } from "@pushprotocol/uiweb";
import { useContext } from "react";
import { EnvContext, Web3Context } from "../context";

export interface IUseSpaceReturnValues {
  spaceUI: SpacesUI;
  SpaceWidgetComponent: React.FC<ISpaceWidgetProps>
}

export const useSpaceComponents = (): IUseSpaceReturnValues => {
  const { account, library } = useContext<any>(Web3Context);
  const librarySigner = library.getSigner();
  const { env } = useContext<any>(EnvContext);

  const spaceUI = new SpacesUI({
    account: account,
    signer: librarySigner,
    pgpPrivateKey: 'random pvt key',
    env: env,
  });

  return {
    spaceUI,
    SpaceWidgetComponent: spaceUI.SpaceWidget
  }
}