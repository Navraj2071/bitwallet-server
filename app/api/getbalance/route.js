import { NextResponse } from "next/server";
const nearAPI = require("near-api-js");
const bs58 = require("bs58");

export const fetchBalance = async (accountId, networkType, privateKey) => {
  const connection = await nearConnection(accountId, networkType, privateKey);
  try {
    // gets account balance
    const account = await connection.account(accountId);
    const balance = (
      (await account.getAccountBalance()).available /
      10 ** 24
    ).toFixed(4);
    console.log(balance);
    return balance;
  } catch (error) {
    console.log(`Error occured:${error}`);
    return 0;
  }
};

const nearConnection = async (accountId, networkType, privateKey) => {
  const keyPair = nearAPI.utils.KeyPair.fromString(privateKey);

  const keyStore = new nearAPI.keyStores.InMemoryKeyStore();
  keyStore.setKey(networkType, accountId, keyPair);
  const config = {
    keyStore, // instance of InMemoryKeyStore
    networkId: networkType,
    nodeUrl: `https://rpc.${networkType}.near.org`,
    walletUrl: `https://wallet.${networkType}.near.org`,
    helperUrl: `https://helper.${networkType}.near.org`,
    explorerUrl: `https://explorer.${networkType}.near.org`,
  };

  // inside an async function
  const nearConnection = await nearAPI.connect(config);
  return nearConnection;
};

export async function POST(request) {
  const data = await request.json();

  const balance = await fetchBalance(
    data.accountId,
    data.networkType,
    data.privateKey.slice(8)
  );

  return NextResponse.json({ balance: balance });
}
