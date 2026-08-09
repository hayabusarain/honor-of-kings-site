const requestCounts = new Map<string, { count: number; timestamp: number }>();

export function checkRateLimit(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const requestInfo = requestCounts.get(ip);

  if (!requestInfo || (now - requestInfo.timestamp) > windowMs) {
    requestCounts.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (requestInfo.count >= limit) {
    return false;
  }

  requestInfo.count++;
  return true;
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return 'any';
}

export function validateAdminPassword(request: Request): boolean {
  const adminPassword = request.headers.get('x-admin-password');
  return adminPassword === process.env.ADMIN_PASSWORD;
}
