import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { AuthConfigModel } from '../model/auth-config.model';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  pageTitle = 'Register';
  loginError: string;
  errorMessage: string;
  registrationData: AuthConfigModel;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  async ngOnInit(): Promise<void> {
    if (!this.route.snapshot.queryParams.flow) {
      console.log(this.route.snapshot.queryParams);
      this.router.navigateByUrl('/route-registration');
    } else {
      console.log(`flow: ${this.route.snapshot.queryParams.flow}`);
      const res = await this.authService.getRegistrationFormData(this.route.snapshot.queryParams.flow);
      this.registrationData = res as AuthConfigModel;
      console.log(JSON.stringify(`registration flow data: ${this.registrationData}`));
    }
  }

}
