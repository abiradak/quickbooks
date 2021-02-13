
import { Category } from './category.model';
import { IProductIdentifier } from './product-identifier.interface';
import { ProductType } from './product-type.enum';
import { ISalesUnit } from './sales-unit.interface';
import { ProductCharacteristic } from './product-characteristic.model';

export class Product {
    id?: string;
    name?: string;
    description?: string;
    categories: Category[];
    price?: number;
    image?: string;
    orgId?: string;
    characteristics?: ProductCharacteristic[];
    currency?: null;
    alesUnit?: null;
    priceoverrides?: any[];
    identifiers?: IProductIdentifier[];
    discriminatingCharacteristics?: string [];
    salesUnit?: ISalesUnit;
    type: ProductType;
    variants?: Product[];
    parent?: Product;
    // tslint:disable-next-line:variable-name
    __categories__ ?: Category[];
}
