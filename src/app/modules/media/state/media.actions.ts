/* NgRx */
import { Action } from '@ngrx/store';
import { Media } from '../media';

export enum MediaActionTypes {
    LoadMediaById = '[Media] LoadMediaById',
    LoadMediaByIdSuccess = '[Media] LoadMediaByIdSuccess',
    LoadMediaByIdFailure = '[Media] LoadMediaByIdFailure',
    LoadMediaByProductId = '[Media] LoadMediaByProductId',
    LoadMediaByProductIdSuccess = '[Media] LoadMediaByProductIdSuccess',
    LoadMediaByProductIdFailure = '[Media] LoadMediaByProductIdFailure',
    LoadMediaByOrgId = '[Media] LoadMediaByOrgId',
    LoadMediaByOrgIdSuccess = '[Media] LoadMediaByOrgIdSuccess',
    LoadMediaByOrgIdFailure = '[Media] LoadMediaByOrgIdFailure',
}

export class LoadMediaById implements Action {
    readonly type = MediaActionTypes.LoadMediaById;
    constructor(public payload: { id: string }) { }
}

export class LoadMediaByIdSuccess implements Action {
    readonly type = MediaActionTypes.LoadMediaByIdSuccess;

    constructor(public media: Media) { }
}

export class LoadMediaByIdFailure implements Action {
    readonly type = MediaActionTypes.LoadMediaByIdFailure;

    constructor(public error: string) { }
}

export class LoadMediaByProductId implements Action {
    readonly type = MediaActionTypes.LoadMediaByProductId;
    constructor(public payload: { productId: string }) { }
}

export class LoadMediaByProductIdSuccess implements Action {
    readonly type = MediaActionTypes.LoadMediaByProductIdSuccess;

    constructor(public media: Media[]) { }
}

export class LoadMediaByProductIdFailure implements Action {
    readonly type = MediaActionTypes.LoadMediaByProductIdFailure;

    constructor(public error: string) { }
}

export class LoadMediaByOrgId implements Action {
    readonly type = MediaActionTypes.LoadMediaByOrgId;
    constructor(public payload: { id: string }) { }
}

export class LoadMediaByOrgIdSuccess implements Action {
    readonly type = MediaActionTypes.LoadMediaByOrgIdSuccess;
    constructor(public media: Media[]) { }
}

export class LoadMediaByOrgIdFailure implements Action {
    readonly type = MediaActionTypes.LoadMediaByOrgIdFailure;
    constructor(public error: string) { }
}

export type MediaActions = LoadMediaById
    | LoadMediaByIdSuccess
    | LoadMediaByIdFailure
    | LoadMediaByOrgId
    | LoadMediaByOrgIdSuccess
    | LoadMediaByOrgIdFailure
    | LoadMediaByProductId
    | LoadMediaByProductIdSuccess
    | LoadMediaByProductIdFailure;
