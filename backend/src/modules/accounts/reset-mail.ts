import nodemailer from 'nodemailer';
import { AppError } from '../../shared/errors/AppError.js';

type SendMail = (message: { to: string; subject: string; text: string }) => Promise<void>;

const unavailable = () =>
    new AppError('A recuperação de senha está temporariamente indisponível.', 503);

// Separa "Nome <email@dominio>" em nome e e-mail.
function parseSender(from: string): { name?: string; email: string } {
    const match = /^\s*"?([^"<]*?)"?\s*<([^>]+)>\s*"?\s*$/.exec(from);
    return match
        ? { name: match[1] || undefined, email: match[2] }
        : { email: from.replace(/"/g, '').trim() };
}

// Envio pela API HTTP da Brevo. Usado em hospedagens que bloqueiam SMTP (ex.: Render grátis).
function brevoSender(apiKey: string, from: string): SendMail {
    const sender = parseSender(from);
    return async ({ to, subject, text }) => {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: { 'api-key': apiKey, 'content-type': 'application/json' },
            body: JSON.stringify({ sender, to: [{ email: to }], subject, textContent: text }),
            signal: AbortSignal.timeout(15_000),
        });
        if (!response.ok) {
            throw new Error(`Brevo respondeu ${response.status}: ${await response.text()}`);
        }
    };
}

function smtpSender(from: string): SendMail {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;
    const port = Number(SMTP_PORT ?? '587');
    if (
        !SMTP_HOST ||
        !Number.isInteger(port) ||
        port < 1 ||
        port > 65535 ||
        Boolean(SMTP_USER) !== Boolean(SMTP_PASSWORD)
    ) {
        throw unavailable();
    }
    const secure = port === 465;
    const transport = nodemailer.createTransport({
        host: SMTP_HOST,
        port,
        secure,
        requireTLS: !secure && process.env.NODE_ENV === 'production',
        auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASSWORD } : undefined,
        connectionTimeout: 10_000,
        socketTimeout: 15_000,
    });
    return async (message) => {
        await transport.sendMail({ from, ...message });
    };
}

export function passwordResetMailer() {
    const { SMTP_FROM, APP_PUBLIC_URL, BREVO_API_KEY } = process.env;
    if (!SMTP_FROM || !APP_PUBLIC_URL) throw unavailable();
    const url = new URL('/login', APP_PUBLIC_URL);
    if (!['http:', 'https:'].includes(url.protocol)) throw unavailable();
    const send = BREVO_API_KEY ? brevoSender(BREVO_API_KEY, SMTP_FROM) : smtpSender(SMTP_FROM);

    return async (email: string, token: string) => {
        url.hash = new URLSearchParams({ token }).toString();
        await send({
            to: email,
            subject: 'Redefina sua senha do GreenER',
            text: `Abra o link em até 30 minutos para redefinir sua senha: ${url.href}\n\nSe você não fez o pedido, ignore este e-mail.`,
        });
    };
}
