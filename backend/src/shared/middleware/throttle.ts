import type { RequestHandler } from 'express';
import { AppError } from '../errors/AppError.js';

export function throttle(limit: number): RequestHandler {
    const attempts = new Map<string, number>();
    const interval = 15 * 60_000;
    let expiresAt = Date.now() + interval;

    return (req, _res, next) => {
        const now = Date.now();

        if (now >= expiresAt) {
            attempts.clear();
            expiresAt = now + interval;
        }

        const ip = req.ip ?? 'unknown';
        const count = attempts.get(ip) ?? 0;

        const limitReached = count >= limit;
        const tooManyIps = !attempts.has(ip) && attempts.size >= 10_000;

        if (limitReached || tooManyIps) {
            throw new AppError('Muitas tentativas. Aguarde alguns minutos.', 429);
        }

        attempts.set(ip, count + 1);
        next();
    };
}
