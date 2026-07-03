export interface Pessoa{
    id?: number;
    nome: string;
    cpf: string;
    email: string;
    tipo: 'CLIENTE' | 'MEDICO' | 'ATENDENTE';
}