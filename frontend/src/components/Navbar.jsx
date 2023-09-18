import {ConnectButton} from '@web3uikit/web3'


export default function Navbar() {



  return (
    <div className='container-fluid p-2' style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingRight:20,
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
      
      
      <ConnectButton />

    </div>
  )
}
