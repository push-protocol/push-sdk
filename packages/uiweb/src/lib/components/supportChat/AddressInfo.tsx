import React, { useContext, useEffect, useState } from 'react';

import styled from 'styled-components';
import { ethers } from 'ethers';

import { ChatProps } from './Chat';

import { SupportChatPropsContext } from '../../context';
import { Constants, ENV, InfuraAPIKey, allowedNetworks } from '../../config';

import { copyToClipboard, pCAIP10ToWallet, resolveWeb3Name } from '../../helpers';
import { CopySvg } from '../../icons/CopySvg';

export const AddressInfo: React.FC = () => {
  const { supportAddress, env, theme, user } = useContext<ChatProps>(SupportChatPropsContext);

  const [ensName, setEnsName] = useState<string>('');
  const [pushUser, setPushUser] = useState<any>({});
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const walletAddress = pCAIP10ToWallet(supportAddress!);
  const l1ChainId = allowedNetworks[env!]?.includes(1) ? 1 : 5;
  const provider = new ethers.providers.InfuraProvider(l1ChainId, InfuraAPIKey);

  useEffect(() => {
    const getUser = async () => {
      if (user) {
        const fetchedUser = await user.info();
        const ensNameResult = await resolveWeb3Name(supportAddress!, user?.env || Constants.ENV.PROD);
        setEnsName(ensNameResult!);
        setPushUser(fetchedUser);
      }
    };
    getUser();
  }, [supportAddress, user]);

  return (
    <Container theme={theme}>
      <Section>
        <ImgSpan>
          <Image
            src={pushUser?.profile?.picture ? pushUser?.profile.picture : Constants.DEFAULT_PROFILE_PICTURE}
            alt="address profile"
          />
        </ImgSpan>
        <Span theme={theme}>
          {ensName && `${ensName}`}
          {!ensName && `${walletAddress.substring(0, 8)}...${walletAddress.substring(walletAddress.length - 8)}`}
        </Span>
      </Section>
      {!isCopied && (
        <div
          onClick={() => {
            copyToClipboard(walletAddress);
            setIsCopied(true);
          }}
        >
          <CopySvg stroke={theme?.btnColorSecondary} />
        </div>
      )}
      {isCopied && (
        <div onMouseLeave={() => setIsCopied(false)}>
          <CopySvg
            stroke={theme?.btnColorSecondary}
            fill={theme?.btnColorSecondary}
          />
        </div>
      )}
    </Container>
  );
};

//styles
const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  box-sizing: border-box;
  background: ${(props) => props.theme.bgColorPrimary || '#fff'};
  border: ${(props) => props.theme.border};
  padding: 5px 20px 5px 5px;
  margin: 13px 0;
  border-radius: 29px;
`;

const Section = styled.div`
  display: flex;
`;
const ImgSpan = styled.span`
  display: flex;
  max-height: initial;
  vertical-align: middle;
  overflow: hidden;
  height: 48px;
  width: 47.5px;
  border-radius: 99px;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
`;

const Span = styled.span`
  font-weight: 500;
  font-size: 17px;
  display: flex;
  flex-wrap: wrap;
  margin: 0 10px;
  align-items: center;
  line-height: 25px;
  letter-spacing: -0.019em;
  color: ${(props: any): string => props.theme.textColorPrimary || '#000'};
`;
