import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { DataService } from './data.service';
import * as moment from 'moment';
import { GlobalService } from './global.service';
import { environment } from '../../environments/environment.prod';

export const token = 'demo123456789';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    public http: HttpClient,
    private dataService: DataService,
    private globalService: GlobalService,
  ) {}

  sendHttpCallWithToken(data: any = '', url: any, method: any): Observable<any> {
    if (navigator.onLine === false) {
      // console.log('No Internet Connection >>>>>>');
      this.dataService.showError('No Internet Connection'); // --- Display error message
    } else {
      this.globalService.publishSomeData({
        custEditType: 'activity',
        updatedValue: {
          lastActivityTime: moment()
        }
      });

      const httpOptions = {
        headers: new HttpHeaders({
          accept: 'aplication/json',
          Authorization: token
        })
      };

      switch (method) {
        case 'post':
          return this.http.post<any>(environment.apiUrl + url, (data), httpOptions );

        case 'get':
          return this.http.get<any>(environment.apiUrl + url, httpOptions);

        case 'put':
          return this.http.put<any>(environment.apiUrl + url, (data), httpOptions);

        case 'delete':
          return this.http.delete<any>(environment.apiUrl + url, httpOptions);

        default:
          console.log('Add method');
      }
    }
  }

  sendHttpCallWithoutToken(data: any = '', url: any, method: any): Observable<any> {
    if (navigator.onLine === false) {
      // console.log('No Internet Connection >>>>>>');
      this.dataService.showError('No Internet Connection'); // --- Display error message
    } else {
      const httpOptions = {
        headers: new HttpHeaders({
          accept: 'aplication/json'
        })
      };

      switch (method) {
        case 'post':
          return this.http.post<any>(environment.apiUrl + url, (data), httpOptions );

        case 'get':
          return this.http.get<any>(environment.apiUrl + url, httpOptions);

        case 'put':
          return this.http.put<any>(environment.apiUrl + url, (data), httpOptions);

        case 'delete':
          return this.http.delete<any>(environment.apiUrl + url, httpOptions);

        default:
          console.log('Add method');
      }
    }
  }
}
