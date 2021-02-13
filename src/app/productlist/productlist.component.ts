import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import copy from 'fast-copy';
import { environment } from 'src/environments/environment';
import { Category } from '../models/category.model';
import { OrderLine } from '../models/order-line.model';
import { Order } from '../models/order.model';
import { Product } from '../models/product.model';
import { getCurrentUser, UserState } from '../modules/auth/state/user.reducer';
import { GomangoUser } from '../modules/auth/user.model';
import { Media } from '../modules/media/media';
import { getMedia, MediaState } from '../modules/media/state/media.reducer';
import { GlobalService } from '../services/global.service';
import { UpdateOrder } from '../state/app.actions';
import { AppState, getCategories, getError, getProducts, loading, sendProducts } from '../state/app.reducer';

@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.css']
})
export class ProductlistComponent implements OnInit {

  @Input() term: string;

  user: GomangoUser;
  selectedCategoryId: string;
  selectedCategory: Category;
  categories: Category[];
  products: Product[];
  order: Order;
  error: null;
  loading: boolean;
  price = 0;
  arrayOfID = [];
  reserve: Product[];
  lastFilter: Product[];
  arrayOfColor = [];
  arrayOfSize = [];
  char = [];
  p = 1;
  name = [];
  items: [];
  itemCount = 1;
  pid = '';
  isclicked = false;
  cart: Order;
  media: Media[];
  minPrice = 100000;
  maxPrice = 0;
  xArray: any[];
  filterByObj = {
    category: [],
    charc: []
  };
  trackBack = [];
  trackbackArray = [];

  filterProd = [];

  subscriptions = {
    categories: null,
    products: null
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private mediaStore: Store<MediaState>,
    private userStore: Store<UserState>,
    private globalService: GlobalService,
  ) {
    this.globalService.getObservable().subscribe((data) => {
      this.term = data.searchData;
      if (this.term.length > 0) {
        this.searchFromHeader();
      } else {
        this.ngOnInit();
      }
    });
  }

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      // console.log(params);
      this.selectedCategoryId = params['categoryId'];

      this.filterByObj.category = [];
      if (this.subscriptions.categories) {
        this.subscriptions.categories.unsubscribe();
      }

      if (this.subscriptions.products) {
        this.subscriptions.products.unsubscribe();
      }

      this.initialize();
    });

    this.userStore.select(getCurrentUser).pipe().subscribe(user => {
      console.log(`fetched user: ${JSON.stringify(user)}`);
      this.user = user.user;
    });

    // this.store.dispatch(new LoadCategories(environment.orgId));

    this.store.select(getError).pipe().subscribe((error => this.error = error));

    this.store.select(loading).pipe().subscribe((loadingState => this.loading = loadingState));

    this.initialize();
    this.mediaStore.select(getMedia).pipe().subscribe((media) => {
      this.media = media;
      if (this.products) {
        this.mediaMap();
      }
    });
  }

  initialize(): void {
    this.subscriptions.categories = this.store.select(getCategories).pipe().subscribe((categories) => {
      this.categories = categories;
      this.selectedCategory = this.getSelectedCategory(this.selectedCategoryId);
      if (this.selectedCategory) {
        this.allfilter(this.selectedCategory.id , true , 'category');
      }
    });

    // TODO: move __categories__ transformation to effect
    this.subscriptions.products = this.store.select(getProducts).pipe().subscribe((products => {
      this.products = products;
      this.char = [];
      this.createData(products);
      this.products = this.products.map(product => {
        const prod = { ...product };
        console.log('prod: ', prod);
        if (+prod.price < this.minPrice) {
          this.minPrice = +prod.price;
        }
        if (+prod.price > this.maxPrice) {
          this.maxPrice = +prod.price;
        }
        if (prod.__categories__ && prod.__categories__.length) {
          prod.categories = [...prod.__categories__];
          delete prod.__categories__;
          return prod;
        } else {
          return prod;
        }
      });
      this.minPrice = Math.floor(this.minPrice);
      this.maxPrice = Math.ceil(this.maxPrice);
      this.price = this.maxPrice;
      if (this.media) {
        this.mediaMap();
      }
      this.lastFilter = this.products;
      this.reserve = this.products;
      if (this.selectedCategory) {
        this.allfilter(this.selectedCategory.id , true , 'category');
      }
    }));
  }
  getSelectedCategory(categoryId): Category{
    if (this.selectedCategoryId && this.categories && this.categories.length) {
      return this.categories.filter(category => category.id === categoryId)[0];
    }
    return null;
  }

  mediaMap(): any {
    this.media.forEach(element => {
      this.products = this.products.map(product => {
        const prod = { ...product };
        if (element.tags.includes(prod.id)) {
          prod.image = `${environment.BASE_API_ENDPOINT}/media/${environment.orgId}/media-container/${element.url}`;
          return prod;
        } else {
          return prod;
        }
      });
      this.lastFilter = this.products;
      this.reserve = this.products;
    });
  }

  createData(products: Product[]): void {
    products.forEach(element => {
      if (element.characteristics.length > 0) {
        element.characteristics.forEach(item => {
          if (!this.name.includes(item.name) && !item.system && item.display) {
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
      if (!this.char[name].some(e => e.name.value === item.value)) {
        this.char[name].push(obj);
      }
    } else {
      this.char[name] = [];
      this.char[name].push(obj);
    }
  }

  // filterByCategory(id: any , e): void {
  //   if (e === true) {
  //     this.arrayOfID.push(id);
  //     this.getProductsThatMatchCategory(this.reserve, this.arrayOfID);
  //   } else {
  //     const index = this.arrayOfID.indexOf(id);
  //     if (index > -1) {
  //       this.arrayOfID.splice(index, 1);
  //     }
  //     this.getProductsThatMatchCategory(this.reserve, this.arrayOfID);

  //     if (this.arrayOfColor.length <= 0 && this.arrayOfID.length <= 0) {
  //       this.ngOnInit();
  //     }
  //   }
  // }

  allfilter(id: any, e: any, name: any): void {
    console.log('e, name', e, name);
    if (e === true) {
      if (name === 'category') {
        if (this.filterByObj.category && this.filterByObj.category.length > 0) {
          this.filterByObj.category.push(id);
        } else {
          this.filterByObj.category = [id];
        }
      } else {
        if (this.filterByObj.charc && this.filterByObj.charc.length > 0) {
          let findInFilter = false;
          this.filterByObj.charc.forEach(element => {
            // if (this.trackBack.indexOf(name) !== -1) {
            if (element.key === name) {
              element.value.push(id);
              findInFilter = true;
            }
            // } else {
            //   this.filterByObj.charc.push({ key: name , value: [id]});
            //   // this.trackBack.push(name);
            // }
          });
          if (findInFilter === false) {
            this.filterByObj.charc.push({ key: name, value: [id] });
          }
        } else {
          this.filterByObj.charc = [{ key: name, value: [id] }];
          // this.trackBack.push(name);
        }
      }
    } else {
      if (name === 'category') {
        const index = this.filterByObj.category.findIndex((x: any) => x === id);
        this.filterByObj.category.splice(index, 1);
      } else {
        let counter = 0;
        this.filterByObj.charc.forEach(element => {
          if (element.key === name) {
            const index = element.value.findIndex((x: any) => x === id);
            element.value.splice(index, 1);
            // console.log('index >>>>', this.filterByObj.charc);
          }
          if (element.value.length === 0) {
            this.filterByObj.charc.splice(counter, 1);
          }
          counter++;
        });
      }
    }
    console.log('this.filterByObj: ', this.filterByObj);
    // this.generaliseFilter(this.filterByObj);
    if (this.reserve && this.reserve.length) {
      this.generaliseFilter1();
    }
  }

  generaliseFilter1(): void {
    // console.log('products: ', this.products);
    this.products = this.reserve.filter(element => {
      const itemChar = {
        category: [],
        charc: []
      };
      if (element.categories && element.categories.length > 0) {
        element.categories.forEach(element1 => {
          itemChar.category.push(element1.id);
        });
      }
      if (element.characteristics && element.characteristics.length > 0) {
        element.characteristics.forEach(element1 => {
          itemChar.charc.push({
            key: element1.name,
            value: [element1.value]
          });
        });
      }
      if (this.filterByObj.category.length > 0 && this.filterByObj.charc.length > 0) {
        const findCatIndex = this.filterByObj.category.findIndex(data => data === itemChar.category[0]);
        let findCharStatus = true;
        this.filterByObj.charc.forEach(element1 => {
          console.log('element1: ', element1);
          const findIndex = itemChar.charc.findIndex(data => data.key === element1.key);
          console.log('findIndex: ', findIndex);
          if (findIndex > -1) {
            const findIndex2 = element1.value.findIndex(data => data === itemChar.charc[findIndex].value[0]);
            if (findIndex2 === -1) {
              findCharStatus = false;
            }
          } else {
            findCharStatus = false;
          }
        });
        if (findCatIndex > -1 && findCharStatus === true) {
          return element;
        }
      } else if (this.filterByObj.category.length > 0) {
        const findIndex = this.filterByObj.category.findIndex(data => data === itemChar.category[0]);
        if (findIndex > -1) {
          return element;
        }
      } else if (this.filterByObj.charc.length > 0) {
        let findStatus = true;
        this.filterByObj.charc.forEach(element1 => {
          console.log('element1: ', element1);
          const findIndex = itemChar.charc.findIndex(data => data.key === element1.key);
          console.log('findIndex: ', findIndex);
          if (findIndex > -1) {
            const findIndex2 = element1.value.findIndex(data => data === itemChar.charc[findIndex].value[0]);
            if (findIndex2 === -1) {
              findStatus = false;
            }
          } else {
            findStatus = false;
          }
        });
        if (findStatus === true) {
          return element;
        }
      } else {
        return element;
      }
      console.log('----------------- ');
    });
    this.lastFilter = this.products;
    this.checkPrice(this.price);
    // this.searchFromHeader();
    // console.log('products: ', this.products);
  }

  // generaliseFilter(obj: any): void {
  //   console.log(obj);
  //   const itemChar = {
  //     category: [],
  //     charc: [
  //     ]
  //   };
  //   this.products = this.products.filter( (item) => {
  //     // for (const key in obj) {
  //     // if (item[key] === undefined || item[key] !== obj[key]) {
  //     //   return false;
  //     // }
  //     // }
  //     if (item.characteristics && item.characteristics.length > 0) {
  //       item.characteristics.forEach(element => {
  //         if (itemChar.charc.length > 0) {
  //           if (this.trackbackArray.indexOf(element.name) !== -1) {
  //             const index = itemChar.charc.findIndex( (x: any) => x.name === element.value);
  //             if (itemChar.charc[index].value.length > 0) {

  //             }
  //             itemChar.charc[index].value.push(element.value);
  //           }
  //         } else {
  //           itemChar.charc.push({ key: element.name , value: [element.value]});
  //           this.trackbackArray.push(element.name);
  //         }
  //       });
  //     }
  //     console.log('njadjad', itemChar);
  //   });

  //   // if ((obj.category && obj.category.length > 0) || (obj.charc && obj.charc.length > 0)) {
  //   //   const filteredData = [];
  //   //   const fullFilteredArray = [];
  //   //   this.reserve.filter( (item) => {
  //   //     if (obj.category && obj.category.length > 0) {
  //   //       obj.category.some( (newitem: any) => {
  //   //         if (item.categories && item.categories.length > 0 && newitem === item.categories[0].id) {
  //   //           filteredData.push(item);
  //   //           if (obj.charc && obj.charc.length > 0) {
  //   //             obj.charc.forEach( (element: any) => {
  //   //               filteredData.filter( (pduct) => {
  //   //                 if (pduct.characteristics && item.characteristics.length > 0 ) {
  //   //                   const index = pduct.characteristics.findIndex( (x: any) => x.name === element.key);
  //   //                   if (index !== -1) {
  //   //                     // if (item.characteristics[index].name === element.key  && newite === item.characteristics[index].value) {
  //   //                     //   fullFilteredArray.push(item);
  //   //                     //   this.products = fullFilteredArray;
  //   //                     // }
  //   //                     if (item.characteristics[index].name === element.key &&
  //   //                       element.value.indexOf(item.characteristics[index].value) !== -1) {
  //   //                       fullFilteredArray.push(item);
  //   //                       this.products = fullFilteredArray;
  //   //                     }
  //   //                     // element.value.some( (newite: any) => {
  //   //                     //   if (item.characteristics[index].name === element.key  && newite === item.characteristics[index].value) {
  //   //                     //     fullFilteredArray.push(item);
  //   //                     //     this.products = fullFilteredArray;
  //   //                     //   }
  //   //                     // });
  //   //                   }
  //   //                 }
  //   //               });
  //   //             });
  //   //           } else {
  //   //             this.products = filteredData;
  //   //           }
  //   //         }
  //   //       });
  //   //     } else {
  //   //       if (obj.charc && obj.charc.length > 0) {
  //   //         obj.charc.forEach( (element: any) => {
  //   //           if (item.characteristics && item.characteristics.length > 0 ) {
  //   //             const index = item.characteristics.findIndex( (x: any) => x.name === element.key);
  //   //             if (index !== -1) {
  //   //               element.value.some( (newite: any) => {
  //   //                 if (item.characteristics[index].name === element.key  && newite === item.characteristics[index].value) {
  //   //                   fullFilteredArray.push(item);
  //   //                   this.products = fullFilteredArray;
  //   //                 }
  //   //               });
  //   //               // if (item.characteristics[index].name === element.key  &&
  //   //               //   element.value.indexOf(item.characteristics[index].value) !== -1) {
  //   //               //   fullFilteredArray.push(item);
  //   //               //   this.products = fullFilteredArray;
  //   //               // }
  //   //             }
  //   //           }
  //   //         });
  //   //       } else {
  //   //         this.products = filteredData;
  //   //       }
  //   //     }
  //   //   });
  //   // } else {
  //   //   this.ngOnInit();
  //   // }
  // }

  // filterByChar(id: any , e: any , name: any): void {
  //   if (e === true) {
  //     this.arrayOfColor.push(id);
  //     this.getProductsThatMatchChar(this.products, this.arrayOfColor , name);
  //   } else {
  //     const index = this.arrayOfColor.indexOf(id);
  //     if (index > -1) {
  //       this.arrayOfColor.splice(index, 1);
  //     }
  //     this.getProductsThatMatchChar(this.products, this.arrayOfColor , name);

  //     if (this.arrayOfColor.length <= 0 && this.arrayOfID.length <= 0) {
  //       this.ngOnInit();
  //     } else if (this.arrayOfID.length > 0) {
  //       this.getProductsThatMatchCategory(this.reserve, this.arrayOfID);
  //     } else if (this.arrayOfColor.length > 0) {
  //       this.getProductsThatMatchChar(this.products, this.arrayOfID, name);
  //     }
  //   }
  // }

  // private getProductsThatMatchCategory(productList, categoryIdArray): void {
  //   this.products = productList.filter( (item) => {
  //     return categoryIdArray.some( (newitem) => {
  //       if (item.__categories__.length > 0 && newitem === item.__categories__[0].id) {
  //         return item;
  //       }
  //     });
  //   });
  // }

  // private getProductsThatMatchChar(productList, AllIdArray , name): void {
  //   this.products = productList.filter( (item) => {
  //     if (item.characteristics && item.characteristics.length > 0 ) {
  //       const index = item.characteristics.findIndex( (x) => x.name === name);
  //       if (index !== -1) {
  //         return AllIdArray.some( (newitem) => {
  //           if (item.characteristics[index].name === name  && newitem === item.characteristics[index].value) {
  //             return item;
  //           }
  //         });
  //       }
  //     }
  //   });
  // }

  checkPrice(price): void {
    this.price = price;
    this.products = this.lastFilter.filter((item) => {
      if (+item.price <= +price) {
        return Number(item.price).toFixed(2);
      }
    });
  }

  searchFromHeader(): void {
    this.products = this.lastFilter.filter((item) => {
      if (item.name.toLowerCase().indexOf(this.term.toLowerCase()) > -1) {
        return item;
      }
    });
  }

  addToPo(item: Product): void {
    this.store.select(sendProducts).pipe().subscribe((order) => {
      this.cart = order;
    });
    if (this.cart !== null) {
      // cart exists
      const index = this.cart.items.findIndex(x => x.productId === item.id);
      if (index > -1) {
        const newItem = new OrderLine();
        newItem.productId = item.id;
        newItem.quantity = this.cart.items[index].quantity + this.itemCount,
          newItem.product = item;
        const newOrder = copy(this.cart);
        newOrder.items[index] = newItem;
        this.store.dispatch(new UpdateOrder(environment.orgId, newOrder));
      } else {
        const newItem = new OrderLine();
        newItem.productId = item.id;
        newItem.quantity = this.itemCount;
        newItem.product = item;
        const newOrder = copy(this.cart);
        newOrder.items.push(newItem);
        this.store.dispatch(new UpdateOrder(environment.orgId, newOrder));
      }
    } else {
      // cart does not exist create one
      this.order = new Order();
      this.order.orgId = environment.orgId;
      this.order.status = 'pending';
      if (this.user && this.user.identity && this.user.identity.id) {
        this.order.accountId = this.user.identity.id;
      }
      // create and add first item
      this.order.items = [];
      const line = new OrderLine();
      line.productId = item.id;
      line.product = item;
      line.quantity = this.itemCount;
      this.order.items.push(line);
      this.store.dispatch(new UpdateOrder(environment.orgId, this.order));
    }
    this.itemCount = 1;
  }

  addItem(id: any, index: any): void {
    this.itemCount++;
    this.pid = id;
    this.isclicked = true;
    // this.itemCount = this.itemCount + 1;
  }

  removeItem(id: any, index: any): void {
    this.pid = id;
    if (this.itemCount === 1) {
      this.itemCount = 1;
    } else {
      this.itemCount--;
      // this.itemCount = this.itemCount - 1;
    }
  }
}
