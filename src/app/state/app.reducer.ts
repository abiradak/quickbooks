import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Category } from '../models/category.model';
import { Order } from '../models/order.model';
import { Product } from '../models/product.model';
import { Account } from '../models/account.model';
import { AppActions, AppActionTypes } from './app.actions';

export interface AppState {
    loading: boolean;
    accountLoading: boolean;
    products: Product[];
    categories: Category[];
    char: any[];
    orders: Order[];
    account: Account;
    error: any;
    accountError: any;
    order: Order;
}

const initialState: AppState = {
    loading: false,
    accountLoading: false,
    products: [],
    categories: [],
    char: [],
    orders: [],
    account: null,
    error: null,
    accountError: null,
    order: null,
};

const getAppState = createFeatureSelector<AppState>('app');

export const getProducts = createSelector(
    getAppState,
    state => state.products
);

export const getCategories = createSelector(
    getAppState,
    state => state.categories
);

export const sendProducts = createSelector(
    getAppState,
    state => state.order
);

export const getOrder = createSelector(
    getAppState,
    state => state.order
);

export const getAllOrders = createSelector(
    getAppState,
    state => state.orders
);

export const getAccount = createSelector(
    getAppState,
    state => state.account
);

export const getError = createSelector(
    getAppState,
    state => state.error
);

export const loading = createSelector(
    getAppState,
    state => state.loading
);

export const accountLoading = createSelector(
    getAppState,
    state => state.accountLoading
);

export const getAccountError = createSelector(
    getAppState,
    state => state.accountError
);

export function reducer(state = initialState, action: AppActions): AppState {
    switch (action.type) {
        case AppActionTypes.LoadProducts:
            return {
                ...state,
                error: null,
                loading: true
            };

        case AppActionTypes.LoadProductsSuccess:
            return {
                ...state,
                products: action.products,
                error: null,
                loading: false
            };

        case AppActionTypes.LoadCategories:
            return {
                ...state,
                error: null,
                loading: true
            };

        case AppActionTypes.LoadCategoriesSuccess:
            return {
                ...state,
                categories: action.categories,
            };

        case AppActionTypes.LoadCategoriesFailure:
            return {
                ...state,
                error: action.error,
                loading: false,
            };

        case AppActionTypes.LoadProductsFailure:
            return {
                ...state,
                error: action.error,
                loading: false,
            };

        case AppActionTypes.UpdateOrderSuccess:
            const otherOrders = action.order && state.orders.filter(order => order.id !== action.order.id) || [];
            return {
                ...state,
                order: action.order.status === 'pending' ? action.order : null,
                orders: [...otherOrders, action.order]
            };

        case AppActionTypes.LoadOrdersSuccess:
            const pendingorder = action.orders && action.orders.filter(order => order.status === 'pending' && order.id) || [];
            return {
                ...state,
                orders: action.orders || [],
                order: pendingorder.length ? pendingorder[0] : null
            };

        case AppActionTypes.LoadOrdersFailure:
            return {
                ...state,
                error: action.error
            };

        case AppActionTypes.UpdateOrder:
            return {
                ...state,
                order: action.order.status === 'pending' ? action.order : null,
                loading: true
            };

        case AppActionTypes.LoadAccount:
            return {
                ...state,
                accountError: null,
                accountLoading: true
            };

        case AppActionTypes.LoadAccountSuccess:
            return {
                ...state,
                account: action.account,
                accountLoading: false,
                accountError: null
            };

        case AppActionTypes.LoadAccountFailure:
            return {
                ...state,
                accountError: action.error,
                accountLoading: false,
            };

        case AppActionTypes.CreateAccountSuccess:
            return {
                ...state,
                account: action.account,
            };

        case AppActionTypes.CreateAccountFailure:
            return {
                ...state,
                error: action.error,
            };

        case AppActionTypes.UpdateAccountFailure:
            return {
                ...state,
                error: action.error,
                loading: false,
            };

        case AppActionTypes.UpdateAccountSuccess:
            return {
                ...state,
                account: action.account,
            };

        case AppActionTypes.UpdateAccountFailure:
            return {
                ...state,
                error: action.error,
                loading: false,
            };

        default:
            return state;
    }
}
