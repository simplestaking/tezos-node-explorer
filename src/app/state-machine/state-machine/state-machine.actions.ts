import { Action } from '@ngrx/store';
import { StateMachineDiagramBlock } from '@shared/types/state-machine/state-machine-diagram-block.type';
import { StateMachineAction } from '@shared/types/state-machine/state-machine-action.type';

export enum StateMachineActionTypes {
  STATE_MACHINE_STATE_LOAD = 'STATE_MACHINE_STATE_LOAD',
  STATE_MACHINE_STATE_LOAD_SUCCESS = 'STATE_MACHINE_STATE_LOAD_SUCCESS',
  STATE_MACHINE_DIAGRAM_LOAD = 'STATE_MACHINE_DIAGRAM_LOAD',
  STATE_MACHINE_DIAGRAM_LOAD_SUCCESS = 'STATE_MACHINE_DIAGRAM_LOAD_SUCCESS',
  STATE_MACHINE_ACTIONS_LOAD = 'STATE_MACHINE_ACTIONS_LOAD',
  STATE_MACHINE_ACTIONS_LOAD_SUCCESS = 'STATE_MACHINE_ACTIONS_LOAD_SUCCESS',
  STATE_MACHINE_SET_ACTIVE_ACTION = 'STATE_MACHINE_SET_ACTIVE_ACTION',
  STATE_MACHINE_PAUSE_PLAYING = 'STATE_MACHINE_PAUSE_PLAYING',
  STATE_MACHINE_START_PLAYING = 'STATE_MACHINE_START_PLAYING',
  STATE_MACHINE_CLOSE = 'STATE_MACHINE_CLOSE',
}

export class StateMachineStateLoad implements Action {
  readonly type = StateMachineActionTypes.STATE_MACHINE_STATE_LOAD;
}

export class StateMachineStateLoadSuccess implements Action {
  readonly type = StateMachineActionTypes.STATE_MACHINE_STATE_LOAD_SUCCESS;

  constructor(public payload: any) { }
}

export class StateMachineDiagramLoad implements Action {
  readonly type = StateMachineActionTypes.STATE_MACHINE_DIAGRAM_LOAD;

  constructor(public payload: any) { }
}

export class StateMachineDiagramLoadSuccess implements Action {
  readonly type = StateMachineActionTypes.STATE_MACHINE_DIAGRAM_LOAD_SUCCESS;

  constructor(public payload: StateMachineDiagramBlock[]) { }
}

export class StateMachineProposalsLoad implements Action {
  readonly type = StateMachineActionTypes.STATE_MACHINE_ACTIONS_LOAD;

  constructor(public payload: any) { }
}

export class StateMachineActionsLoadSuccess implements Action {
  readonly type = StateMachineActionTypes.STATE_MACHINE_ACTIONS_LOAD_SUCCESS;

  constructor(public payload: StateMachineAction[]) { }
}

export class StateMachineSetActiveAction implements Action {
  readonly type = StateMachineActionTypes.STATE_MACHINE_SET_ACTIVE_ACTION;

  constructor(public payload: StateMachineAction) { }
}

export class StateMachineStopPlaying implements Action {
  readonly type = StateMachineActionTypes.STATE_MACHINE_PAUSE_PLAYING;
}

export class StateMachineStartPlaying implements Action {
  readonly type = StateMachineActionTypes.STATE_MACHINE_START_PLAYING;
}

export class StateMachineClose implements Action {
  readonly type = StateMachineActionTypes.STATE_MACHINE_CLOSE;
}

export type StateMachineActions = StateMachineStateLoad
  | StateMachineStateLoadSuccess
  | StateMachineDiagramLoad
  | StateMachineDiagramLoadSuccess
  | StateMachineProposalsLoad
  | StateMachineActionsLoadSuccess
  | StateMachineSetActiveAction
  | StateMachineStopPlaying
  | StateMachineStartPlaying
  | StateMachineClose
  ;
