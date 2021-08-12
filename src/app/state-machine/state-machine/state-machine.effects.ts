import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { State } from '../../app.reducers';
import { StateMachineActionTypes } from './state-machine.actions';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { ObservedValueOf } from 'rxjs';
import { StateMachineService } from './state-machine.service';

@Injectable()
export class StateMachineEffects {

  @Effect()
  StateMachineDiagramLoad$ = this.actions$.pipe(
    ofType(StateMachineActionTypes.STATE_MACHINE_DIAGRAM_LOAD),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => {
      return this.stateMachineService.getStateMachineDiagram();
    }),
    map((payload) => ({ type: StateMachineActionTypes.STATE_MACHINE_DIAGRAM_LOAD_SUCCESS, payload })),
  );

  @Effect()
  StateMachineProposalsLoad$ = this.actions$.pipe(
    ofType(StateMachineActionTypes.STATE_MACHINE_PROPOSALS_LOAD),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => {
      return this.stateMachineService.getStateMachineProposals();
    }),
    map((payload) => ({ type: StateMachineActionTypes.STATE_MACHINE_PROPOSALS_LOAD_SUCCESS, payload })),
  );

  constructor(private actions$: Actions,
              private store: Store<State>,
              private stateMachineService: StateMachineService) { }

}
