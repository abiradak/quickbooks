import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Media } from '../media';
import * as fromMedia from './media.actions';

// export interface AppState extends fromRoot.AppState {
//     media: MediaState;
// }

export interface MediaState {
    media: Media[];
    loading: boolean;
    error: string;
}

export const initialState: MediaState = {
    media: [],
    loading: false,
    error: null,
};

export interface QueryById {
    id: string;
}

export interface QueryByTag {
    tag: string;
}

// Selector functions
const getMediaFeatureState = createFeatureSelector<MediaState>('media');

export const getMedia = createSelector(
    getMediaFeatureState,
    state => state.media
);

export const loading = createSelector(
    getMediaFeatureState,
    state => state.loading
);

export const error = createSelector(
    getMediaFeatureState,
    state => state.error
);

export const getMediaById = createSelector(
    getMedia,
    (media: Media[], props: QueryById) =>
        media.find((medium: Media) => medium.id === props.id)
);

export const getMediaByTagId = createSelector(
    getMedia,
    (media: Media[], props: QueryByTag) =>
        media.filter((medium: Media) => {
            return medium.tags.includes[props.tag];
        })
);

export function reducer( state = initialState, action: fromMedia.MediaActions ): MediaState {
    switch (action.type) {
        case fromMedia.MediaActionTypes.LoadMediaById:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case fromMedia.MediaActionTypes.LoadMediaByIdSuccess:
            {
                const mediaId = action.media.id;
                const keepMedia = state.media.filter(media => {
                    return mediaId !== media.id;
                });
                keepMedia.push(action.media);
                console.log('keepMedia    ', keepMedia);
                return {
                    ...state,
                    media: keepMedia,
                    error: null,
                    loading: false,
                };
            }
        case fromMedia.MediaActionTypes.LoadMediaByIdFailure:
            return {
                ...state,
                loading: false,
                error: action.error,
            };
        case fromMedia.MediaActionTypes.LoadMediaByOrgId:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case fromMedia.MediaActionTypes.LoadMediaByOrgIdSuccess:
            return {
                ...state,
                media: action.media,
                error: null,
                loading: false,
            };
        case fromMedia.MediaActionTypes.LoadMediaByOrgIdFailure:
            return {
                ...state,
                loading: false,
                error: action.error,
            };
        default:
            return state;
    }
}
