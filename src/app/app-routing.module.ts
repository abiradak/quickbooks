import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './cart/cart.component';
import { HeaderComponent } from './header/header.component';
import { AuthGuard } from './modules/auth/guards/auth.guard';
import { MyAccountComponent } from './my-account/my-account.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { OrderListComponent } from './order-list/order-list.component';
import { ProductlistComponent } from './productlist/productlist.component';
import { ThankyouComponent } from './thankyou/thankyou.component';
import { WaitingComponent } from './waiting/waiting.component';


const routes: Routes = [
  {
    path: '',
    component: HeaderComponent,
    children: [
      { path: '', redirectTo: '/product-list', pathMatch: 'full' },
      {
        path: 'cart',
        component: CartComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'my-account',
        component: MyAccountComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'product-list',
        component: ProductlistComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'product-list/:categoryId',
        component: ProductlistComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'order-history',
        component: OrderListComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'orders/:orderId',
        component: OrderDetailsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'thankyou',
        component: ThankyouComponent,
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: 'waiting',
    component: WaitingComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
