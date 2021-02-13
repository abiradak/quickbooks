import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { UserLoggedOut } from '../state/user.actions';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'app-logout',
    templateUrl: './logout.component.html',
    styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

    constructor(
        private router: Router,
        private store: Store<any>,
        private cookieService: CookieService,
    ) {}

    ngOnInit(): void {
        this.cookieService.delete('currentUser');
        this.store.dispatch(new UserLoggedOut());
        this.router.navigateByUrl('/route-logout');
    }
}