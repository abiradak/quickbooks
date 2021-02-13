import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Order } from '../models/order.model';
import { AppState, getAllOrders } from '../state/app.reducer';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {

  orders: Order[];
  constructor(
    public router: Router,
    private store: Store<AppState>,
  ) {}

  ngOnInit(): void {
    this.store.select(getAllOrders).pipe().subscribe((orders) => {
      this.orders = orders.filter(order => order.status !== 'pending');
    });
  }

  moveOrderDetails(id): void {
    this.router.navigate([`/orders/${id}`]);
  }

}
