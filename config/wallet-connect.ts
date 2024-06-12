export const walletConnectOptions = {
  signClient: {
    projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || '',
    relayUrl: 'wss://relay.walletconnect.org'
  },
  metadata: {
    name: 'Bad Kids Shop',
    description: 'Bad Kids Shop',
    url: 'https://badkids.shop',
    icons: ['']
  }
};
