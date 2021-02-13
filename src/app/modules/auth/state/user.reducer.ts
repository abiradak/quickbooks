import { GomangoUser } from '../user.model';
import { UserActions, UserActionTypes } from './user.actions';

export interface UserState {
    user: any;
}

const initialState: UserState = {
    user: null
};

export const getCurrentUser = (state: UserState) => state.user;

export function reducer(state = initialState, action: UserActions): UserState {
    switch (action.type) {
        case UserActionTypes.UserLoggedIn:
            return {
                ...state,
                user: action.user,
            };
        case UserActionTypes.UserLoggedOut:
            return {
                ...state,
                user: null
            };
        default:
            return state;
    }
}
