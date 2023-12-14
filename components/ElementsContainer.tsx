import { LiquidityModal } from '@leapwallet/elements'
import { useChain } from "@cosmos-kit/react"
import '@leapwallet/elements/styles.css'
import { useElementsWalletClient } from '../config/walletclient'

const renderLiquidityButton = ({ onClick }: any) => {
  return (
    <button onClick={onClick}>
      <span>💳</span>
      <span>Buy Now</span>
    </button>
  )
}

export function ElementsContainer(){
  const {address} = useChain('stargaze')
  const walletClient = useElementsWalletClient()
  return (
    <div>
      <LiquidityModal
        renderLiquidityButton={renderLiquidityButton}
        theme='light'
        walletClientConfig={{
          userAddress: address,
          walletClient: walletClient,
          connectWallet: async (chainId?: string) => {
            console.log('logging chain id', chainId)
            
          }
        }}
        config={{
          icon: 'https://assets.leapwallet.io/stars.png',
          title: 'Buy Bad Kid #44',
          subtitle: 'Price: 42K STARS'
        }}
      />
    </div>
  )
}