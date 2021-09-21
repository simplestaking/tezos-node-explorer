import { StateMachineDiagramBlock } from './state-machine-diagram-block.type';
import { StateMachineProposal } from './state-machine-proposal.type';
import { StateMachineProposalTable } from './state-machine-proposal-table.type';

export interface StateMachine {
  state: any;
  diagramBlocks: StateMachineDiagramBlock[];
  // proposalTable: StateMachineProposalTable;
  proposals: StateMachineProposal[];
  activeProposal: StateMachineProposal;
  activeProposalPosition: number;
  isPlaying: boolean;
}
