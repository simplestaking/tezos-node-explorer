import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { forkJoin, ObservedValueOf, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { StorageResourcesActionTypes } from './storage-resources.actions';
import { State } from '../../app.reducers';
import { StorageResourceService } from './storage-resource.service';
import { StorageResourcesStats } from '../../shared/types/resources/storage/storage-resources-stats.type';
import { ErrorActionTypes } from '../../shared/error-popup/error-popup.actions';

@Injectable({ providedIn: 'root' })
export class StorageResourcesEffects {

  @Effect()
  ResourcesCheckAvailableContextsEffect$ = this.actions$.pipe(
    ofType(StorageResourcesActionTypes.STORAGE_RESOURCES_CHECK_AVAILABLE_CONTEXTS),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) =>
      forkJoin(
        action.payload.map((context: string) => this.storageResourcesService.checkStorageResourcesContext(state.settingsNode.activeNode.http, context))
      ).pipe(
        map((result: any[]) => result.map((contextResponse, index: number) => contextResponse.operationsContext.length ? action.payload[index] : null).filter(Boolean))
      )
    ),
    switchMap(availableContexts => !availableContexts.length ? [] : [
      { type: StorageResourcesActionTypes.STORAGE_RESOURCES_LOAD, payload: availableContexts[0] },
      { type: StorageResourcesActionTypes.STORAGE_RESOURCES_MAP_AVAILABLE_CONTEXTS, payload: availableContexts }
    ]),
    catchError(error => of({ type: ErrorActionTypes.ADD_ERROR, payload: { title: 'Storage resources error', message: error.message } }))
  );

  @Effect()
  ResourcesLoadEffect$ = this.actions$.pipe(
    ofType(StorageResourcesActionTypes.STORAGE_RESOURCES_LOAD),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) =>
      this.storageResourcesService.getStorageResources(state.settingsNode.activeNode.http, action.payload)
        .pipe(
          map((stats: StorageResourcesStats) => ({ type: StorageResourcesActionTypes.STORAGE_RESOURCES_LOAD_SUCCESS, payload: stats })),
        ))
  );

  constructor(private storageResourcesService: StorageResourceService,
              private actions$: Actions,
              private store: Store<State>) { }
}
