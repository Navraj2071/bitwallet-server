import { NextResponse } from "next/server";
const nearAPI = require("near-api-js");

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
  async function getAccountBalance(accountPublicKey, accountPrivateKey) {
    const nearConfig = {
      networkId: "testnet", // Replace with 'mainnet' for the main network
      nodeUrl: "https://rpc.testnet.near.org", // Replace with the URL of the NEAR node
    };

    const keyPair = near.KeyPair.fromString(accountPrivateKey);
    const nearConnection = new near.Connection(nearConfig.nodeUrl, keyPair);
    const account = new near.Account(nearConnection, accountPublicKey);

    try {
      const state = await account.state();
      console.log("state: ", state);
      const balance = state.amount;
      return balance;
    } catch (e) {
      console.log(e);
      return 0;
    }
  }

  const data = await request.json();
  //   const balance = await getAccountBalance(data.accountId, data.privateKey);
  //   const balance = await fetchBalance(
  //     data.accountId.slice(8),
  //     // "balleballe.testnet",
  //     data.networkType,
  //     data.privateKey.slice(8)
  //   );
  //   console.log(balance);
  let name = nearAPI.utils.PublicKey.from(data.accountId).toString();
  console.log(name);

  return NextResponse.json({ status: "API is working" });
}
