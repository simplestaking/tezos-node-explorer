import { State } from '@app/app.reducers';
import { StateMachine } from '@shared/types/state-machine/state-machine.type';
import { StateMachineActions, StateMachineActionTypes } from './state-machine.actions';

const initialState: StateMachine = {
  state: null,
  diagramBlocks: [],
  actions: [],
  activeAction: null,
  activeActionPosition: 0,
  isPlaying: false,
  stream: true,
  filters: {
    limit: 30,
    cursor: 0
  }
};

export function reducer(state: StateMachine = initialState, action: StateMachineActions): StateMachine {
  switch (action.type) {

    case StateMachineActionTypes.STATE_MACHINE_DIAGRAM_LOAD_SUCCESS: {
      return {
        ...state,
        diagramBlocks: [...action.payload]
      };
    }

    case StateMachineActionTypes.STATE_MACHINE_STATE_LOAD_SUCCESS: {
      return {
        ...state,
        state: { ...action.payload }
      };
    }

    case StateMachineActionTypes.STATE_MACHINE_ACTIONS_LOAD_SUCCESS: {
      // const activeBlock = state.diagramBlocks.find(b => b.status === 'active');
      // const activeProposalPosition = activeBlock ? action.payload.findIndex(p => p.stateId === activeBlock.id) : -1;
      return {
        ...state,
        actions: [...action.payload],
        // activeProposal: activeProposalPosition === -1 ? null : action.payload[activeProposalPosition],
        // activeProposalPosition
      };
    }

    case StateMachineActionTypes.STATE_MACHINE_SET_ACTIVE_ACTION: {
      // const diagramBlocks = state.diagramBlocks.map(block => ({ ...block }));
      // const nextActiveBlockId = diagramBlocks.findIndex(block => block.id === action.payload.stateId);

      // const previousBlockIds = state.proposals
      //   .slice(0, state.proposals.findIndex(p => p.stateId === action.payload.stateId))
      //   .map(p => p.stateId);
      // diagramBlocks
      //   .forEach(block => {
      //     block.status = previousBlockIds.includes(block.id) ? 'completed' : 'pending';
      //   });
      // diagramBlocks[nextActiveBlockId].status = 'active';

      return {
        ...state,
        activeAction: action.payload,
        activeActionPosition: state.actions.findIndex(p => p === action.payload),
        // diagramBlocks
      };
    }

    case StateMachineActionTypes.STATE_MACHINE_PAUSE_PLAYING: {
      return {
        ...state,
        isPlaying: false
      };
    }

    case StateMachineActionTypes.STATE_MACHINE_START_PLAYING: {
      return {
        ...state,
        isPlaying: true
      };
    }

    case StateMachineActionTypes.STATE_MACHINE_CLOSE: {
      return {
        ...initialState
      };
    }

    default:
      return state;
  }
}

export const selectStateMachine = (state: State) => state.stateMachine;
export const selectStateMachineDiagram = (state: State) => state.stateMachine.diagramBlocks;
export const selectStateMachineActiveAction = (state: State) => state.stateMachine.activeAction;
