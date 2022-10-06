import React from 'react';
import styled from 'styled-components'

const LoadingOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #000;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0.7;

    & .loaderText {
      font-size: 3rem;
      color: #fff;
    }

    z-index: 999999;
`;

const LoadingSpinner = styled.div`
  @keyframes spinner {
    to {transform: rotate(360deg);}
  }

  &:before {
    content: '';
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 60px;
    height: 60px;
    margin-top: -10px;
    margin-left: -10px;
    border-radius: 50%;
    border-top: 4px solid #07d;
    border-right: 2px solid transparent;
    animation: spinner .6s linear infinite;
  }
`;

interface LoaderProps {
  show?: boolean;
}

function Loader({ show } : LoaderProps) {
  if (show) {
    return (
        <LoadingOverlay>
            <LoadingSpinner />
        </LoadingOverlay>
    )
  }

  return null; 
}

export default Loader;