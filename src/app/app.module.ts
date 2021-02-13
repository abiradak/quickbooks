import { OverlayModule } from '@angular/cdk/overlay';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';

import { AuthModule } from './modules/auth/auth.module';
import { MediaModule } from './modules/media/media.module';
import { AppRoutingModule } from './app-routing.module';

import { environment } from 'src/environments/environment';
import { AppComponent } from './app.component';
import { CartComponent } from './cart/cart.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { ProductlistComponent } from './productlist/productlist.component';
import { SalesComponent } from './sales/sales.component';
import { HttpRequestInterceptor } from './interceptors/http-request-interceptor';
import { AppEffects } from './state/app.effects';
import { reducer } from './state/app.reducer';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { ThankyouComponent } from './thankyou/thankyou.component';
import { WaitingComponent } from './waiting/waiting.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MyAccountComponent,
    HeaderComponent,
    OrderHistoryComponent,
    CartComponent,
    SalesComponent,
    ProductlistComponent,
    OrderListComponent,
    OrderDetailsComponent,
    ThankyouComponent,
    WaitingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AuthModule.forRoot({
      AUTH_URL: environment.AUTH_URL,
    }),
    MediaModule,
    NgxSpinnerModule,
    OverlayModule,
    NgxPaginationModule,
    MatProgressSpinnerModule,
    ModalModule.forRoot(),
    ToastrModule.forRoot(),
    BsDropdownModule.forRoot(),
    StoreModule.forRoot({app: reducer}),
    EffectsModule.forRoot([AppEffects]),
    StoreDevtoolsModule.instrument({
      name: 'Customer portal',
      maxAge: 25,
      logOnly: environment.production,
    }),
  ],
  providers: [
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
