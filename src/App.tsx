import { useState, useEffect } from 'react';
import { ConnectKitButton } from 'connectkit';
import LandingPage from './pages/LandingPage';
import Restricted from './pages/Restricted';
import { useAccount } from "wagmi";
import { ethers } from 'ethers';
import { sign } from 'crypto';


function App() {
  const { address, isConnecting, isDisconnected, isConnected } = useAccount();
  const [allowed, setAllowed] = useState(false);
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const abi = [ /* ERC721 contract ABI */ ];
  const contractAddress = '0x...'; // Replace with the address of your ERC721 contract
  
  const contract = new ethers.Contract(contractAddress, abi, provider);

  async function checkBalance() {
    const balance = await contract.balanceOf(signer.getAddress());
    if(balance.gt(0)){
      setAllowed(true);
    }
  }
  
  useEffect(() => {
    checkBalance();
  }, [])
  
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <p>{address}</p>
      <ConnectKitButton />
      {isConnecting && 
        <p>Connecting...</p>}
      {isConnected && !allowed && 
        <div>
          <LandingPage />
        </div>}
      {allowed &&
        <Restricted />}
      

    </div>
  );
}

export default App;