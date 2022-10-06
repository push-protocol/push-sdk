import { StrictMode } from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ethers } from "ethers";
import { Web3ReactProvider } from "@web3-react/core";
import App from './app/app';

function getLibrary(provider: any) {
  // this will vary according to whether you use e.g. ethers or web3.js
  const gottenProvider = new ethers.providers.Web3Provider(provider, "any");
  return gottenProvider;
}

const container = document.getElementById('root');
render((
  <StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Web3ReactProvider>
  </StrictMode>
), container);
