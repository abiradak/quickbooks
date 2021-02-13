import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class AuthOptions {
  public AUTH_URL = 'http://localhost';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private options: AuthOptions;

  constructor(
    options: AuthOptions,
    private http: HttpClient,
    ) {
    this.options = options;
    // console.log(`url in authService: ${this.getAuthUrl()}`);
  }

  getAuthUrl = () => {
    return `${this.options.AUTH_URL}/self-service/registration/browser`;
  }

  getLoginFormData = async (flow: string) => {
    return this.http.get(`${this.options.AUTH_URL}/self-service/login/flows?id=${flow}`).toPromise();
  }

  whoAmI = async () => {
    console.log(`${this.options.AUTH_URL}/sessions/whoami`);
    return await this.http.get(`${this.options.AUTH_URL}/sessions/whoami`).toPromise();
  }

  getRegistrationFormData = async (flow: string) => {
    return this.http.get(`${this.options.AUTH_URL}/self-service/registration/flows?id=${flow}`).toPromise();
  }

  getRecoveryFormData = async (flow: any) => {
    return this.http.get(`${this.options.AUTH_URL}/self-service/recovery/flows?id=${flow}`).toPromise();
  }

  getSettingsFormData = async (flow: any) => {
    return this.http.get(`${this.options.AUTH_URL}/self-service/settings/flows?id=${flow}`).toPromise();
  }

  getErrorData = async (error: any) => {
    return this.http.get(`${this.options.AUTH_URL}/self-service/errors?error=${error}`).toPromise();
  }
}
