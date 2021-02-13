import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import * as userActions from '../../auth/state/user.actions';
import { Media } from '../media';
import { MediaService } from '../media.service';
import * as mediaActions from './media.actions';

@Injectable()
export class MediaEffects {
    constructor(
        private actions$: Actions,
        private store$: Store<any>,
        private mediaService: MediaService,
    ) { }

    @Effect()
    UserLoggedIn$ = this.actions$.pipe(
        ofType(userActions.UserActionTypes.UserLoggedIn),
        mergeMap((action: userActions.UserLoggedIn) =>
        this.mediaService.fetchByOrgId(environment.orgId).pipe(
            map((media: Media[]) => (new mediaActions.LoadMediaByOrgIdSuccess(media))),
            catchError(err => of(new mediaActions.LoadMediaByOrgIdFailure(err.message)))
        ))
    );

    @Effect()
    LoadMediaByOrgId$ = this.actions$.pipe(
        ofType(mediaActions.MediaActionTypes.LoadMediaByOrgId),
        mergeMap((action: mediaActions.LoadMediaByOrgId) => {
            return this.mediaService.fetchByOrgId(action.payload.id).pipe(
                map((media: Media[]) => (new mediaActions.LoadMediaByOrgIdSuccess(media))),
                catchError(err => of(new mediaActions.LoadMediaByOrgIdFailure(err.message))));
        }
        ));

    @Effect()
    LoadMediaByProductId$ = this.actions$.pipe(
        ofType(mediaActions.MediaActionTypes.LoadMediaByProductId),
        mergeMap((action: mediaActions.LoadMediaByProductId) => {
            return this.mediaService.fetchByTags(environment.orgId, [action.payload.productId]).pipe(
                map((media: Media[]) => (new mediaActions.LoadMediaByProductIdSuccess(media))),
                catchError(err => of(new mediaActions.LoadMediaByProductIdFailure(err.message))));
        }
        ));

    @Effect()
    LoadMediaById$ = this.actions$.pipe(
        ofType(mediaActions.MediaActionTypes.LoadMediaById),
        mergeMap((action: mediaActions.LoadMediaById) =>
            this.mediaService.fetchById(environment.orgId, action.payload.id).pipe(
                map((media: Media) => (new mediaActions.LoadMediaByIdSuccess(media))),
                catchError(err => of(new mediaActions.LoadMediaByIdFailure(err.message))))
        ));

}
