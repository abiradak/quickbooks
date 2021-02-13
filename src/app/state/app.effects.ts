import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Category } from '../models/category.model';
import { Order } from '../models/order.model';
import { Product } from '../models/product.model';
import { UserActionTypes, UserLoggedIn } from '../modules/auth/state/user.actions';
import { OrderService } from '../services/order.service';
import { ProductService } from '../services/product.service';
import { AccountService } from '../services/account.service';
import {
    AppActionTypes, CreateAccount, CreateAccountFailure, CreateAccountSuccess, LoadAccount, LoadAccountFailure, LoadAccountSuccess, LoadCategories, LoadCategoriesFailure,
    LoadCategoriesSuccess, LoadOrders, LoadOrdersFailure, LoadOrdersSuccess, LoadProducts, LoadProductsFailure,
    LoadProductsSuccess, NoOp, UpdateAccount, UpdateAccountFailure, UpdateAccountSuccess, UpdateOrder, UpdateOrderSuccess
} from './app.actions';
import { AppState } from './app.reducer';
import { Account } from '../models/account.model';
import { getCurrentUser, UserState } from '../modules/auth/state/user.reducer';
import { AccountType } from '../models/account-type.enum';
import { NoopAnimationPlayer } from '@angular/animations';

@Injectable()
export class AppEffects {
    name: any[];
    char: any[];
    constructor(
        private actions$: Actions,
        private store$: Store<AppState>,
        private userStore: Store<UserState>,
        private productService: ProductService,
        private orderService: OrderService,
        public accountService: AccountService
    ) { }

    @Effect()
    // tslint:disable-next-line:variable-name
    UserLoggedIn_categories$ = this.actions$.pipe(
        ofType(UserActionTypes.UserLoggedIn),
        map((action: UserLoggedIn) => new LoadCategories(environment.orgId)),
    );

    @Effect()
    // tslint:disable-next-line:variable-name
    UserLoggedIn_products$ = this.actions$.pipe(
        ofType(UserActionTypes.UserLoggedIn),
        map((action: UserLoggedIn) => new LoadProducts(environment.orgId)),
    );

    @Effect()
    // tslint:disable-next-line:variable-name
    UserLoggedIn_LoadOrders$ = this.actions$.pipe(
        ofType(UserActionTypes.UserLoggedIn),
        map((action: UserLoggedIn) => new LoadOrders(environment.orgId, action.user.identity.id)),
    );

    @Effect()
    // tslint:disable-next-line:variable-name
    UserLoggedIn_LoadAccount$ = this.actions$.pipe(
        ofType(UserActionTypes.UserLoggedIn),
        map((action: UserLoggedIn) => new LoadAccount(environment.orgId, action.user.identity.id)),
    );

    @Effect()
    LoadProducts$ = this.actions$.pipe(
        ofType(AppActionTypes.LoadProducts),
        mergeMap((action: LoadProducts) =>
            this.productService.getProducts(action.orgId).pipe(
                tap((product: Product[]) =>
                    console.log(`fetched products : ${JSON.stringify(product)}`),
                ),
                map((product: Product[]) =>
                    new LoadProductsSuccess(product),
                ),
                catchError(err =>
                    of(new LoadProductsFailure(err.message))
                ),
            )
        )
    );

    @Effect()
    LoadCategories$ = this.actions$.pipe(
        ofType(AppActionTypes.LoadCategories),
        mergeMap((action: LoadCategories) =>
            this.productService.getCategories(action.orgId).pipe(
                tap((categories: Category[]) =>
                    console.log(`fetched categories : ${JSON.stringify(categories)}`)
                ),
                map((categories: Category[]) =>
                    new LoadCategoriesSuccess(categories)
                ),
                catchError(err =>
                    of(new LoadCategoriesFailure(err.message))
                )
            )
        )
    );


    @Effect()
    UpdateOrder$ = this.actions$.pipe(
        ofType(AppActionTypes.UpdateOrder),
        mergeMap((action: UpdateOrder) =>
            this.orderService.updateOrder(action.order).pipe(
                tap((order: Order) =>
                    console.log(`updated order : ${JSON.stringify(order)}`)
                ),
                map((order: Order) =>
                    new UpdateOrderSuccess(order)
                )
            )
        )
    );


    @Effect()
    LoadOrders$ = this.actions$.pipe(
        ofType(AppActionTypes.LoadOrders),
        mergeMap((action: LoadOrders) =>
            this.orderService.getOrders(action.orgId, action.accountId).pipe(
                tap((response) =>
                    console.log(`fetched orders : ${JSON.stringify(response)}`)
                ),
                map((orders: Order[]) =>
                    new LoadOrdersSuccess(orders)
                ),
                catchError(err =>
                    of(new LoadOrdersFailure(err.message))
                )
            )
        )
    );

    @Effect()
    LoadAccount$ = this.actions$.pipe(
        ofType(AppActionTypes.LoadAccount),
        mergeMap((action: LoadAccount) =>
            this.accountService.getAccount(action.orgId, action.accountId).pipe(
                tap((response) =>
                    console.log(`fetched account : ${JSON.stringify(response)}`)
                ),
                map((account: Account) =>
                    new LoadAccountSuccess(account)
                ),
                catchError(err =>
                    of(new LoadAccountFailure(err.message))
                )
            )
        )
    );

    @Effect()
    LoadAccountFailure$ = this.actions$.pipe(
        ofType(AppActionTypes.LoadAccountFailure),
        map((action: LoadAccountFailure) => (action)),
        withLatestFrom(this.userStore.select(getCurrentUser)),
        map(([action, user]) => {
            if (action.error.indexOf('404') > -1) {
                const account = new Account();
                account.approved = !environment.approvalRequired;
                account.firstName = user.user.identity.traits.name.first;
                account.lastName = user.user.identity.traits.name.last;
                account.id = user.user.identity.id;
                account.email = user.user.identity.traits.email;
                account.orgId = environment.orgId;
                account.type = AccountType.APP_USER;
                console.log('Creating account ', JSON.stringify(account));
                return new CreateAccount(account);
            } else {
                return new CreateAccountFailure(action.error);
            }
        })
    );

    @Effect()
    CreateAccount$ = this.actions$.pipe(
        ofType(AppActionTypes.CreateAccount),
        mergeMap((action: CreateAccount) =>
            this.accountService.createAccount(action.account).pipe(
                tap((response) =>
                    console.log(`created account : ${JSON.stringify(response)}`)
                ),
                map((account: Account) =>
                    new CreateAccountSuccess(account)
                ),
                catchError(err =>
                    of(new CreateAccountFailure(err.message))
                )
            )
        )
    );

    @Effect()
    UpdateAccount$ = this.actions$.pipe(
        ofType(AppActionTypes.UpdateAccount),
        mergeMap((action: UpdateAccount) =>
            this.accountService.updateAccount(action.account).pipe(
                tap((response) =>
                    console.log(`updated account : ${JSON.stringify(response)}`)
                ),
                map((account: Account) =>
                    new UpdateAccountSuccess(account)
                ),
                catchError(err =>
                    of(new UpdateAccountFailure(err.message))
                )
            )
        )
    );

    createData(products): void {
        products.forEach(element => {
          if (element.characteristics.length > 0) {
            element.characteristics.forEach( item => {
              if (!this.name.includes(item.name)) {
                this.name.push(item.name);
              }
              this.pushObjInArray(item, item.name);
            });
          }
        });
    }

    pushObjInArray(item, name): void {
        const obj = {
          name: item
        };
        if (this.char[name] && this.char[name].length > 0) {
          this.char[name].push(obj);
        } else {
          this.char[name] = [];
          this.char[name].push(obj);
        }
    }
}
