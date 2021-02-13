import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Category } from '../models/category.model';
import { Order } from '../models/order.model';
import { ProductlistComponent } from '../productlist/productlist.component';
import { GlobalService } from '../services/global.service';
import { AppState, getCategories, getOrder } from '../state/app.reducer';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  // template: '<app-productlist></app-productlist>',
})
export class HeaderComponent implements OnInit {
  categories: Category[];
  term: any;
  @ViewChild(ProductlistComponent) child: ProductlistComponent;
  order: Order;
  countTotal: any;

  constructor(
    private store: Store<AppState>,
    private globalService: GlobalService,
  ) { }

  ngOnInit(): void {
    this.store.select(getCategories).pipe().subscribe((categories) => {
      this.categories = categories;
      console.log('>>>>>>>>>>>.', this.categories);
    });

    this.store.select(getOrder).pipe().subscribe((order) => {
      this.order = order;
      this.countTotal = this.order && this.order.items && this.order.items.length || 0;
    });
  }

  childWillTakeAction(q): void{
    this.term = q;
    this.globalService.publishSomeData({
      searchData: this.term,
    });
  }
}
