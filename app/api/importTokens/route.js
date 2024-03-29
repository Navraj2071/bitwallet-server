import { NextResponse } from 'next/server'
const nearAPI = require('near-api-js')
const bs58 = require('bs58')

export async function POST(request) {
  const fetchAccountNFT = async (
    accountId,
    networkType,
    privateKey,
    contractId,
    tokenId
  ) => {
    //near connection
    const connection = await nearConnection(accountId, networkType, privateKey)
    const account = await connection.account(accountId)
    //Interacting with contract
    const contract = new nearAPI.Contract(
      account, // the account object that is connecting
      contractId,
      {
        // name of contract you're connecting to
        viewMethods: ['get_nft_token'], // view methods do not change state but usually return a value
        changeMethods: [], // change methods modify state
      }
    )

    const res = await contract.get_nft_token({
      token_id: tokenId, // argument name and value - pass empty object if no args required
    })
    return res
  }

  const nearConnection = async (accountId, networkType, privateKey) => {
    const keyPair = nearAPI.utils.KeyPair.fromString(privateKey)

    const keyStore = new nearAPI.keyStores.InMemoryKeyStore()
    keyStore.setKey(networkType, accountId, keyPair)
    const config = {
      keyStore, // instance of InMemoryKeyStore
      networkId: networkType,
      nodeUrl: `https://rpc.${networkType}.near.org`,
      walletUrl: `https://wallet.${networkType}.near.org`,
      helperUrl: `https://helper.${networkType}.near.org`,
      explorerUrl: `https://explorer.${networkType}.near.org`,
    }

    // inside an async function
    const nearConnection = await nearAPI.connect(config)
    return nearConnection
  }

  const data = await request.json()
  const tokens = await fetchAccountNFT(
    data.accountId,
    data.networkType,
    data.privateKey.slice(8),
    data.contractId,
    data.tokenId
  )
  return NextResponse.json({ tokens: tokens })
}
