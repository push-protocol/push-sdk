import { MouseEventHandler } from 'react';
import styled from 'styled-components';

export interface IModalHeaderProps {
    heading: string;
    backCallback?: MouseEventHandler;
    closeCallback?: MouseEventHandler;
}

export const ModalHeader = (props: IModalHeaderProps) => {
    return (
        <div>
            <Header>
                {
                    props.backCallback ?
                    <BackBtn
                        onClick={props.backCallback}
                    >
                        back
                    </BackBtn>
                    :
                    null
                }

                <CenterText>
                    {props.heading}
                </CenterText>

                {
                    props.closeCallback ?
                    <CloseBtn
                        onClick={props.closeCallback}
                    >
                        x
                    </CloseBtn>
                    : null
                }
            </Header>
        </div>
    )
}

/* styling */
const Header = styled.div`
    display: flex;
    align-items: center;
    width: 100%;

    margin-bottom: 24px;
`;

const BackBtn = styled.button`
    position: absolute;
    top: 0;
    left: 0;
    margin: 1.5rem;
`;

const CloseBtn = styled.button`
    position: absolute;
    top: 0;
    right: 0;
    margin: 1.5rem;

    border: none;
    background: transparent;

    &:hover {
        cursor: pointer;
    }
`;

const CenterText = styled.div`
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    margin: 1.5rem 0;

    font-weight: 500;
`;