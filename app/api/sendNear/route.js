import { NextResponse } from "next/server";
const nearAPI = require("near-api-js");

export async function POST(request) {
  const data = await request.json();

  const networkType = data.networkType;

  const { connect, keyStores, WalletConnection } = nearAPI;

  const keyPair = nearAPI.utils.KeyPair.fromString(data.privateKey);
  const keyStore = new nearAPI.keyStores.InMemoryKeyStore();
  keyStore.setKey(networkType, data.accountId, keyPair);

  const connectionConfig = {
    keyStore, // instance of InMemoryKeyStore
    networkId: networkType,
    nodeUrl: `https://rpc.${networkType}.near.org`,
    walletUrl: `https://wallet.${networkType}.near.org`,
    helperUrl: `https://helper.${networkType}.near.org`,
    explorerUrl: `https://explorer.${networkType}.near.org`,
  };

  const nearConnection = await connect(connectionConfig);

  const account = await nearConnection.account(data.accountId);
  const amountInYocto = nearAPI.utils.format.parseNearAmount(data.amount);
  const response = await account.sendMoney(data.address, amountInYocto);

  console.log(response);
  return NextResponse.json({ txRespone: JSON.stringify(response) });
}
