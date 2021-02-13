import { Action } from '@ngrx/store';
import { Category } from '../models/category.model';
import { Product } from '../models/product.model';
import { Order } from '../models/order.model';
import { Account } from '../models/account.model';

export enum AppActionTypes {
    LoadProducts = '[App LoadProducts]',
    LoadProductsSuccess = '[App LoadProductsSuccess]',
    LoadProductsFailure = '[App LoadProductsFailure]',
    LoadCategories = '[App LoadCategories]',
    LoadCategoriesSuccess = '[App LoadCategoriesSuccess]',
    LoadCategoriesFailure = '[App LoadCategoriesFailure]',
    CreateCharSuperSet = '[App CreateCharSuperSet]',
    RemoveFromCart = '[App RemoveFromCart]',
    UpdateOrder = '[App UpdateOrder]',
    UpdateOrderSuccess = '[App UpdateOrderSuccess]',
    UpdateOrderFailure = '[App UpdateOrderFailure]',
    LoadOrders = '[App LoadOrders]',
    LoadOrdersSuccess = '[App LoadOrdersSuccess]',
    LoadOrdersFailure = '[App LoadOrdersFailure]',
    LoadMedia = '[App LoadMedia]',
    LoadMediaSuccess = '[App LoadMediaSuccess]',
    LoadAccount = '[App LoadAccount]',
    LoadAccountSuccess = '[App LoadAccountSuccess]',
    LoadAccountFailure = '[App LoadAccountFailure]',
    CreateAccount = '[App CreateAccount]',
    CreateAccountSuccess = '[App CreateAccountSuccess]',
    CreateAccountFailure = '[App CreateAccountFailure]',
    UpdateAccount = '[App UpdateAccout]',
    UpdateAccountSuccess = '[App UpdateAccoutSuccess]',
    UpdateAccountFailure = '[App UpdateAccountFailure]',
    NoOp = '[Orgs] NoOp',
}

export class LoadProducts implements Action {
    readonly type = AppActionTypes.LoadProducts;
    constructor(public orgId: string) { }
}

export class LoadProductsSuccess implements Action {
    readonly type = AppActionTypes.LoadProductsSuccess;
    public constructor(public products: Product[]) { }
}


export class LoadProductsFailure implements Action {
    readonly type = AppActionTypes.LoadProductsFailure;
    constructor(public error: string) { }
}

export class LoadCategories implements Action {
    readonly type = AppActionTypes.LoadCategories;
    constructor(public orgId: string) { }
}

export class LoadCategoriesSuccess implements Action {
    readonly type = AppActionTypes.LoadCategoriesSuccess;
    public constructor(public categories: Category[]) { }
}

export class LoadCategoriesFailure implements Action {
    readonly type = AppActionTypes.LoadCategoriesFailure;
    constructor(public error: string) { }
}

// export class CreateCharSuperSet implements Action {
//     readonly type = AppActionTypes.CreateCharSuperSet;
//     public constructor(public products: Product[]) { }
// }

export class UpdateOrder implements Action {
    readonly type = AppActionTypes.UpdateOrder;
    constructor(public orgId: string , public order: Order) { }
}

export class UpdateOrderSuccess implements Action {
    readonly type = AppActionTypes.UpdateOrderSuccess;
    public constructor(public order: Order) { }
}


export class UpdateOrderFailure implements Action {
    readonly type = AppActionTypes.UpdateOrderFailure;
    constructor(public error: string) { }
}

export class LoadOrders implements Action {
    readonly type = AppActionTypes.LoadOrders;
    constructor(public orgId: string, public accountId: string) { }
}

export class LoadOrdersSuccess implements Action {
    readonly type = AppActionTypes.LoadOrdersSuccess;
    public constructor(public orders: Order[]) { }
}

export class LoadOrdersFailure implements Action {
    readonly type = AppActionTypes.LoadOrdersFailure;
    constructor(public error: string) { }
}


export class LoadAccount implements Action {
    readonly type = AppActionTypes.LoadAccount;
    constructor(public orgId: string, public accountId: string) { }
}

export class LoadAccountSuccess implements Action {
    readonly type = AppActionTypes.LoadAccountSuccess;
    public constructor(public account: Account) { }
}

export class LoadAccountFailure implements Action {
    readonly type = AppActionTypes.LoadAccountFailure;
    constructor(public error: string) { }
}

export class CreateAccount implements Action {
    readonly type = AppActionTypes.CreateAccount;
    constructor(public account: Account) { }
}

export class CreateAccountSuccess implements Action {
    readonly type = AppActionTypes.CreateAccountSuccess;
    public constructor(public account: Account) { }
}

export class CreateAccountFailure implements Action {
    readonly type = AppActionTypes.CreateAccountFailure;
    constructor(public error: string) { }
}

export class UpdateAccount implements Action {
    readonly type = AppActionTypes.UpdateAccount;
    constructor(public account: Account) { }
}

export class UpdateAccountSuccess implements Action {
    readonly type = AppActionTypes.UpdateAccountSuccess;
    public constructor(public account: Account) { }
}

export class UpdateAccountFailure implements Action {
    readonly type = AppActionTypes.UpdateAccountFailure;
    constructor(public error: string) { }
}

export class NoOp implements Action {
    readonly type = AppActionTypes.NoOp;
}


export type AppActions = LoadProducts |
    LoadProductsSuccess |
    LoadCategories |
    LoadCategoriesSuccess |
    LoadCategoriesFailure |
    LoadProductsFailure |
    UpdateOrder |
    UpdateOrderSuccess |
    UpdateOrderFailure |
    LoadOrders |
    LoadOrdersFailure |
    LoadOrdersSuccess |
    LoadAccount |
    LoadAccountSuccess |
    LoadAccountFailure |
    UpdateAccount |
    UpdateAccountSuccess |
    UpdateAccountFailure |
    CreateAccount |
    CreateAccountSuccess |
    CreateAccountFailure |
    NoOp;
