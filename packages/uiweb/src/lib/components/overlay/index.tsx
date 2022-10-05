import * as React from 'react';
import styled from 'styled-components';

type OverlayItemProps = {
    imageOverlay: string,
    setImageOverlay: (img: string) => void; 
}

const ImageOverlayItem: React.FC<OverlayItemProps> = ({
    imageOverlay,
    setImageOverlay
}) => {

    const onCloseOverlay = () => {
        setImageOverlay('');
    };

    return (
        <ImageWrapper onClick={onCloseOverlay} visible={Boolean(imageOverlay)}>
            <img src={imageOverlay} alt="overlay full-screen" />
        </ImageWrapper>
    )
}


// ========================= define styled components
type ImageWrapper = {
    visible?: boolean
};

const ImageWrapper = styled.div<ImageWrapper>`
    height: 100vh;
    width: 100vw;
    background: rgba(0,0,0,0.75);
    position: fixed;
    top: 0;
    left: 0;
    justify-content: center;
    align-items: center;
    display: ${(props) => props.visible ? 'flex' : 'none'};
    z-index: 2;

    img {
        max-width: 80vw;
        height: auto;
        border-radius: 10px;
    }
`;


export default ImageOverlayItem;