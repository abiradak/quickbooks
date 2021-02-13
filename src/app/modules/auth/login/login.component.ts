import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { AuthConfigModel } from '../model/auth-config.model';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  pageTitle = 'Log In';
  loginError: string;
  errorMessage: string;
  loginData: AuthConfigModel;
  subscription;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.subscription = this.route.queryParams.pipe()
      .subscribe(async params => {
        console.log(params); // { order: "popular" }
        if (params.flow) {
          console.log(`flow: ${this.route.snapshot.queryParams.flow}`);
          const res = await this.authService.getLoginFormData(this.route.snapshot.queryParams.flow);
          this.loginData = res as AuthConfigModel;
          console.log(JSON.stringify(`login flow data: ${JSON.stringify(this.loginData)}`));
        } else {
          console.log(this.route.snapshot.queryParams);
          this.router.navigateByUrl('/route-login');
        }
      }
    );
    // if (!this.route.snapshot.queryParams.flow) {
    // } else {
    //   console.log(`flow: ${this.route.snapshot.queryParams.flow}`);
    //   const res = await this.authService.getLoginFormData(this.route.snapshot.queryParams.get('flow'));
    //   this.loginData = res as AuthConfigModel;
    //   console.log(JSON.stringify((this.loginData as AuthConfigModel)));
    // }
  }

  ngOnDestroy(): void {
    // this.currentUserSubscription.unsubscribe();
    this.subscription.unsubscribe();
  }
}
