import React, { useContext } from 'react'
import { Modal } from '../reusables/Modal'
import { Image, Section, Span } from '../../reusables'
import { ThemeContext } from '../theme/ThemeProvider';
import TokenGatedIcon from "../../../icons/Token-Gated.svg"
import OpenLink from "../../../icons/OpenLink";
import styled from 'styled-components';
import useVerifyAccessControl from '../../../hooks/chat/useVerifyAccessControl';


const VerificationFailed = () => {
    const theme = useContext(ThemeContext);
    const { setVerificationSuccessfull, verificationSuccessfull } = useVerifyAccessControl();
    return (
        <Modal width='439px'>
            <Section theme={theme} gap='32px' flexDirection='column'>
                <Span fontWeight='500' fontSize='24px'>Verification Failed</Span>
                <Span color={theme.textColor?.encryptionMessageText} fontSize='16px'>Please ensure the following conditions are met to participate and send messages.</Span>
                <Section gap='8px' alignItems='start'>
                    <Image verticalAlign='start' height='32' width='32' src={TokenGatedIcon} alt='token-gated' />
                    <Section flexDirection='column'> {/* Added marginLeft */}
                        <Span textAlign='start' alignSelf='start'>Token Gated</Span>
                        <Span textAlign='start'>You need to have 1 PUSH Token in your wallet to be able to send messages.</Span>
                    </Section>
                </Section>
                <Section gap='8px'>
                    <ConnectWrapper>
                        <Connect>
                            Get Tokens
                            <OpenLink height='12' width='12' />
                        </Connect>
                    </ConnectWrapper>
                    <ConnectWrapperClose onClick={() => {
                         setVerificationSuccessfull(false)
                         console.log(verificationSuccessfull) 
                    }}>
                        <ConnectClose>
                            Close
                        </ConnectClose>
                    </ConnectWrapperClose>
                </Section>
            </Section>
        </Modal>
    )
}

export default VerificationFailed


const ConnectWrapper = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
  `;

const ConnectWrapperClose = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;


const StyledButton = styled.button`
    border: 0px;
    outline: 0px;
    padding: 22px 9px;
    font-weight: 500;
    border-radius: 12px;
    font-size: 17px;
    cursor: pointer;
    width: 147px;
    height: 44px;
    text-align: start;
    align-items: center;
    display: flex;
    justify-content: center;
  `;

const StyledButtonClose = styled.button`
  border: 0px;
  outline: 0px;
  padding: 24px 9px;
  font-weight: 500;
  border-radius: 12px;
  font-size: 17px;
  cursor: pointer;
  width: 147px;
  height: 44px;
  text-align: start;
  align-items: center;
  display: flex;
  justify-content: center;
`;


const Connect = styled(StyledButton)`
    color: #D53A94;
    border: 2px solid #D53A94;
    background: none;
    gap: 8px;
  `;

const ConnectClose = styled(StyledButtonClose)`
    color: rgb(255, 255, 255);
    background: #D53A94;
    gap: 8px;
  `;
