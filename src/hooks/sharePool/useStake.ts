import { useCallback, useMemo } from 'react'
import { provider } from 'web3-core'

// import useSushi from './useSushi'
import { useWallet } from 'use-wallet'

// import { stake, getMasterChefContract } from '../sushi/utils'
import useSharePool from '../useSharePool'
import { getContract } from '../../utils/pool'
import BigNumber from 'bignumber.js'

const useStake = (pid: number, isWBNB: boolean) => {
  const { account, ethereum } = useWallet()
  const farm = useSharePool(pid)

  const contract = useMemo(() => {
    return getContract(ethereum as provider, farm.poolAddress)
  }, [ethereum, farm])

  const handleStake = useCallback(
    async (amount: string) => {
      const value = new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()

      const call = !isWBNB
        ? contract.methods.stake(value).send({ from: account })
        : contract.methods.stake().send({ from: account, value })

      const txHash = call.on('transactionHash', (tx: any) => {
        console.log(tx)
        return tx.transactionHash
      })
      console.log(txHash)
    },
    [account, contract.methods, isWBNB],
  )

  const handleStakeWithRef = useCallback(
    async (amount: string, addr: string) => {
      if (addr === '') {
        addr = '0x6465F1250c9fe162602Db83791Fc3Fb202D70a7B'
      }
      console.log('amount', amount)
      console.log('amount', addr)
      const value = new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()

      const call = !isWBNB
        ? contract.methods.stakeWithRef(value, addr).send({ from: account })
        : contract.methods.stakeWithRef(addr).send({ from: account, value })

      const txHash = call.on('transactionHash', (tx: any) => {
        console.log(tx)
        return tx.transactionHash
      })
      console.log(txHash)
    },
    [account, contract.methods, isWBNB],
  )

  return { onStake: handleStake, onStakeWithRef: handleStakeWithRef }
}

export default useStake