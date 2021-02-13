import { OrderLine } from './order-line.model';

export class Order {
    orgId: string;
    date?: Date;
    status: string;
    accountId: string;
    items: OrderLine[];
    amount?: number;
    id?: string;
}
