import NavPath from "./components/navpath";
import './assets/css/style.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
} from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

const { chains, provider } = configureChains(
  [chain.polygonMumbai],
  [
    alchemyProvider({ apiKey: "49YmnXw90OQ1d2ZRy5hCUcpgi6I6UP6H" }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Lottery',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

function App() {
  return (
  <WagmiConfig client={wagmiClient}>
    <RainbowKitProvider chains={chains}>
      <NavPath />
    </RainbowKitProvider>
  </WagmiConfig>
  );
}

export default App;
