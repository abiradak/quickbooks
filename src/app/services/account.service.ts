import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { environment } from '../../environments/environment';
import { Account } from '../models/account.model';
import { AppState } from '../state/app.reducer';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient, private store: Store<AppState>) { }

  createAccount = (payload: Account) => {
    const httpOptions = {
      headers: new HttpHeaders({
        accept: 'aplication/json'
      })
    };
    return this.http.post(`${environment.BASE_API_ENDPOINT}/account/${environment.orgId}/account`, payload, httpOptions);
  }

  updateAccount = (payload: Account) => {
    const httpOptions = {
      headers: new HttpHeaders({
        accept: 'aplication/json'
      })
    };
    return this.http.put(`${environment.BASE_API_ENDPOINT}/account/${environment.orgId}/account/${payload.id}`, payload, httpOptions);
  }

  getAccount = (orgId: string, id: string) => {
    const httpOptions = {
      headers: new HttpHeaders({
        accept: 'aplication/json'
      })
    };
    return this.http.get(`${environment.BASE_API_ENDPOINT}/account/${orgId}/account/${id}`, httpOptions);
  }
}
