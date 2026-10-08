export interface RateLimitResult {
  allowed: boolean;
  retryAfter: number;
}
export interface RateLimiter {
  consume(key: string): Promise<RateLimitResult>;
}
