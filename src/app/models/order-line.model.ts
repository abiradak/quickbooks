import { Product } from './product.model';

export class OrderLine {
    productId: string;
    product?: Product;
    quantity: number;
    id: string;
    status?: string;
    priceAtSubmission: number;
}
