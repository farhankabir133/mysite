import { createWeb3Modal } from '@web3modal/wagmi/react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { arbitrum, mainnet, polygon } from 'wagmi/chains';

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;
const enableWalletConnect = Boolean(projectId);

if (!enableWalletConnect) {
  // eslint-disable-next-line no-console
  console.warn('WalletConnect Project ID not found. Web3 features will be disabled.');
}

const metadata = {
  name: 'Farhan Kabir Portfolio',
  description: 'AI Assistant with Web3 Integration',
  url: 'https://farhankabir.web.app',
  icons: ['https://farhankabir.netlify.app/favicon.ico']
};

const chains = [mainnet, arbitrum, polygon] as const;

export const config = defaultWagmiConfig({
  chains,
  // If no projectId, pass empty string but disable walletconnect to avoid
  // runtime errors. Wagmi's providers will simply not enable WalletConnect.
  projectId: projectId || '',
  metadata,
  enableWalletConnect,
  enableInjected: true,
  enableEIP6963: true,
  enableCoinbase: true
});

// Only create the modal when we have a valid projectId
if (enableWalletConnect && projectId) {
  createWeb3Modal({
    wagmiConfig: config,
    projectId,
    enableAnalytics: true,
    enableOnramp: true
  });
}

// NFT/Badge utilities
export interface Badge {
  id: string;
  name: string;
  description: string;
  image: string;
  criteria: string;
}

export const AVAILABLE_BADGES: Badge[] = [
  {
    id: 'portfolio_explorer',
    name: 'Portfolio Explorer',
    description: 'Explored Farhan\'s portfolio and projects',
    image: '/badges/explorer.svg',
    criteria: 'Viewed at least 3 different sections'
  },
  {
    id: 'ai_conversationalist',
    name: 'AI Conversationalist',
    description: 'Had an engaging conversation with the AI assistant',
    image: '/badges/conversationalist.svg',
    criteria: 'Exchanged 10+ messages with the AI'
  },
  {
    id: 'web3_pioneer',
    name: 'Web3 Pioneer',
    description: 'Connected wallet and explored Web3 features',
    image: '/badges/pioneer.svg',
    criteria: 'Connected wallet and verified identity'
  }
];

export const checkBadgeEligibility = (
  badgeId: string,
  userActivity: any
): boolean => {
  switch (badgeId) {
    case 'portfolio_explorer':
      return userActivity.sectionsViewed >= 3;
    case 'ai_conversationalist':
      return userActivity.messageCount >= 10;
    case 'web3_pioneer':
      return userActivity.walletConnected;
    default:
      return false;
  }
};