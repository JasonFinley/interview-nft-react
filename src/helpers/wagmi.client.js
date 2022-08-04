import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import {
  defaultChains,
  chain,
  createClient,
  configureChains,
} from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { InjectedConnector } from 'wagmi/connectors/injected'

const avalancheChain = {
  id: 43_114,
  name: 'Avalanche',
  network: 'avalanche',
  nativeCurrency: {
    decimals: 18,
    name: 'Avalanche',
    symbol: 'AVAX',
  },
  rpcUrls: {
    default: 'https://api.avax-test.network/ext/bc/C/rpc',
  },
  blockExplorers: {
    default: { name: 'SnowTrace', url: 'https://testnet.snowtrace.io/' },
  },
  testnet: true,
}

const { chains, provider, webSocketProvider } = configureChains(
  [ avalancheChain ],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id !== avalancheChain.id) return null
        return { http: chain.rpcUrls.default }
      },
    }),
    publicProvider(),
  ],
)

const client = createClient({
  autoConnect: true,
  connectors: [
    new InjectedConnector({ chains }),
  ],
  provider,
  webSocketProvider,
});

export default client;