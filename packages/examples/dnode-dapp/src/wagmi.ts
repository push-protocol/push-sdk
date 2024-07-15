import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'dnode dapp',
  projectId: 'f97bbdd5b40fc16dea40ffe3dee7590d',
  chains: [sepolia],
  ssr: true,
});
