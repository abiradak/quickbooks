import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.module';
import { AuthConfigModel } from '../model/auth-config.model';

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.css']
})
export class RecoveryComponent implements OnInit {

  pageTitle = 'Recover password';
  loginError: string;
  errorMessage: string;
  recoveryData: AuthConfigModel;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  async ngOnInit() {
    if (!this.route.snapshot.queryParams.flow) {
      console.log(this.route.snapshot.queryParams);
      this.router.navigateByUrl('/route-recovery');
    } else {
      console.log(`flow: ${this.route.snapshot.queryParams.flow}`);
      const res = await this.authService.getRecoveryFormData(this.route.snapshot.queryParams.flow);
      this.recoveryData = res as AuthConfigModel;
      console.log(JSON.stringify(`recovery flow data: ${this.recoveryData}`));
      if (this.recoveryData.state === 'sent_email') {
        this.router.navigate(['/login']);
      }
    }
  }

  cancel() {}

}
