import React, { useContext, useState } from 'react';
import { Button, Hyperlink, PoweredByPush } from '../reusables';
import { Section, Span, Image } from '../../reusables';
import MetamaskIcon from '../../../icons/metamask.png';
import PushLogo from '../../../icons/pushLogo.svg';
import styled from 'styled-components';
import { ThemeContext } from '../theme/ThemeProvider';

// /**
//  * @interface IThemeProps
//  * this interface is used for defining the props for styled components
//  */
// interface IThemeProps {
// }

interface IInstallSnapComponentProps {
  handleNext: () => void;
}
export const InstallSnapComponent: React.FC<IInstallSnapComponentProps> = (
  options: IInstallSnapComponentProps
) => {
  const { handleNext } = options || {};
  const theme = useContext(ThemeContext);

  return (
    <Section
      flexDirection="column"
      gap="20px"
      margin="12px 12px 0px 12px"
      alignItems="start"
    >
      <Section flexDirection="column" gap="10px" alignItems="start">
        <Span fontSize="21px" fontWeight="700">
          Thanks for subscribing!
        </Span>

        <Section
          flexDirection="column"
          alignItems="start"
          gap="8px"
          margin="0 0 10px 0"
        >
          <Span fontSize="16px" fontWeight="500" color={theme.textColor?.modalTitleText}>
            Getting Started
          </Span>
          <Span
            fontSize="12px"
            textAlign="left"
            fontWeight="400"
            width="100%"
            color={theme.textColor?.modalSubTitleText}
          >
            Install Push Snap to get notifications in MetaMask.
          </Span>
        </Section>
      </Section>

      <Button
        customStyle={{
          background:`${theme.backgroundColor?.modalBackground}`,
          padding: '8px',
          border: `1px solid ${theme.backgroundColor?.buttonBackground}`,
        }}
      >
        <Section gap="2px">
          <Image src={MetamaskIcon} width="20px" height="19px" />
          <Span fontSize="14px" fontWeight="500" color={theme?.textColor?.modalTitleText}>
            Install Snap
          </Span>
        </Section>
      </Button>
      <ExploreOptions />
      <PoweredByPush />
    </Section>
  );
};

const ExploreOptions = () => {
  return (
    <Section gap="10px" width="100%" justifyContent="start">
      <ExploreOptionsImage
        padding="4px"
        borderRadius="8px"
        alignItems="start"
        height="fit-content"
      >
        <Image src={PushLogo} width="20px" height="20px" />
      </ExploreOptionsImage>
      <Section flexDirection="column" gap="3px">
        <Span fontSize="12px" fontWeight="400" textAlign="left">
          Explore more ways to get notified
        </Span>
        <Hyperlink text="Explore Options" link={'https://app.push.org/'} />
      </Section>
    </Section>
  );
};

//styles
const ExploreOptionsImage = styled(Section)`
  border: 1px solid #bac4d6;
`;
