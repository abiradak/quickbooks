import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { GomangoUser } from '../user.model';
import { UserLoggedIn } from '../state/user.actions';
import { accountLoading, AppState, getAccount } from 'src/app/state/app.reducer';
import { Account } from 'src/app/models/account.model';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-loginsuccess',
    templateUrl: './loginsuccess.component.html',
    styleUrls: ['./loginsuccess.component.css']
})
export class LoginSuccessComponent implements OnInit {

    account: Account;
    accountLoading: boolean;
    constructor(
        private store: Store<any>,
        private userStore: Store<AppState>,
        private router: Router,
        private authService: AuthService,
    ) { }

    ngOnInit(): void {
        this.authService.whoAmI()
            .then(user => {
                // this.store.dispatch(new UserLoggedIn(user as GomangoUser));
                this.userStore.select(getAccount).pipe().subscribe((account: Account) => {
                    this.account = account;
                    // console.log(this.account);
                    this.userStore.select(accountLoading).subscribe( (accountLoadingS) => {
                        this.accountLoading = accountLoadingS;
                    });
                    if (this.accountLoading === true && environment.approvalRequired && (!this.account || !this.account.approved)) {
                        this.router.navigate(['/waiting']);
                    } else {
                        this.router.navigate(['/product-list']);
                    }
                });
            });
    }
}
