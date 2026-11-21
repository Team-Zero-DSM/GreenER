// Senhas muito usadas que aparecem nas primeiras tentativas de qualquer ataque.
// A comparação ignora maiúsculas e espaços nas pontas.
const commonPasswords = new Set([
    '12345678',
    '123456789',
    '1234567890',
    '87654321',
    '11111111',
    '00000000',
    '12341234',
    '11223344',
    '123123123',
    'password',
    'password1',
    'password123',
    'senha123',
    'senha1234',
    'senhasenha',
    'qwerty123',
    'qwertyui',
    'abcd1234',
    'abc12345',
    'abcdefgh',
    'iloveyou',
    '1q2w3e4r',
    '1qaz2wsx',
    'admin123',
    'administrador',
    'mudar123',
    'brasil123',
    'asdfghjk',
    'zaq12wsx',
]);

export function isCommonPassword(password: string): boolean {
    return commonPasswords.has(password.trim().toLowerCase());
}
