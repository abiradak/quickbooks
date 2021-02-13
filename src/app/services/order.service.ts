import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { environment } from '../../environments/environment';
import { Order } from '../models/order.model';
import { AppState } from '../state/app.reducer';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient, private store: Store<AppState>) { }


  updateOrder = (payload: Order) => {
    const httpOptions = {
      headers: new HttpHeaders({
        accept: 'aplication/json'
      })
    };
    if (!payload.id) {
      return this.http.post(`${environment.BASE_API_ENDPOINT}/order/${environment.orgId}/order`, payload, httpOptions);
    } else {
      return this.http.put(`${environment.BASE_API_ENDPOINT}/order/${environment.orgId}/order/${payload.id}`, payload, httpOptions);
    }
  }

  getOrders = (orgId, accountId) => {
    const httpOptions = {
      headers: new HttpHeaders({
        accept: 'aplication/json'
      })
    };
    return this.http.get(`${environment.BASE_API_ENDPOINT}/order/${orgId}/order/account/${accountId}`, httpOptions);
    // return this.http.get('./assets/sample_products.json');
  }
}
