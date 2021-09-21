import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { StateMachineActionTypes } from './state-machine.actions';
import { map, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { ObservedValueOf, Subject, timer } from 'rxjs';
import { StateMachineService } from './state-machine.service';
import { StateMachineProposal } from '@shared/types/state-machine/state-machine-proposal.type';

@Injectable({ providedIn: 'root' })
export class StateMachineEffects {

  private playSubject$ = new Subject<void>();

  stateMachineStateLoad$ = createEffect(() => this.actions$.pipe(
    ofType(StateMachineActionTypes.STATE_MACHINE_STATE_LOAD),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) =>
      this.stateMachineService.getStateMachineState()
    ),
    map((payload: any) => ({ type: StateMachineActionTypes.STATE_MACHINE_STATE_LOAD_SUCCESS, payload })),
  ));

  stateMachineDiagramLoad$ = createEffect(() => this.actions$.pipe(
    ofType(StateMachineActionTypes.STATE_MACHINE_DIAGRAM_LOAD),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => {
      return this.stateMachineService.getStateMachineDiagram();
    }),
    map((payload) => ({ type: StateMachineActionTypes.STATE_MACHINE_DIAGRAM_LOAD_SUCCESS, payload })),
  ));

  stateMachineProposalsLoad$ = createEffect(() => this.actions$.pipe(
    ofType(StateMachineActionTypes.STATE_MACHINE_PROPOSALS_LOAD),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => {
      return this.stateMachineService.getStateMachineProposals();
    }),
    map((payload: StateMachineProposal[]) => ({ type: StateMachineActionTypes.STATE_MACHINE_PROPOSALS_LOAD_SUCCESS, payload })),
  ));

  stateMachinePlay$ = createEffect(() => this.actions$.pipe(
    ofType(StateMachineActionTypes.STATE_MACHINE_START_PLAYING),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => {
      this.playSubject$ = new Subject<void>();
      let currentPosition = state.stateMachine.activeProposalPosition;

      return timer(0, 1000)
        .pipe(
          takeUntil(this.playSubject$),
          map(() => {
            currentPosition++;
            return state.stateMachine.proposals[currentPosition];
          })
        );
    }),
    map(payload => (
      payload
        ? { type: StateMachineActionTypes.STATE_MACHINE_SET_ACTIVE_PROPOSAL, payload }
        : { type: StateMachineActionTypes.STATE_MACHINE_PAUSE_PLAYING }
    )),
  ));

  stateMachineStop$ = createEffect(() => this.actions$.pipe(
    ofType(StateMachineActionTypes.STATE_MACHINE_PAUSE_PLAYING),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    tap(({ action, state }) => this.playSubject$.next(null))
  ), { dispatch: false });

  stateMachineClose$ = createEffect(() => this.actions$.pipe(
    ofType(StateMachineActionTypes.STATE_MACHINE_CLOSE),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    tap(({ action, state }) => {
      this.playSubject$.next(null);
      this.playSubject$.complete();
    })
  ), { dispatch: false });

  constructor(private actions$: Actions,
              private store: Store<State>,
              private stateMachineService: StateMachineService) { }

}
