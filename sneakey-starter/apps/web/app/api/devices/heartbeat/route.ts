import { NextRequest, NextResponse } from "next/server";
import { verifyDeviceToken } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { getPolicyForDevice } from "@/src/lib/policies";

export async function POST(req: NextRequest){
  const auth = req.headers.get("authorization");
  if(!auth) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const token = auth.replace("Bearer ", "");
  const payload = verifyDeviceToken(token);
  if(!payload) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { version, metrics } = await req.json();
  await prisma.device.update({ where:{ id: payload.did }, data:{ lastSeenAt: new Date(), version: version ?? null } });
  const policy = await getPolicyForDevice(payload.did);
  return NextResponse.json({ policy, pause: false });
}