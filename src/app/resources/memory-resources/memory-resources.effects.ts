import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { ObservedValueOf, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '../../app.reducers';
import { MemoryResourcesActionTypes } from './memory-resources.actions';
import { MemoryResourcesService } from './memory-resources.service';
import { MemoryResource } from '../../shared/types/resources/memory/memory-resource.type';
import { ErrorActionTypes } from '../../shared/error-popup/error-popup.actions';

@Injectable({ providedIn: 'root' })
export class MemoryResourcesEffects {

  @Effect()
  ResourcesLoadEffect$ = this.actions$.pipe(
    ofType(MemoryResourcesActionTypes.MEMORY_RESOURCES_LOAD),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) =>
      this.resourcesService.getStorageResources(
        state.settingsNode.activeNode.features.find(f => f.name === 'resources/memory').memoryProfilerUrl,
        action.payload.reversed
      ).pipe(
        map((resource: MemoryResource) => ({
          type: MemoryResourcesActionTypes.MEMORY_RESOURCES_LOAD_SUCCESS,
          payload: resource
        })),
        catchError(error => of({ type: ErrorActionTypes.ADD_ERROR, payload: { title: 'Memory resources error', message: error.message } }))
      )
    )
  );

  constructor(private resourcesService: MemoryResourcesService,
              private actions$: Actions,
              private store: Store<State>) { }
}
