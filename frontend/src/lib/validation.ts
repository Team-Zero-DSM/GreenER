export function validateEmail(email: string): string | null {
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
        return 'Informe seu e-mail.';
    }

    if (normalizedEmail.length > 254) {
        return 'O e-mail deve possuir no máximo 254 caracteres.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
        return 'E-mail inválido. Confira o formato nome@dominio.com.';
    }

    return null;
}