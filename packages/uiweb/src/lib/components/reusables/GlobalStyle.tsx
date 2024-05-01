import { createGlobalStyle } from "styled-components";

// Define global styles
export const GlobalStyle = createGlobalStyle`
  :root {
    --onboard-modal-z-index:9999999999999 !important;
    /* Wallet connect modal z-index */
    --wcm-z-index: 9999999999999 !important;
  }
`;