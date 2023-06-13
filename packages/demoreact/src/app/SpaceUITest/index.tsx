import { SpacesUIProvider } from "@pushprotocol/uiweb";
import { useSpaceComponents } from "./useSpaceComponents";

export * from "./SpaceUITest";
export * from "./SpaceWidget";

export interface ISpacesComponentProps {
  children: React.ReactNode;
}

export const SpacesComponentProvider = ({ children }: ISpacesComponentProps) => {
  const { spaceUI } = useSpaceComponents();

  const customtheme = {
    primary: '#00ffff',
  }

  return (
    <SpacesUIProvider spaceUI={spaceUI} theme={customtheme}>
      {children}
    </SpacesUIProvider>
  )
}
