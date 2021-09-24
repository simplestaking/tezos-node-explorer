import { StateMachineDiagramBlock } from './state-machine-diagram-block.type';
import { StateMachineAction } from './state-machine-action.type';
import { StateMachineProposalTable } from './state-machine-action-table.type';
import { StateMachineFilters } from '@shared/types/state-machine/state-machine-filters.type';

export interface StateMachine {
  state: any;
  diagramBlocks: StateMachineDiagramBlock[];
  // actionTable: StateMachineProposalTable;
  actions: StateMachineAction[];
  activeAction: StateMachineAction;
  activeActionPosition: number;
  isPlaying: boolean;
  stream: boolean;
  filters: StateMachineFilters;
}
