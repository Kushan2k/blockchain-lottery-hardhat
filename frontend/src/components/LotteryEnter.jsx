import { useMoralis, useWeb3Contract } from "react-moralis"
import abi from '../constants/abi.json'
import address from '../constants/address.json'
import { useEffect, useState } from "react"
import { ethers } from "ethers"

export default function LotteryEnter() {

  const {chainId,isWeb3Enabled,enableWeb3}=useMoralis()
  const [entraceFee, setFee] = useState()
  
  const {runContractFunction,data,isFetching,isLoading} = useWeb3Contract(
    {
      abi: abi,
      contractAddress: address[parseInt(chainId)][0],
      params: '',
      functionName: '',
      msgValue:''
    }
  )

  
  const { runContractFunction:getEntraceFee } = useWeb3Contract(
    {
      abi: abi,
      contractAddress: address[parseInt(chainId)][0],
      params: {},
      functionName: 'getEntraceFee',
      
    }
  )
  async function d() {
        const fee = await getEntraceFee()
        setFee(fee.toString())
  }
  
  async function e() {
    await enableWeb3()
  }
  
  useEffect( () => {
    if (isWeb3Enabled) {

      
      d()
    } else {
      e()
    }
    
  },[isWeb3Enabled])

  return (
    <div className="container m-4">
      <h1 className=" display-4 text-start">Enter Lottery</h1>
      <p className="display-6">Entrace Fee: { }</p>
    </div>
  )
}
