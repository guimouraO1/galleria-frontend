export interface Product {
    id: number;
    description: string;
    value: number;
    createdAt?: string;
}

export interface ProductRequest {
    description: string;
    value: number;
}
