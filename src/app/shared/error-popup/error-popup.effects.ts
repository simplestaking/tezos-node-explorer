import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { skip, switchMap, withLatestFrom } from 'rxjs/operators';
import { ObservedValueOf, of, timer } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '../../app.reducers';
import { ErrorActionTypes } from './error-popup.actions';

@Injectable({ providedIn: 'root' })
export class ErrorPopupEffects {

  @Effect()
  ClearErrorsEffect$ = this.actions$.pipe(
    ofType(ErrorActionTypes.SCHEDULE_ERROR_DELETION),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) =>
      timer(0, 20000)
        .pipe(
          skip(1),
          switchMap(() => of({ type: ErrorActionTypes.REMOVE_ERRORS }))
        ))
  );

  constructor(private actions$: Actions,
              private store: Store<State>) { }
}
