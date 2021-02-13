import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  nameValidationRegex = /^[a-zA-Z\']+$/;
  emailValidationRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
  phoneValidationRegex = /^[\d+]+$/;
  passwordValidationRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/; // -- Minimum eight characters, at least one letter and one number

  toastConfig: object = {
    timeOut: 3000,
    progressBar: true,
  };
  lastActivityTime: any = null;

  constructor(
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private cookieService: CookieService,
  ) { }

  // --- For showing the loader with custom setup, you can change the setup here
  showLoader(): void {
    this.spinner.show();
  }

  // --- For hideing the loader
  hideLoader(): void {
    this.spinner.hide();
  }

  // --- For showing the success toast
  showSuccess(message, title: any = null): void {
    // console.log('toast called');
    this.toastr.success(message, 'Success!', this.toastConfig);
  }

  // --- For showing the error toast
  showError(message, title: any = null): void {
    // console.log('toast called');
    this.toastr.error(message, 'Error!', this.toastConfig);
  }

  // --- For showing the info toast
  showInfo(message, title: any = null): void {
    this.toastr.info(message, 'Info!', this.toastConfig);
  }

  isLogin(): boolean {
    if (this.cookieService.check('gtLoginData')) { // --- To check cookie
      const token = this.cookieService.get('gtLoginData'); // --- To get cookie
      // console.log('Cookie gtLoginData: ', token);
      if (token == null) {
        return false;
      } else {
        // --- Everytime site vigit, re-set cookie time
        this.cookieService.set('gtLoginData', token, {expires: 7, sameSite: 'Lax'}); // --- To set cookie for 7 days
        return true;
      }
    } else {
      return false;
    }
  }
}
