import { NextResponse } from "next/server";
const bs58 = require("bs58");
import { parseSeedPhrase, generateSeedPhrase } from "near-seed-phrase";

export async function POST(request) {
  const getAccountId = (publicKey) => {
    const bytes = bs58.decode(publicKey);
    return Buffer.from(bytes).toString("hex");
  };

  const data = await request.json();
  const seedPhrase = data.seedPhrase;
  console.log(seedPhrase);

  const keys = parseSeedPhrase(seedPhrase);
  console.log(keys);

  let publicKey = getAccountId(keys.publicKey.slice(8));
  keys.publicKey = publicKey;

  return NextResponse.json({ keys });
}
