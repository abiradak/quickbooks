import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from 'src/environments/environment';
import { RedirectGuard } from './guards/redirect-guard';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';

import { RecoveryComponent } from './recovery/recovery.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginSuccessComponent } from './loginsuccess/loginsuccess.component';
import { AuthGuard } from './guards/auth.guard';

const AUTH_URL = environment.AUTH_URL;

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegistrationComponent },
    { path: 'recovery', component: RecoveryComponent },
    { path: 'loginsuccess', component: LoginSuccessComponent, canActivate: [AuthGuard] },
    { path: 'logout', component: LogoutComponent },
    {
        path: 'route-login',
        canActivate: [RedirectGuard],
        component: RedirectGuard,
        data: {
            externalUrl: `${AUTH_URL}/self-service/login/browser`
        }
    },
    {
        path: 'route-registration',
        canActivate: [RedirectGuard],
        component: RedirectGuard,
        data: {
            externalUrl: `${AUTH_URL}/self-service/registration/browser`
        }
    },
    {
        path: 'route-recovery',
        canActivate: [RedirectGuard],
        component: RedirectGuard,
        data: {
            externalUrl: `${AUTH_URL}/self-service/recovery/browser`
        }
    },
    {
        path: 'route-settings',
        canActivate: [RedirectGuard],
        component: RedirectGuard,
        data: {
            externalUrl: `${AUTH_URL}/self-service/settings/browser`
        }
    },
    {
        path: 'route-logout',
        canActivate: [RedirectGuard],
        component: RedirectGuard,
        data: {
            externalUrl: `${AUTH_URL}/self-service/browser/flows/logout`
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule {}
