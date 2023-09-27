import { NextResponse } from "next/server";
import { parseSeedPhrase, generateSeedPhrase } from "near-seed-phrase";

export async function GET() {
  const keys = generateSeedPhrase();

  return NextResponse.json({ keys });
}
