import React from 'react'
import { useWallet } from 'use-wallet'
import { SharePools as Pools } from '../../constants/sharePool'
import { Y3D_ADDRESS } from '../../constants/tokenAddresses'
import Context from './context'
import { SharePool, StakingTokenAddress } from './types'

const SharePools: React.FC = ({ children }) => {
  const { chainId } = useWallet()
  const filtered = Pools.filter(pool => pool.poolAddresses[chainId])
  const sharePools: Array<SharePool> = filtered.map((sharePool, index) => {
    const stakings: Array<StakingTokenAddress> = sharePool.stakingTokenAddresses.map(staking => {
      const stake: StakingTokenAddress = {
        address: staking[chainId],
        ...staking
      }
      return stake
    })
    const pool: SharePool = {
      id: `share-pool-${index}`,
      pid: index,
      name: sharePool.name,
      icon: sharePool.icon,
      earnToken: 'y3d',
      earnTokenAddress: Y3D_ADDRESS[chainId],
      poolAddress: sharePool.poolAddresses[chainId],
      stakingTokenAddresses: [...stakings]
    }
    return pool
  })
  console.log('SharePoolsContexts::sharePools:', sharePools)

  return (
    <Context.Provider
      value={{ sharePools }}
    >
      {children}
    </Context.Provider>
  )
}

export default SharePools
