import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { catchError, map, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { combineLatest, ObservedValueOf, of, Subject, timer } from 'rxjs';
import { State } from '../../app.reducers';
import { StorageBlockService } from './storage-block.service';
import { ErrorActionTypes } from '../../shared/error-popup/error-popup.actions';
import { StorageBlockActionTypes } from './storage-block.actions';


@Injectable()
export class StorageBlockEffects {

  private storageBlockDestroy$ = new Subject();

  @Effect()
  StorageBlockReset$ = this.actions$.pipe(
    ofType('STORAGE_BLOCK_RESET', 'STORAGE_BLOCK_LOAD'),
    // dispatch action
    map((payload) => ({ type: 'STORAGE_BLOCK_RESET_SUCCESS', payload })),
    catchError((error, caught) => {
      console.error(error);
      this.store.dispatch({
        type: 'STORAGE_BLOCK_RESET_ERROR',
        payload: error
      });
      return caught;
    })
  );

  @Effect()
  StorageBlockLoad$ = this.actions$.pipe(
    ofType('STORAGE_BLOCK_FETCH'),

    // merge state
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => {
      return this.http.get(setUrl(action, state));
    }),

    // dispatch action
    map((payload) => ({ type: 'STORAGE_BLOCK_FETCH_SUCCESS', payload })),
    catchError((error, caught) => {
      console.error(error);
      this.store.dispatch({
        type: 'STORAGE_BLOCK_FETCH_ERROR',
        payload: error
      });
      return caught;
    })
  );

  @Effect()
  StorageBlockStartEffect$ = this.actions$.pipe(
    ofType('STORAGE_BLOCK_START'),

    // merge state
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),

    switchMap(({ action, state }) =>

      // get header data every 30 seconds
      timer(0, 30000).pipe(
        takeUntil(this.storageBlockDestroy$),
        switchMap(() =>
          this.http.get(setUrl(action, state), { reportProgress: true }).pipe(
            map(response => ({ type: 'STORAGE_BLOCK_START_SUCCESS', payload: response })),
            catchError(error => of({ type: 'STORAGE_BLOCK_START_ERROR', payload: error }))
          )
        )
      )
    )
  );

  @Effect()
  StorageBlockStartSuccessEffect$ = this.actions$.pipe(
    ofType('STORAGE_BLOCK_START_SUCCESS'),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    map(({ action, state }) => ({ type: StorageBlockActionTypes.STORAGE_BLOCK_CHECK_AVAILABLE_CONTEXTS }))
  );

  @Effect()
  StorageBlockGetNextBlockDetailsEffect$ = this.actions$.pipe(
    ofType('STORAGE_BLOCK_NEIGHBOUR_BLOCK_DETAILS'),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    map(({ action, state }) => {
      const currentHash = state.storageBlock.selected.hash;
      const entities = Object.keys(state.storageBlock.entities).map(key => state.storageBlock.entities[key]);
      const currentBlockIndex = entities.findIndex(block => block.hash === currentHash);
      if (currentBlockIndex !== -1) {
        return {
          type: 'STORAGE_BLOCK_DETAILS_LOAD',
          payload: {
            hash: entities[currentBlockIndex + action.payload.neighbourIndex].hash,
            context: 'tezedge'
          }
        };
      }
      return;
    })
  );

  // stop storage block download
  @Effect({ dispatch: false })
  StorageBlockStopEffect$ = this.actions$.pipe(
    ofType('STORAGE_BLOCK_STOP'),
    // merge state
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    // init app modules
    tap(({ action, state }) => {
      this.storageBlockDestroy$.next();
    })
  );

  @Effect()
  StorageBlockCheckAvailableContextsEffect$ = this.actions$.pipe(
    ofType(StorageBlockActionTypes.STORAGE_BLOCK_CHECK_AVAILABLE_CONTEXTS),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) =>
      this.storageBlockService.checkStorageBlockAvailableContexts(state.settingsNode.activeNode.http, state.storageBlock.entities[0].hash)
        .pipe(map((contexts: string[]) => ({ type: StorageBlockActionTypes.STORAGE_BLOCK_MAP_AVAILABLE_CONTEXTS, payload: contexts })))
    ),
    catchError(error => of({ type: ErrorActionTypes.ADD_ERROR, payload: { title: 'Storage block details error', message: error.message } }))
  );

  @Effect()
  StorageBlockDetailsLoad$ = this.actions$.pipe(
    ofType('STORAGE_BLOCK_DETAILS_LOAD'),

    // merge state
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => {
      return combineLatest(
        this.http.get(setDetailsUrl(action, state)),
        this.storageBlockService.getStorageBlockContextDetails(state.settingsNode.activeNode.http, action.payload.hash, action.payload.context),
      );
    }),

    // dispatch action
    map((response) => {
      const payload = {
        selected: response[0],
        blockDetails: response[1]
      };
      return ({ type: 'STORAGE_BLOCK_DETAILS_LOAD_SUCCESS', payload });
    }),
    catchError((error, caught) => {
      console.error(error);
      this.store.dispatch({
        type: 'STORAGE_BLOCK_DETAILS_LOAD_ERROR',
        payload: error
      });
      return caught;
    })
  );

  constructor(
    private http: HttpClient,
    private actions$: Actions,
    private store: Store<State>,
    private storageBlockService: StorageBlockService,
  ) {
  }

}

export function setUrl(action, state) {
  const url = state.settingsNode.activeNode.http + '/dev/chains/main/blocks/?';
  const cursor = storageBlockCursor(action);
  const filters = ''; // use it when we need to filter the list
  const limit = storageBlockLimit(action);

  return `${url}${filters.length ? `${filters}&` : ''}${cursor.length ? `${cursor}&` : ''}${limit}`;
}

// use limit to load just the necessary number of records
export function storageBlockLimit(action) {
  const limitNr = action.payload && action.payload.limit ?
    action.payload.limit :
    '1000';

  return `limit=${limitNr}`;
}

// use cursor to load previous pages
export function storageBlockCursor(action) {
  return action.payload && action.payload.cursor_id ?
    `from_block_id=${action.payload.cursor_id}` :
    '';
}

export function setDetailsUrl(action, state) {
  return state.settingsNode.activeNode.http + '/chains/main/blocks/' + action.payload.hash;
}
