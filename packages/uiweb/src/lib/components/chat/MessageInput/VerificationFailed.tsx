import React, { useContext } from 'react'
import { Modal } from '../helpers/Modal'
import { Image, Section, Span } from '../../reusables'
import { ThemeContext } from '../theme/ThemeProvider';
import TokenGatedIcon from "../../../icons/Token-Gated.svg"

const VerificationFailed = () => {
    const theme = useContext(ThemeContext);
    return (
        <Modal width='439px'>
            <Section theme={theme} gap='32px' flexDirection='column'>
                <Span fontWeight='500' fontSize='24px'>Verification Failed</Span>
                <Span color={theme.textColorSecondary} fontSize='16px'>Please ensure the following conditions are met to participate and send messages.</Span>
                <Section gap='20px'>
                    <Image verticalAlign='start' style={{alignItems: "start", justifyContent: "start"}} height='32' width='32' src={TokenGatedIcon} alt='token-gated' />
                    <Section flexDirection='column'>
                        <Span textAlign='start' alignSelf='start'>Token Gated</Span>
                        <Span textAlign='start'>You need to have 1 PUSH Token in your wallet to be able to send messages.</Span>
                    </Section>
                </Section>
            </Section>
        </Modal>
    )
}

export default VerificationFailed