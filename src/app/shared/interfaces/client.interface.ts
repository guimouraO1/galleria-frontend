export interface Client {
    id: number;
    name: string;
    cpf: string;
    phone: string;
    createdAt?: string;
}

export interface CreateClientRequest {
    name: string;
    cpf: string;
    phone: string;
}

export interface UpdateClientRequest {
    name: string;
    phone: string;
}
