import jwt from "jsonwebtoken";
export function verifyDeviceToken(token: string): { did: string; oid: string } | null {
  try { return jwt.verify(token, process.env.DEVICE_JWT_SECRET!) as any; }
  catch { return null; }
}