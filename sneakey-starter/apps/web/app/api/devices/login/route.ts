import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest){
  const { orgKey, deviceName, platform } = await req.json();
  const org = await prisma.organization.findFirst({ where: { id: orgKey } });
  if(!org) return NextResponse.json({ error: "invalid_org" }, { status: 400 });
  const device = await prisma.device.create({ data: { orgId: org.id, name: deviceName ?? "Sneakey Device", platform: platform ?? "unknown", tokenHash: "tofill" } });
  const token = jwt.sign({ did: device.id, oid: org.id }, process.env.DEVICE_JWT_SECRET!, { expiresIn: "7d" });
  return NextResponse.json({ deviceTokenJWT: token });
}