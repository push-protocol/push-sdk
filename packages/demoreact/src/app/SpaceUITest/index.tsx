import { SpacesUIProvider } from '@pushprotocol/uiweb';
import { useSpaceComponents } from './useSpaceComponents';

export * from './SpaceUITest';
export * from './SpaceWidget';
export * from './SpaceFeed';
export * from "./SpaceBanner";
export * from "./CreateSpaceComponent";
export * from "./SpaceInvites";

export interface ISpacesComponentProps {
  children: React.ReactNode;
}

export const SpacesComponentProvider = ({
  children,
}: ISpacesComponentProps) => {
  const { spaceUI } = useSpaceComponents();

  const customtheme = {
    statusColorError: 'red',
  }

  return (
    <SpacesUIProvider spaceUI={spaceUI} theme={customtheme}>
      {children}
    </SpacesUIProvider>
  );
};
