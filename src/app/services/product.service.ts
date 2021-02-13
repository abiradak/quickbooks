import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState, getProducts } from '../state/app.reducer';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    char = [];
    name = [];
    products = [];

    constructor(private http: HttpClient , private store: Store<AppState>) {

    }

    getCategories = (orgId: string) => {
        return this.http.get(`${environment.BASE_API_ENDPOINT}/catalog/${orgId}/category`);
        // return this.http.get('./assets/sample_categories.json');
    }

    // public getJSON(): Observable<any> {
    //     return this.http.get('./services/sample_categories.json');
    // }

    getProducts = (orgId: string) => {
        return this.http.get(`${environment.BASE_API_ENDPOINT}/catalog/${orgId}/product`);
        // return this.http.get('./assets/sample_products.json');
    }

    getCharSuperSet = (orgId: string) => {
        // return this.http.get(`${environment.BASE_API_ENDPOINT}/${environment.orgId}/product`);
        this.store.select(getProducts).pipe().subscribe((products => {
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
            return this.char;
        }));
    }


    // createData(products) {
    //     products.forEach(element => {
    //       if (element.characteristics.length > 0) {
    //         element.characteristics.forEach( item => {
    //           if (!this.name.includes(item.name)) {
    //             this.name.push(item.name);
    //           }
    //           this.pushObjInArray(item, item.name);
    //         });
    //       }
    //     });
    // }
    pushObjInArray(item, name) {
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
