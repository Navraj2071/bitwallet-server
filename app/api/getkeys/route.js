import { NextResponse } from "next/server";
const bs58 = require("bs58");
import { parseSeedPhrase, generateSeedPhrase } from "near-seed-phrase";

export async function GET() {
  const getAccountId = (publicKey) => {
    const bytes = bs58.decode(publicKey);
    return Buffer.from(bytes).toString("hex");
  };

  const keys = generateSeedPhrase();
  let publicKey = getAccountId(keys.publicKey.slice(8));
  keys.publicKey = publicKey;
  const response = NextResponse.json({ keys });
  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  return response;
}

export const dynamic = "force-dynamic";
