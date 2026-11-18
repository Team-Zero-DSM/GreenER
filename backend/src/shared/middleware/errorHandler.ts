
import type { Request, Response, NextFunction } from 'express';
import { DatabaseError } from 'pg';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError.js';

export function errorHandler(
    err: unknown,
    _req: Request,
    res: Response,
    next: NextFunction,
): void {
    if (res.headersSent) {
        next(err);
        return;
    }

    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            error: { message: err.message },
        });
        return;
    }

    if (
        err instanceof SyntaxError &&
        'type' in err &&
        err.type === 'entity.parse.failed'
    ) {
        res.status(400).json({
            error: {
                message: 'Dados inválidos',
                details: [
                    {
                        field: 'body',
                        message: 'O body deve conter um objeto JSON válido',
                    },
                ],
            },
        });
        return;
    }

    if (err instanceof ZodError) {
        const hasInvalidEmail = err.issues.some(
            (issue) =>
                issue.path[0] === 'email' &&
                issue.code === 'invalid_format',
        );

        res.status(400).json({
            error: {
                message: hasInvalidEmail
                    ? 'E-mail inválido. Confira se o endereço está completo (ex.: nome@dominio.com).'
                    : 'Dados inválidos',
                details: err.issues.map((issue) => ({
                    field: issue.path.join('.'),
                    message: issue.message,
                })),
            },
        });
        return;
    }

    if (err instanceof DatabaseError) {
        if (err.code === '23505') {
            const emailConstraints = [
                'usuario_email_key',
                'ux_usuario_email_lower',
            ];

            const isDuplicateEmail = emailConstraints.includes(
                err.constraint ?? '',
            );

            res.status(409).json({
                error: {
                    message: isDuplicateEmail
                        ? 'Este e-mail já está cadastrado. Utilize outro endereço.'
                        : 'Registro duplicado',
                },
            });
            return;
        }

        if (err.code === '23503') {
            res.status(409).json({
                error: {
                    message: 'A operação conflita com registros relacionados',
                },
            });
            return;
        }
    }

    console.error(err);

    res.status(500).json({
        error: { message: 'Erro interno do servidor' },
    });
}
