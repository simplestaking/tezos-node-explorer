import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { catchError, map, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { forkJoin, ObservedValueOf, of, Subject, timer } from 'rxjs';
import { State } from '../../app.reducers';
import { ErrorActionTypes } from '../../shared/error-popup/error-popup.actions';

const logActionDestroy$ = new Subject();

@Injectable()
export class LogsActionEffects {

  @Effect()
  LogsActionLoad$ = this.actions$.pipe(
    ofType('LOGS_ACTION_LOAD'),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => {
      return this.http.get<any[]>(setUrl(action, state));
    }),
    map((logs) => ({ type: 'LOGS_ACTION_LOAD_SUCCESS', payload: { logs } })),
    catchError((error, caught) => {
      console.error(error);
      this.store.dispatch({
        type: ErrorActionTypes.ADD_ERROR,
        payload: { title: 'Error when loading Logs:', message: error.message }
      });
      return caught;
    })
  );

  @Effect()
  LogsActionLoadByTime$ = this.actions$.pipe(
    ofType('LOGS_ACTION_TIME_LOAD'),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    tap(() => logActionDestroy$.next()),
    switchMap(({ action, state }) => {
      const urlBackward = setUrl(action, state) + logsActionTimestamp(action, 'backward');
      const urlForward = setUrl(action, state) + logsActionTimestamp(action, 'forward');

      return forkJoin([
        this.http.get<any[]>(urlBackward),
        this.http.get<any[]>(urlForward, { reportProgress: true })
      ]).pipe(
        map(([backwardSlice, forwardSlice]) => ({
          type: 'LOGS_ACTION_LOAD_SUCCESS',
          payload: {
            timestamp: action.payload.timestamp,
            logs: [...forwardSlice.reverse(), ...backwardSlice]
          }
        }))
      );
    }),
    catchError((error, caught) => {
      console.error(error);
      this.store.dispatch({
        type: ErrorActionTypes.ADD_ERROR,
        payload: { title: 'Error when loading Logs by time:', message: error.message }
      });
      return caught;
    })
  );

  @Effect()
  LogsActionFilter$ = this.actions$.pipe(
    ofType('LOGS_ACTION_FILTER'),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    tap(response => {
      logActionDestroy$.next();
      logsActionFilter(response.action, response.state);
    }),
    map((payload) => ({ type: 'LOGS_ACTION_LOAD', payload })),
    catchError((error, caught) => {
      console.error(error);
      this.store.dispatch({
        type: ErrorActionTypes.ADD_ERROR,
        payload: { title: 'Error when loading Logs with filters:', message: error.message }
      });
      return caught;
    })
  );

  @Effect()
  LogsActionStartEffect$ = this.actions$.pipe(
    ofType('LOGS_ACTION_START'),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) =>
      timer(0, 2000).pipe(
        takeUntil(logActionDestroy$),
        switchMap(() =>
          this.http.get<any[]>(setUrl(action, state)).pipe(
            map(logs => ({ type: 'LOGS_ACTION_START_SUCCESS', payload: { logs } })),
            catchError(error => of({
              type: ErrorActionTypes.ADD_ERROR,
              payload: { title: 'Error when loading Logs:', message: error.message }
            }))
          )
        )
      )
    )
  );

  @Effect({ dispatch: false })
  LogsActionStopEffect$ = this.actions$.pipe(
    ofType('LOGS_ACTION_STOP'),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    tap(({ action, state }) => logActionDestroy$.next())
  );

  constructor(private http: HttpClient,
              private actions$: Actions,
              private store: Store<State>) { }

}

export function setUrl(action, state): string {
  const url = `${state.settingsNode.activeNode.features.find(f => f.name === 'debugger').url}/v2/log?node_name=${state.settingsNode.activeNode.p2p_port}&`;

  const limit = logsActionLimit(action);
  const query = logsActionQuery(action);
  if (query) {
    return `${url}${query}&${limit}`;
  }

  const filters = logsActionFilter(action, state);
  const cursor = logsActionCursor(action);


  return `${url}${filters.length ? `${filters}&` : ''}${cursor.length ? `${cursor}&` : ''}${limit}`;
}

export function logsActionQuery(action): string {
  return action.payload && action.payload.query
    ? `query="${action.payload.query}"`
    : '';
}

export function logsActionTimestamp(action, direction: string): string {
  return action.payload && action.payload.timestamp
    ? `&timestamp=${action.payload.timestamp}&direction=${direction}`
    : '';
}

// use limit to load just the necessary number of records
export function logsActionLimit(action) {
  const limitNr = action.payload && action.payload.limit ?
    action.payload.limit :
    '1000';

  return `limit=${limitNr}`;
}

// use cursor to load previous pages
export function logsActionCursor(action) {
  return action.payload && action.payload.cursor_id ?
    `cursor=${action.payload.cursor_id}` :
    '';
}

// filter logs action
export function logsActionFilter(action, state) {
  let filterType = '';

  if (state.logsAction && state.logsAction.filter) {
    const stateFilter = state.logsAction.filter;

    filterType = stateFilter.trace ? filterType + 'trace,' : filterType;
    filterType = stateFilter.debug ? filterType + 'debug,' : filterType;
    filterType = stateFilter.info ? filterType + 'info,' : filterType;
    filterType = stateFilter.notice ? filterType + 'notice,' : filterType;
    filterType = stateFilter.warning ? filterType + 'warning,' : filterType;
    filterType = stateFilter.error ? filterType + 'error,' : filterType;
    filterType = stateFilter.fatal ? filterType + 'fatal,' : filterType;

    // remove the last ,
    filterType = filterType.length > 0 ? 'log_level=' + filterType.slice(0, -1) : '';
  }

  return filterType;
}
