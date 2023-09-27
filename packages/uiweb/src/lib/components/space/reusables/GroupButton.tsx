import React from 'react'
import styled from 'styled-components'
import { Span } from '../../reusables'

interface GroupButtonProps {
    title: string;
    onClick?: any;
}

const GroupButton = ({title, onClick}: GroupButtonProps) => {
  return (
    <ButtonContainer onClick={onClick}><Span cursor='pointer'>{title}</Span></ButtonContainer>
  )
}

export default GroupButton

const ButtonContainer = styled.div`
height: 48px;
width: 197px;
border-radius: 15px;
color: white;
background-color: #D53A94;
display: flex;
align-items: center;
justify-content: center;
text-align: center;
cursor: pointer;
`