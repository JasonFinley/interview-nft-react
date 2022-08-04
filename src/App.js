import { WagmiConfig } from 'wagmi';
import wagmiClient from './helpers/wagmi.client' 
import Router from './Router';

function App() {

  return (
    <WagmiConfig client={ wagmiClient }>
        <Router />
    </WagmiConfig>
  );
}

export default App;
