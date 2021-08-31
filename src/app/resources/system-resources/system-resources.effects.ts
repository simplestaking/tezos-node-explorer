import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { ObservedValueOf, of, Subject, timer } from 'rxjs';
import { Store } from '@ngrx/store';
import { SystemResourcesActionTypes } from './system-resources.actions';
import { SystemResourcesService } from './system-resources.service';
import { SystemResources } from '@shared/types/resources/system/system-resources.type';
import { State } from '@app/app.reducers';
import { ErrorActionTypes } from '@shared/error-popup/error-popup.actions';

@Injectable({ providedIn: 'root' })
export class SystemResourcesEffects {

  private resourcesDestroy$ = new Subject<void>();

  ResourcesLoadEffect$ = createEffect(() => this.actions$.pipe(
    ofType(SystemResourcesActionTypes.SYSTEM_RESOURCES_LOAD),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => {
      const url = state.settingsNode.activeNode.features
        .find(c => c.name === 'resources/system').monitoringUrl;
      const resourcesData$ = this.resourcesService.getSystemResources(url, action.payload.isSmallDevice)
        .pipe(
          map((resources: SystemResources) => ({
            type: SystemResourcesActionTypes.SYSTEM_RESOURCES_LOAD_SUCCESS,
            payload: resources
          })),
          catchError(error => of({ type: ErrorActionTypes.ADD_ERROR, payload: { title: 'System resources error', message: error.message } }))
        );

      if (action.payload && action.payload.initialLoad) {
        return resourcesData$;
      }

      this.resourcesDestroy$ = new Subject<void>();

      return timer(0, 60000)
        .pipe(
          takeUntil(this.resourcesDestroy$),
          switchMap(() => resourcesData$)
        );
    })
  ));

  ResourcesCloseEffect$ = createEffect(() => this.actions$.pipe(
    ofType(SystemResourcesActionTypes.SYSTEM_RESOURCES_CLOSE),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    tap(({ action, state }) => {
      this.resourcesDestroy$.next(null);
      this.resourcesDestroy$.complete();
    })
  ), { dispatch: false });

  constructor(private resourcesService: SystemResourcesService,
              private actions$: Actions,
              private store: Store<State>) { }
}
