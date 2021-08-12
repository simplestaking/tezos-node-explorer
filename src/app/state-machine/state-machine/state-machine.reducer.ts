import { State } from '../../app.reducers';
import { StateMachine } from '../../shared/types/state-machine/state-machine.type';
import { StateMachineActions, StateMachineActionTypes, StateMachineSetActiveProposal } from './state-machine.actions';

const initialState: StateMachine = {
  diagramBlocks: [],
  proposals: [],
  activeProposal: null,
};

export function reducer(state: StateMachine = initialState, action: StateMachineActions): StateMachine {
  switch (action.type) {
    case StateMachineActionTypes.STATE_MACHINE_DIAGRAM_LOAD_SUCCESS: {
      return {
        ...state,
        diagramBlocks: [...action.payload]
      };
    }
    case StateMachineActionTypes.STATE_MACHINE_PROPOSALS_LOAD_SUCCESS: {
      return {
        ...state,
        proposals: [...action.payload],
        activeProposal: action.payload[action.payload.length - 1]
      };
    }
    case StateMachineActionTypes.STATE_MACHINE_SET_ACTIVE_PROPOSAL: {
      const diagramBlocks = [...state.diagramBlocks.map((db) => ({ ...db }))];
      const nextActiveId = diagramBlocks.findIndex(db => db.id === action.payload.stateId);
      diagramBlocks.forEach((db, i) => {
        db.status = i > nextActiveId ? 'pending' : 'completed';
      });
      diagramBlocks[nextActiveId].status = 'active';

      return {
        ...state,
        activeProposal: action.payload,
        diagramBlocks
      };
    }
    default:
      return state;
  }
}

export const selectStateMachine = (state: State) => state.stateMachine;
export const selectStateMachineDiagram = (state: State) => state.stateMachine.diagramBlocks;
export const selectStateMachineProposals = (state: State) => state.stateMachine.proposals;
