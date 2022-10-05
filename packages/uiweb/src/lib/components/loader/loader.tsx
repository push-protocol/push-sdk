import * as React from "react";
import styled from "styled-components";

const StyledCircularLoader2 = styled.div`
    width: 20px;
    height: 20px;
    .lds-ring {
        display: inline-block;
        position: relative;
        width: 20px;
        height: 20px;
    }
    .lds-ring div {
        box-sizing: border-box;
        display: block;
        position: absolute;
        width: 20px;
        height: 20px;
        margin: 0px;
        border: 2px solid ${({ color }) => color};
        border-radius: 50%;
        animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        border-color: ${({ color }) => color} transparent transparent transparent;
    }
    .lds-ring div:nth-child(1) {
        animation-delay: -0.45s;
    }
    .lds-ring div:nth-child(2) {
        animation-delay: -0.3s;
    }
    .lds-ring div:nth-child(3) {
        animation-delay: -0.15s;
    }
    @keyframes lds-ring {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`;
const CircularProgressSpinner = ({ color = "#fff" }) => {
    return (
        <StyledCircularLoader2 color={color}>
            <div className="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </StyledCircularLoader2>
    );
};

export default React.memo(CircularProgressSpinner);
