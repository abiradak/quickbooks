import { CommonModule } from '@angular/common';
import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthOptions, AuthService } from './auth.service';
import { RecoveryComponent } from './recovery/recovery.component';
import { RegistrationComponent } from './registration/registration.component';
import { SettingsComponent } from './settings/settings.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { reducer } from './state/user.reducer';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { UserEffects } from './state/user.effects';
import { LoginSuccessComponent } from './loginsuccess/loginsuccess.component';

export { AuthService };
export { AuthOptions };

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    StoreModule.forFeature('user', reducer),
    EffectsModule.forFeature([UserEffects]),
  ],
  declarations: [
    LoginComponent,
    RegistrationComponent,
    RecoveryComponent,
    SettingsComponent,
    LogoutComponent,
    LoginSuccessComponent
  ],
  exports: [
    LoginComponent,
    RegistrationComponent,
    RecoveryComponent,
    SettingsComponent,
    LogoutComponent,
  ],
})
export class AuthModule {
  static forRoot(
    options?: AuthModuleOptions
  ): ModuleWithProviders<AuthModuleOptions> {
    return {
      ngModule: AuthModule,
      providers: [
        // In order to translate the raw, optional OPTIONS argument into an
        // instance of the MyServiceOptions TYPE, we have to first provide it as
        // an injectable so that we can inject it into our FACTORY FUNCTION.
        {
          provide: FOR_ROOT_OPTIONS_TOKEN,
          useValue: options,
        },
        // Once we've provided the OPTIONS as an injectable, we can use a FACTORY
        // FUNCTION to then take that raw configuration object and use it to
        // configure an instance of the MyServiceOptions TYPE (which will be
        // implicitly consumed by the MyService constructor).
        {
          provide: AuthOptions,
          useFactory: provideAuthServiceOptions,
          deps: [FOR_ROOT_OPTIONS_TOKEN],
        },

        // NOTE: We don't have to explicitly provide the MyService class here
        // since it will automatically be picked-up using the "providedIn"
        // Injectable() meta-data.
      ],
    };
  }
}

export interface AuthModuleOptions {
  AUTH_URL?: string;
}

export let FOR_ROOT_OPTIONS_TOKEN = new InjectionToken<AuthModuleOptions>(
  'forRoot() AuthService configuration.'
);

export function provideAuthServiceOptions(
  options?: AuthModuleOptions
): AuthOptions {
  const authOptions = new AuthOptions();

  // If the optional options were provided via the .forRoot() static method, then apply
  // them to the MyServiceOptions Type provider.
  if (options) {
    if (typeof options.AUTH_URL === 'string') {
      authOptions.AUTH_URL = options.AUTH_URL;
    }
  }

  return authOptions;
}
