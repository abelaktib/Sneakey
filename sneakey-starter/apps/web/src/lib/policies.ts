import { prisma } from "./prisma";
export async function getPolicyForDevice(deviceId: string){
  const device = await prisma.device.findUnique({ where:{ id: deviceId }, include:{ org:true } });
  if(!device) return null;
  const policy = await prisma.policy.findFirst({ where:{ orgId: device.orgId }, orderBy:{ createdAt: "desc" } });
  return policy ? {
    interval_min: policy.intervalMin,
    interval_max: policy.intervalMax,
    pixel_min: policy.pixelMin,
    pixel_max: policy.pixelMax
  } : { interval_min: 60, interval_max: 120, pixel_min: 1, pixel_max: 2 };
}