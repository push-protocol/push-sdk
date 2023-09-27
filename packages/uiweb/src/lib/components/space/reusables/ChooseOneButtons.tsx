import React from 'react'
import styled from 'styled-components'
import { Section, Span } from '../../reusables';

interface ChooseOneButtonsProps {
    height?: string;
    width?: string;
    option1: string;
    shortheading1?: string;
    option2: string;
    shortheading2?: string;
}

const ChooseOneButtons = ({ height, width, option1, option2, shortheading1, shortheading2 }: ChooseOneButtonsProps) => {
    return (
        <ButtonContainer>
            <Section width='176px' gap='2px' borderWidth='1px' borderRadius='12px 0px 0px 12px' borderColor='#657795' flexDirection='column'>
                <Span color='#657795' fontSize='18px'>{option1}</Span>
                <Span color='#657795' fontWeight='400' fontSize='12px'>{shortheading1}</Span>
            </Section>
            <Section width='176px' gap='2px' borderWidth='1px' borderRadius='12px 0px 0px 12px' borderColor='#657795' flexDirection='column'>
                <Span color='#657795' fontSize='18px'>{option2}</Span>
                <Span color='#657795' fontWeight='400' fontSize='12px'>{shortheading2}</Span>
            </Section>
        </ButtonContainer>
    )
}

export default ChooseOneButtons;

const ButtonContainer = styled.div`
display: flex;
height: 62px;
`

const ButtonHeader = styled.div`
font-size: 16px;
font-weight: 500;
`