import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import cloneDeep from 'lodash.clonedeep';
import { environment } from 'src/environments/environment';
import { Order } from '../models/order.model';
import { Product } from '../models/product.model';
import { getCurrentUser, UserState } from '../modules/auth/state/user.reducer';
import { GomangoUser } from '../modules/auth/user.model';
import { Media } from '../modules/media/media';
import { getMedia, MediaState } from '../modules/media/state/media.reducer';
import { UpdateOrder } from '../state/app.actions';
import { AppState, getOrder, getProducts } from '../state/app.reducer';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  order: Order;
  products: Product[];
  date: any;
  subTotal: any;
  tax: any;
  grandTotal: any;
  user: GomangoUser;
  media: Media[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>,
    private userStore: Store<UserState>,
    private mediaStore: Store<MediaState>,
    // private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.userStore.select(getCurrentUser).pipe().subscribe(user => {
      this.user = user.user;
    });

    this.store.select(getOrder).pipe().subscribe((order) => {
      this.order = order;
      if (this.media && this.media.length && this.products && this.products.length) {
        this.mapProductAndMedia();
      }
    });

    this.store.select(getProducts).pipe().subscribe((products) => {
      this.products = products;
      if (this.media && this.media.length && this.order) {
        this.mapProductAndMedia();
      }
    });

    this.date = new Date();

    this.mediaStore.select(getMedia).pipe().subscribe((media) => {
      this.media = media;
      if (this.order && this.products && this.products.length) {
        this.mapProductAndMedia();
      }
    });

  }

  mapProductAndMedia(): void {
    let items = this.order.items;
    let stateFromRemote = false;
    items = items.map(lineitem => {
      // if product exists cart was updated locally and we do not need to map products and media
      const item = {...lineitem };
      if (item.product) {
        return item;
      }
      const filtered = this.products.filter(product => product.id === item.productId);
      if (filtered.length) {
        item.product = {...filtered[0]};
        stateFromRemote = true;
        const filteredMedia = this.media.filter(media => media.tags.includes(item.productId));
        if (filteredMedia.length) {
          item.product.image = `${environment.BASE_API_ENDPOINT}/media/${environment.orgId}/media-container/${filteredMedia[0].url}`;
        }
      }
      return item;
    });
    this.order = {...this.order, items};
    if (stateFromRemote) {
      this.calculation();
    }
  }

  getDetails(): void {
    // this.order = JSON.parse(localStorage.getItem('cart'));
    // this.store.select(sendProducts).pipe().subscribe((order) => {
    //   this.order = order;
    // });
    this.calculation();
    // console.log('orders', this.order);
  }

  updateCart(index: number, updateType: string, orgId): void {
    console.log('updateCart: ', index, updateType);
    let currentQty = this.order.items[index].quantity;
    // const orgId = this.order.items[index].product.orgId;
    if (updateType === 'add') {
      currentQty++;
      const prevData = cloneDeep(this.order);
      prevData.items[index].quantity = currentQty;
      this.store.dispatch(new UpdateOrder(environment.orgId, prevData));
      this.getDetails();
    } else {
      if (currentQty > 1) {
        currentQty--;
        const prevData = cloneDeep(this.order);
        prevData.items[index].quantity = currentQty;
        this.store.dispatch(new UpdateOrder(environment.orgId, prevData));
        this.getDetails();
      }
    }
  }

  deleteFromCart(index: number, item: any): void {
    console.log('cart data', this.order);
    const prevData = cloneDeep(this.order);
    prevData.items.splice(index, 1);
    this.order = prevData;
    this.store.dispatch(new UpdateOrder(environment.orgId, this.order));
    // this.dataService.showSuccess('Item Removed Successfully', 'Success');
    this.getDetails();
  }

  calculation(): void {
    this.subTotal = 0;
    if (this.order !== null) {
      this.order.items.forEach(element => {
        if (element.product) {
          this.subTotal = (element.quantity * element.product.price) + this.subTotal;
        }
      });
      this.tax = this.subTotal * 10 / 100;
      this.grandTotal = this.subTotal + this.tax;
    }
  }

  submitPo(): void {
    console.log('Submitting po');
    const order = {...this.order} as Order;
    this.order.status = 'Manual Verification Required';
    this.order.date = new Date();
    this.order.amount = this.grandTotal;
    this.order.items = this.order.items.map(item => {
      const newItem = {...item};
      newItem.priceAtSubmission = newItem.product.price;
      return newItem;
    });
    console.log(JSON.stringify(order));

    this.store.dispatch(new UpdateOrder(environment.orgId, this.order));

    this.router.navigate(['/thankyou']);
  }
}
