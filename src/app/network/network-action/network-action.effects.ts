import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { catchError, map, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { forkJoin, ObservedValueOf, of, Subject, timer } from 'rxjs';
import { State } from '../../app.reducers';
import { ErrorActionTypes } from '../../shared/error-popup/error-popup.actions';

const networkActionDestroy$ = new Subject();

@Injectable()
export class NetworkActionEffects {

  @Effect()
  NetworkActionLoad$ = this.actions$.pipe(
    ofType('NETWORK_ACTION_LOAD'),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => {
      return this.http.get(setUrl(action, state));
    }),
    map((network) => ({ type: 'NETWORK_ACTION_LOAD_SUCCESS', payload: { network } })),
    catchError((error, caught) => {
      console.error(error);
      this.store.dispatch({
        type: ErrorActionTypes.ADD_ERROR,
        payload: { title: 'Error when loading Network:', message: error.message }
      });
      return caught;
    })
  );

  @Effect()
  NetworkActionLoadByTime$ = this.actions$.pipe(
    ofType('NETWORK_ACTION_TIME_LOAD'),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    tap(() => networkActionDestroy$.next()),
    switchMap(({ action, state }) => {
      const urlBackward = setUrl(action, state) + networkActionTimestamp(action, 'backward');
      const urlForward = setUrl(action, state) + networkActionTimestamp(action, 'forward');

      return forkJoin([
        this.http.get<any[]>(urlBackward),
        this.http.get<any[]>(urlForward, { reportProgress: true })
      ]).pipe(
        map(([backwardSlice, forwardSlice]) => ({
          type: 'NETWORK_ACTION_LOAD_SUCCESS',
          payload: {
            timestamp: action.payload.timestamp,
            network: [...forwardSlice.reverse(), ...backwardSlice]
          }
        }))
      );
    }),
    catchError((error, caught) => {
      console.error(error);
      this.store.dispatch({
        type: ErrorActionTypes.ADD_ERROR,
        payload: { title: 'Error when loading Network by time:', message: error.message }
      });
      return caught;
    })
  );

  @Effect()
  NetworkActionFilter$ = this.actions$.pipe(
    ofType('NETWORK_ACTION_FILTER'),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    tap(response => {
      networkActionDestroy$.next();
      networkActionFilter(response.action, response.state);
    }),
    map((payload) => ({ type: 'NETWORK_ACTION_LOAD', payload })),
    catchError((error, caught) => {
      console.error(error);
      this.store.dispatch({
        type: ErrorActionTypes.ADD_ERROR,
        payload: { title: 'Error when loading Network with filters:', message: error.message }
      });
      return caught;
    })
  );

  @Effect()
  NetworkActionAddress$ = this.actions$.pipe(
    ofType('NETWORK_ACTION_ADDRESS'),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    tap(response => {
      networkActionDestroy$.next();
      networkActionFilter(response.action, response.state);
    }),
    map((payload) => ({ type: 'NETWORK_ACTION_LOAD', payload })),
    catchError((error, caught) => {
      console.error(error);
      this.store.dispatch({
        type: ErrorActionTypes.ADD_ERROR,
        payload: { title: 'Error when loading Network by address:', message: error.message }
      });
      return caught;
    })
  );

  @Effect()
  NetworkActionStartEffect$ = this.actions$.pipe(
    ofType('NETWORK_ACTION_START'),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) =>
      timer(0, 2000).pipe(
        takeUntil(networkActionDestroy$),
        switchMap(() =>
          this.http.get<any[]>(setUrl(action, state)).pipe(
            map(network => ({ type: 'NETWORK_ACTION_START_SUCCESS', payload: { network } })),
            catchError(error => of({
              type: ErrorActionTypes.ADD_ERROR,
              payload: { title: 'Error when loading Network:', message: error.message }
            }))
          )
        )
      )
    )
  );

  @Effect()
  NetworkActionDetailsLoad$ = this.actions$.pipe(
    ofType('NETWORK_ACTION_DETAILS_LOAD'),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => {
      return this.http.get(setDetailsUrl(action, state));
    }),
    map((payload) => ({ type: 'NETWORK_ACTION_DETAILS_LOAD_SUCCESS', payload })),
    catchError((error, caught) => {
      console.error(error);
      this.store.dispatch({
        type: 'NETWORK_ACTION_DETAILS_LOAD_ERROR',
        payload: error
      });
      return caught;
    })
  );

  @Effect({ dispatch: false })
  NetworkActionStopEffect$ = this.actions$.pipe(
    ofType('NETWORK_ACTION_STOP'),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    tap(({ action, state }) => networkActionDestroy$.next())
  );

  constructor(private http: HttpClient,
              private actions$: Actions,
              private store: Store<State>) { }

}

export function setUrl(action, state) {
  const url = `${state.settingsNode.activeNode.features.find(f => f.name === 'debugger').url}/v2/p2p?node_name=${state.settingsNode.activeNode.p2p_port}&`;
  const cursor = networkActionCursor(action);
  const filters = networkActionFilter(action, state);
  const limit = networkActionLimit(action);

  return `${url}${filters.length ? `${filters}&` : ''}${cursor.length ? `${cursor}&` : ''}${limit}`;
}

export function networkActionTimestamp(action, direction: string): string {
  return action.payload && action.payload.timestamp
    ? `&timestamp=${action.payload.timestamp}&direction=${direction}`
    : '';
}

export function setDetailsUrl(action, state) {
  return `${state.settingsNode.activeNode.features.find(f => f.name === 'debugger').url}/v2/p2p/${action.payload.originalId}?node_name=${state.settingsNode.activeNode.p2p_port}`;
}

// use limit to load just the necessary number of records
export function networkActionLimit(action) {
  const limitNr = action.payload && action.payload.limit ?
    action.payload.limit :
    '1000';

  return `limit=${limitNr}`;
}

// use cursor to load previous pages
export function networkActionCursor(action) {
  return action.payload && action.payload.cursor_id ?
    `cursor=${action.payload.cursor_id}` :
    '';
}

// filter network action
export function networkActionFilter(action, state) {
  let filterType = '';

  if (state.networkAction && state.networkAction.filter) {
    const stateFilter = state.networkAction.filter;

    filterType = stateFilter.meta ? filterType + 'metadata,' : filterType;
    filterType = stateFilter.connection ? filterType + 'connection_message,' : filterType;
    filterType = stateFilter.acknowledge ? filterType + 'ack_message,' : filterType;
    filterType = stateFilter.bootstrap ? filterType + 'bootstrap,' : filterType;
    filterType = stateFilter.advertise ? filterType + 'advertise,' : filterType;
    filterType = stateFilter.swap ? filterType + 'swap_request,swap_ack,' : filterType;
    filterType = stateFilter.deactivate ? filterType + 'deactivate,' : filterType;

    filterType = stateFilter.protocol ? filterType + 'get_protocols,protocol,' : filterType;
    filterType = stateFilter.operation ? filterType + 'get_operations,operation,' : filterType;
    filterType = stateFilter.currentHead ? filterType + 'get_current_head,current_head,' : filterType;
    filterType = stateFilter.currentBranch ? filterType + 'get_current_branch,current_branch,' : filterType;
    filterType = stateFilter.blockHeaders ? filterType + 'get_block_headers,block_header,' : filterType;
    filterType = stateFilter.blockOperations ? filterType + 'get_operations_for_blocks,operations_for_blocks,' : filterType;
    filterType = stateFilter.blockOperationsHashes ? filterType + 'get_operation_hashes_for_blocks,operation_hashes_for_block,' : filterType;
    // remove the last ,
    filterType = filterType.length > 0 ? 'types=' + filterType.slice(0, -1) : '';

    filterType = filterType + (stateFilter.local && !stateFilter.remote ?
      (filterType.length > 0 ? '&source_type=local' : 'source_type=local') :
      !stateFilter.local && stateFilter.remote ? filterType.length > 0 ? '&source_type=remote' : 'source_type=remote' : '');
  }
  // add remote_addr filter
  filterType = filterType + (state.networkAction.urlParams.length ?
    ((filterType.length > 0 ? '&remote_addr=' : 'remote_addr=') + state.networkAction.urlParams) :
    '');

  return filterType;
}
