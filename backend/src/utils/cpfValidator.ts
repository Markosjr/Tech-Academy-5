export function validateCPF(cpf: string): boolean {
    const cleanCpf = cpf.replace(/\D/g, '');
    if (cleanCpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cleanCpf)) return false;
    return isValidCpfLogic(cleanCpf);
}

function isValidCpfLogic(cpf: string): boolean {
    const digit1 = calculateDigit(cpf, 9, 10);
    const digit2 = calculateDigit(cpf, 10, 11);
    return digit1 === parseInt(cpf[9]) && digit2 === parseInt(cpf[10]);
}

function calculateDigit(cpf: string, maxLen: number, weight: number): number {
    let sum = 0;
    for (let i = 0; i < maxLen; i++) {
        sum += parseInt(cpf[i]) * weight--;
    }
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
}
