import { ConnectButton } from "@web3uikit/web3";
import { useMoralis } from "react-moralis";


export default function Navbar() {

  const { Moralis, enableWeb3, isWeb3Enabled } = useMoralis()
  
  async function handelclick() {
    enableWeb3()
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent:'space-between'
    }}>
      <ul style={{
        listStyleType: 'none',
        display: 'flex',
        width: '30%',
        alignItems: 'center',
        justifyContent:'space-evenly'
        
      }}>
        <li>Home</li>
        <li>About</li>
        <li>Updates</li>
        
      </ul>
      <button onClick={()=>handelclick()}>Connect</button>
      {/* <ConnectButton /> */}

    </div>
  )
}
