import { SpacesUIProvider } from '@pushprotocol/uiweb';
import { useSpaceComponents } from './useSpaceComponents';

export * from './SpaceUITest';
export * from './SpaceWidget';
export * from './SpaceFeed';
export * from './SpaceBanner';
export * from './CreateSpaceComponent';
export * from './SpaceInvites';

export interface ISpacesComponentProps {
  children: React.ReactNode;
}

export const SpacesComponentProvider = ({
  children,
}: ISpacesComponentProps) => {
  const customtheme = {
    titleBg: 'linear-gradient(45deg, #E165EC 0.01%, #A483ED 100%)', //not changed
    titleTextColor: '#FFFFFF',
    bgColorPrimary: '#fff',
    bgColorSecondary: '#F7F1FB',
    textColorPrimary: '#000',
    textColorSecondary: '#657795',
    textGradient: 'linear-gradient(45deg, #B6A0F5, #F46EF6, #FFDED3, #FFCFC5)', //not changed
    btnColorPrimary: '#D53A94',
    btnOutline: '#D53A94',
    borderColor: '#FFFF',
    borderRadius: '17px',
    containerBorderRadius: '12px',
    statusColorError: '#E93636',
    statusColorSuccess: '#30CC8B',
    iconColorPrimary: '#82828A',
  };

  const customDarkTheme = {
    titleBg:
      'linear-gradient(87.17deg, #EA4EE4 0%, #D23CDF 0.01%, #8B5CF6 100%)',
    titleTextColor: '#fff',
    bgColorPrimary: '#000',
    bgColorSecondary: '#292344',
    textColorPrimary: '#fff',
    textColorSecondary: '#71717A',
    textGradient: 'linear-gradient(45deg, #B6A0F5, #F46EF6, #FFDED3, #FFCFC5)',
    btnColorPrimary: '#8B5CF6',
    btnOutline: '#8B5CF6',
    borderColor: '#3F3F46',
    borderRadius: '17px',
    containerBorderRadius: '12px',
    statusColorError: '#E93636',
    statusColorSuccess: '#30CC8B',
    iconColorPrimary: '#71717A',
  };

  return (
    // <SpacesUIProvider spaceUI={spaceUI} theme={customDarkTheme}>
    //   {children}
    // </SpacesUIProvider>
    <></>
  );
};
