import { Action } from '@ngrx/store';
import { GomangoUser } from '../user.model';

export enum UserActionTypes {
    UserLoggedIn = '[User User Logged In]',
    UserLoggedOut = '[User User Logged Out]'
}

export class UserLoggedIn implements Action {
    readonly type = UserActionTypes.UserLoggedIn;
    constructor(public user: GomangoUser) {}
}

export class UserLoggedOut implements Action {
    readonly type = UserActionTypes.UserLoggedOut;
}

export type UserActions = UserLoggedIn | UserLoggedOut;

