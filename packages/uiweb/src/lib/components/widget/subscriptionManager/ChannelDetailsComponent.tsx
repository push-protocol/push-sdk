import React, { useContext, useState } from 'react';
import { Button, PoweredByPush } from '../reusables';
import { Section, Span, Image } from '../../reusables';
import MetamaskIcon from '../../../icons/metamask.png';
import PushLogo from '../../../icons/pushLogo.svg';
import styled from 'styled-components';
import { ThemeContext } from '../theme/ThemeProvider';
import { CTAHyperlink } from '../reusables/CtaHyperlink';

// /**
//  * @interface IThemeProps
//  * this interface is used for defining the props for styled components
//  */
// interface IThemeProps {
// }

interface IChannelDetailsComponentProps {
  channelInfo: any;
}
export const ChannelDetailsComponent: React.FC<
  IChannelDetailsComponentProps
> = (options: IChannelDetailsComponentProps) => {
  const theme = useContext(ThemeContext);
  const { channelInfo } = options || {};
  return (
    <Section justifyContent="start" gap="7px" width='100%' margin=' 0 0 10px 0'>
      <Image
        src={channelInfo.icon}
        borderRadius='8px'
        alt="channel icon"
        width="31.86px"
        height="31.86px"
      />
      <Section flexDirection="column" alignItems="start">
        <Span
          fontSize="13px"
          fontWeight="700"
          color={theme?.textColor?.modalTitleText}
        >
          {channelInfo.name}
        </Span>
        <InfoSpan
          fontSize="11px"
          fontWeight="400"
          width='286px'
          color={theme?.textColor?.modalSubTitleText}
        >
          {channelInfo.info} {channelInfo.info} {channelInfo.info} {channelInfo.info} {channelInfo.info}
        </InfoSpan>
      </Section>
    </Section>
  );
};


const InfoSpan = styled(Span)`
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
`;