import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    private dataService: DataService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // const login = this.dataService.isLogin();
    // if (login === true) {
    //   this.router.navigate(['product-list']);
    // } else {
    //   this.router.navigate(['login']);
    // }
  }
}
