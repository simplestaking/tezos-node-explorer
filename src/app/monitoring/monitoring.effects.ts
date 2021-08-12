import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BehaviorSubject, empty, interval, ObservedValueOf, of, Subject } from 'rxjs';
import { catchError, filter, flatMap, map, startWith, switchMap, takeUntil, withLatestFrom } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { HttpClient } from '@angular/common/http';
import { State } from '../app.reducers';
import { SettingsNodeService } from '../settings/settings-node/settings-node.service';
import { SettingsNodeEntityHeader } from '../shared/types/settings-node/settings-node-entity-header.type';
import { ErrorActionTypes } from '../shared/error-popup/error-popup.actions';
import { Router } from '@angular/router';
import { MonitoringActionTypes } from './monitoring.actions';
import { AnonymousSubject } from 'rxjs/internal-compatibility';

let wsCounter = 0;

@Injectable()
export class MonitoringEffects {

  private websocketDestroy$: Subject<void>;
  private networkDestroy$: Subject<void>;
  private networkInterval$: BehaviorSubject<number> = new BehaviorSubject(1);
  private webSocketConnection$: AnonymousSubject<any>;

  @Effect()
  MonitoringLoadEffect$ = this.actions$.pipe(
    ofType(MonitoringActionTypes.MONITORING_LOAD, 'APP_REFRESH', 'APP_INIT_SUCCESS'),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => {

      const isMonitoringPage = this.router.url.replace('/', '').split('/')[0] === 'monitoring';

      if (isMonitoringPage && action.type === 'APP_INIT_SUCCESS') {
        return empty();
      }

      const lazyCalls = !isMonitoringPage;
      const actions = [];

      if (this.networkDestroy$) {
        this.networkDestroy$.next();
        this.networkDestroy$.complete();
      }
      if (this.websocketDestroy$) {
        this.websocketDestroy$.next();
        this.websocketDestroy$.complete();
        this.webSocketConnection$.unsubscribe();
      }

      if (state.settingsNode.activeNode.features.some(f => f.name === 'ws')) {
        this.websocketDestroy$ = new Subject<void>();
        actions.push({ type: 'NETWORK_WEBSOCKET_LOAD', payload: { lazyCalls } });
      } else {
        this.networkDestroy$ = new Subject<void>();
        this.networkInterval$.next(lazyCalls ? 5 : 1);

        actions.push({ type: 'NETWORK_STATS_LOAD', payload: { lazyCalls } });
        actions.push({ type: 'NETWORK_PEERS_LOAD', payload: { lazyCalls } });
      }
      return actions;
    })
  );

  @Effect()
  MonitoringCloseEffect$ = this.actions$.pipe(
    ofType(MonitoringActionTypes.MONITORING_CLOSE),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    flatMap(({ action, state }) => {
      if (!state.settingsNode.activeNode.features.some(f => f.name === 'ws')) {
        this.networkInterval$.next(5);
        return empty();
      } else {
        this.websocketDestroy$.next();
        return of({ type: 'NETWORK_WEBSOCKET_LOAD', payload: { lazyCalls: true } });
      }
    })
  );

  // load network stats
  @Effect()
  NetworkStatsLoadEffect$ = this.actions$.pipe(
    ofType('NETWORK_STATS_LOAD'),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => {
      const headerData$ = this.settingsNodeService.getSettingsHeader(state.settingsNode.activeNode.http)
        .pipe(
          map((response: SettingsNodeEntityHeader) => ({ type: 'NETWORK_STATS_LOAD_SUCCESS', payload: response })),
          catchError(error => of({ type: 'NETWORK_STATS_LOAD_ERROR', payload: error })),
        );

      return this.networkInterval$.pipe(
        switchMap(value => interval(value * 1000)
          .pipe(
            startWith(1),
            takeUntil(this.networkDestroy$)
          )
        ),
        switchMap(() => headerData$)
      );
    }),
  );

  // load network peers
  @Effect()
  NetworkPeersLoadEffect$ = this.actions$.pipe(
    ofType('NETWORK_PEERS_LOAD'),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => {

      const peersData$ = this.http.get(state.settingsNode.activeNode.http + '/network/peers').pipe(
        map(response => ({ type: 'NETWORK_PEERS_LOAD_SUCCESS', payload: response })),
        catchError(error => of({ type: 'NETWORK_PEERS_LOAD_ERROR', payload: error })),
      );

      return this.networkInterval$.pipe(
        switchMap(value => interval(value * 1000)
          .pipe(
            startWith(1),
            takeUntil(this.networkDestroy$)
          )
        ),
        switchMap(() => peersData$)
      );
    }),
  );

  @Effect()
  NetworkWebsocketLoadEffect$ = this.actions$.pipe(
    ofType('NETWORK_WEBSOCKET_LOAD'),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => {
      if (!state.settingsNode.activeNode.features.some(f => f.name === 'ws')) {
        return empty();
      }

      wsCounter = 0;
      this.webSocketConnection$ = webSocket({
        url: state.settingsNode.activeNode.features.find(f => f.name === 'ws').url,
        WebSocketCtor: WebSocket,
      }) as WebSocketSubject<any>;

      return this.webSocketConnection$.pipe(
        takeUntil(this.websocketDestroy$),
        filter((data: any) => {
          // even if ws is turned off update state cca 5 sec
          wsCounter = wsCounter < 10 ? wsCounter + 1 : 0;

          // ignore ws when we got all 5 type of actions from the backend
          // (this case is only if we are on another route than monitoring)
          const lazyCalls = action.payload && action.payload.lazyCalls;
          if (lazyCalls && wsCounter > 2) {
            return false;
          }
          return state.monitoring.open || wsCounter < 3;
        }),
      );
    }),
    switchMap((wsArrayMessage: any[]) => {
      if (wsArrayMessage.length === 4) {
        const historyPayload = {
          blocks: wsArrayMessage[1].payload,
          chain: wsArrayMessage[3].payload.chain
        };
        const statsPayload = { ...wsArrayMessage[0].payload, ...wsArrayMessage[2].payload };
        return [
          { type: 'WS_NETWORK_HISTORY_LOAD', payload: historyPayload },
          { type: 'WS_NETWORK_STATS_LOAD', payload: statsPayload },
        ];
      } else if (Array.isArray(wsArrayMessage[0].payload)) {
        wsArrayMessage[0].type = 'WS_NETWORK_PEERS_LOAD_SUCCESS';
        return wsArrayMessage;
      }
      return [];
    }),
    catchError((error, caught) => {
      console.error(error);
      this.store.dispatch({
        type: ErrorActionTypes.ADD_ERROR,
        payload: { title: 'Websocket error', message: 'Connection failed' }
      });
      return caught;
    }),
  );

  constructor(
    private http: HttpClient,
    private actions$: Actions,
    private store: Store<State>,
    private router: Router,
    private settingsNodeService: SettingsNodeService,
  ) { }

}
