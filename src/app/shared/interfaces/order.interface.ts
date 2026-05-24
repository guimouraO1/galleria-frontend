import {Product} from './product.interface';

export interface Order {
    id: number;
    referenceCode: string;
    description: string;
    issuedAt: string;
    clientId: number;
    products?: Product[];
    total: number;
}

export interface CreateOrderRequest {
    description: string;
    clientId: number | null;
    productIds: number[];
    referenceCode: string;
}
