import { useState, useEffect, Fragment, useContext } from 'react';
import styled, { keyframes } from 'styled-components';
import { Image, Section } from '../../reusables';
import CloseIcon from '../../../icons/close.svg';
import { CheckCircleIcon }  from '../../../icons/CheckCircle';
import { ThemeContext } from '../theme/ThemeProvider';
import { IChatTheme } from '../theme';
import InfoIcon from '../../../icons/infodark.svg';


type toastProps =  {
    toastMessage: string;
    position?: string;
    status: string;
}

const Toast = ({ toastMessage, position, status }: toastProps) => {
    const [message, setMessage] = useState('');
    const theme = useContext(ThemeContext);

    useEffect(() => {
        setMessage(toastMessage);

        setTimeout(() => {
            setMessage('');
        }, 5000);
    }, [toastMessage]);

    const closeToast = () => {
        setMessage('');
    }
    if (message !== '') {
    return (
        <Container>
                 <Notification
                        theme={theme}
                        status={status}
                        className={`toast ${position}`} >
                           
                            <NotificationImage>
                                {status === 'success' ? <CheckCircleIcon width='35px' height='35px' /> : <InfoIcon />}
                            </NotificationImage>

                            <Section flexDirection='column' alignItems='flex-start'>
                                <NotificationTitle theme={theme}>Success</NotificationTitle>
                                <NotificationMessage theme={theme}>
                                    {toastMessage}
                                </NotificationMessage>
                            </Section>

                            <Button onClick={() => closeToast()}>
                                <Image src={CloseIcon} height="20px" maxHeight="20px" width={'auto'}   cursor='pointer' />

                            </Button>
                        </Notification>
         </Container>
    );
  } else return null
}


const Container = styled.div`
    position: fixed !important;
	z-index: 999999;
    width: 100vw;
    top: 0;
    left: 0;
    height: 100vh;
`;

const toastInRight = keyframes`
    from {
        transform: translateX(100%);
    }
    to {
        transform: translateX(0);
    }
`;

const toastInLeft = keyframes`
    from {
        transform: translateX(-100%);
    }
    to {
        transform: translateX(0);
    }
`;

const Notification = styled.div<{theme?: IChatTheme, status?: string}>`
    background: ${(props) => props.status === 'success' ? props.theme.toastSuccessBackground : props.theme.toastErrorBackground};
	transition: .3s ease;
	position: fixed;
	pointer-events: auto;
	overflow: hidden;
	margin: 0 0 6px;
	margin-bottom: 15px;
	// width: 300px;
	max-height: 100px;
	border-radius: 16px;
	box-shadow: 0 0 10px #999;
    box-shadow: 10px 10px 10px ${(props) => props.theme.toastShadowColor};
	opacity: 1;
    display: flex;
    flex-direction: row;
    gap: 10px;


    &:hover {
        box-shadow: 0 0 12px #fff;
        opacity: 1;
        cursor: pointer;
    }

    &.toast {
        height: fit-content;
        width: fit-content;
        padding: 20px 15px;
    }

    &.top-right {
        top: 20px;
        right: 20px;
        animation: ${toastInRight} .3s ease-in-out .3s both;
    }

    &.bottom-right {
        bottom: 20px;
        right: 20px;
        transition: transform .6s ease-in-out;
        animation: ${toastInRight} .7s;
    }
    
    &.top-left {
        top: 20px;
        left: 20px;
        transition: transform .6s ease-in;
        animation: ${toastInLeft} .7s;
    }
    
    &.bottom-left {
        bottom: 20px;
        left: 20px;
        transition: transform .6s ease-in;
        animation: ${toastInLeft} .7s;
    }
`;



const NotificationImage = styled.div`
`;

const NotificationTitle = styled.div`
    font-weight: 700;
    font-size: 16px;
    text-align: left;
    margin-top: 0;
    margin-bottom: 5px;
    min-width: 250px;
    color: ${(props) => props.theme.textColorPrimary};

`;

const NotificationMessage = styled.div`
    margin: 0;
	text-align: left;
    white-space: nowrap;
    color: ${(props) => props.theme.snackbarBorderText};

    font-weight: 400;
    font-size: 14px;
`;

const Button = styled.div`
    position: relative;
    font-weight: 700;
    color: #fff;
    outline: none;
    border: none;
    text-shadow: 0 1px 0 #fff;
    opacity: 1;
    line-height: 1;
    font-size: 16px;
    padding: 0;
    cursor: pointer;
    background: 0 0;
    border: 0;
`;

export default Toast;