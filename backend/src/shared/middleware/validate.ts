import { ZodType } from 'zod';
import { Request, Response, NextFunction } from 'express';

type RequestPart = 'body' | 'params' | 'query';

export function validate<T extends ZodType>(schema: T, source: RequestPart = 'body') {
    return (req: Request, res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req[source]);

        if (!result.success) {
            res.status(400).json({
                message: 'Dados inválidos',
                errors: result.error.flatten().fieldErrors,
            });
            return;
        }

        const target = req[source] as Record<string, unknown>;
        Object.keys(target).forEach((key) => delete target[key]);
        Object.assign(target, result.data);

        next();
    };
}
