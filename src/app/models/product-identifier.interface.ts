import { IProductIdentifierType } from './product-identifier.enum';

export interface IProductIdentifier {
    type: IProductIdentifierType;
    identifier: string;
}
