import { Injectable } from '@angular/core';
import {
  CanActivate, CanActivateChild, CanLoad,
  Route, UrlSegment, ActivatedRouteSnapshot,
  RouterStateSnapshot, UrlTree, Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { DateTime } from 'luxon';

import { AuthService } from '../auth.service';
import { select, Store } from '@ngrx/store';
import { UserLoggedIn } from '../state/user.actions';
import { getCurrentUser } from '../state/user.reducer';
import { take } from 'rxjs/operators';
import { GomangoUser } from '../user.model';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  // export class AuthGuard implements CanActivate {

  currentUser: GomangoUser;

  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
    private router: Router,
    private store: Store<any>,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const user: string = this.cookieService.get('currentUser');
    if (user) {
      this.currentUser = JSON.parse(user);
    }
    const currDate = DateTime.local().toUTC();
    let expiresAt = this.currentUser &&
      this.currentUser.expires_at &&
      DateTime.fromISO(this.currentUser.expires_at).toUTC();

    if (expiresAt && expiresAt > currDate) {
      this.store.pipe(select(getCurrentUser)).pipe(take(1)).subscribe(usr => {
        // console.log(`user from state : ${JSON.stringify(user)}`);
        if (!usr.user) {
          this.store.dispatch(new UserLoggedIn(this.currentUser));
        }
      });
      return true;
    } else if (!this.currentUser) {
      return this.authService.whoAmI()
        .then((gomangouser: GomangoUser)  => {
          console.log(`user is logged in ${gomangouser}`);
          this.currentUser = gomangouser;
          this.cookieService.set('user', JSON.stringify(gomangouser));
          expiresAt = DateTime.fromISO(this.currentUser.expires_at).toUTC();
          if (expiresAt && expiresAt > currDate) {
            this.router.navigateByUrl('/loginsuccess');
            return true;
          } else {
            return false;
          }
        })
        .catch(err => {
          console.log(err);
          this.router.navigateByUrl('/login');
          return false;
        });
    } else {
      return false;
    }
  }
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return false;
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    console.log('route:  ', route);
    console.log('segments:  ', segments);
    return true;
  }
}
