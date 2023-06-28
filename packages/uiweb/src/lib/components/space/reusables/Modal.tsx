/**
 * @file Modal
 * generic modal component for spaces UI
 * does not handle any business logic, acts only as a container
 */
import styled from 'styled-components'

interface IModalProps {
    width?: string;
    children: any;
}

export const Modal = (props: IModalProps) => {
    return (
        <div>
            <ModalOverlay>
                <ModalParent width={props.width}>
                    { props.children }
                </ModalParent>
            </ModalOverlay>
        </div>
    )
}

/* styling */

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4); /* Black with 50% opacity */
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ModalParent = styled.div<IModalProps>`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 16px;

    background: #FFFFFF;
    border-radius: 12px;

    width: ${(props => props.width ? props.width : 'auto')};
`;