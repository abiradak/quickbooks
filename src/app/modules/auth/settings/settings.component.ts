import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.module';
import { AuthConfigModel } from '../model/auth-config.model';

@Component({
  selector: 'mango-nxt-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  pageTitle = 'Profile';
  header;
  detail;
  open;
  subHeader = 'Profile';
  loginError: string;
  errorMessage: string;
  settingsData: AuthConfigModel;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  async ngOnInit() {
    if (!this.route.snapshot.queryParams.flow) {
      console.log(this.route.snapshot.queryParams);
      this.router.navigateByUrl('/route-settings');
    } else {
      console.log(`flow: ${this.route.snapshot.queryParams.flow}`);
      const res = await this.authService.getSettingsFormData(this.route.snapshot.queryParams.flow);
      this.settingsData = res as AuthConfigModel;
      console.log(JSON.stringify((this.settingsData as AuthConfigModel)));
    }
  }

  getTrait(trait) {
    if (trait) {
      const traits = trait.split('.');
      let res = traits[traits.length - 1];
      for (let i = traits.length - 2; i > 0; i--) {
        res = `${res} ${traits[i]}`;
      }
      return res;
    } else {
      return trait;
    }

  }

}
