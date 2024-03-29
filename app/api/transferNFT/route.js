import { NextResponse } from 'next/server'
const nearAPI = require('near-api-js')
const BN = require('bn.js');

const { connect } = nearAPI

export async function POST(request) {
  const data = await request.json()

  const tokenId = data.tokenId
  const ownerId = data.ownerId
  const contractId = data.contractId
  const recipient = data.recipient
  const networkType = data.networkType
  const privateKey = data.privateKey.slice(8)


  // const tokenId = "8" 
  // const ownerId = "b4090c6b024c377897bc04c11fe29961d58edc4d287be8fcd45e7b14738e72b5" 
  // const contractId = "vickyx.testnet"
  // const recipient = "a658422f81304f3ce227150a754cebd714c8a2c079a0b5f59b65e31b092ea938"
  // const networkType = "testnet" 
  // const privateKey = "ed25519:ddmVFbMFF5xSvbbbgex83ZvtK1qqZhP9rBrPPLCyw7Xt71gCNyWH5K923pe9TotcFqM2pXswNmjjtDQCQQscMtY"

  const keyPair = nearAPI.utils.KeyPair.fromString(privateKey)
  const keyStore = new nearAPI.keyStores.InMemoryKeyStore()
  keyStore.setKey(networkType, ownerId, keyPair)

  const connectionConfig = {
    keyStore, // instance of InMemoryKeyStore
    networkId: networkType,
    nodeUrl: `https://rpc.${networkType}.near.org`,
    walletUrl: `https://wallet.${networkType}.near.org`,
    helperUrl: `https://helper.${networkType}.near.org`,
    explorerUrl: `https://explorer.${networkType}.near.org`,
  }

  const nearConnection = await connect(connectionConfig)
  const account = await nearConnection.account(ownerId)

  //Interacting with contract
  const contract = new nearAPI.Contract(account, contractId, {
    viewMethods: [], // view methods do not change state but usually return a value
    changeMethods: ['nft_transfer'], // change methods modify state
  })

  try {
    const res = await contract.nft_transfer(
      {
        receiver_id: recipient,
        token_id: tokenId,
      },
      30_000_000_000_000, // attached GAS (optional)
      new BN('1')
    )
    // return {status: true, data: res};
    console.log(res)
    return NextResponse.json({ txRespone: JSON.stringify(res) })
  } catch (error) {
    console.log(`Error occured while transferring NFT:${error}`)
    return NextResponse.json({ txRespone: JSON.stringify(error) })
  }
}
