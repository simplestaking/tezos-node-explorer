import { StateMachineDiagramBlock } from './state-machine-diagram-block.type';
import { StateMachineProposal } from './state-machine-proposal.type';

export interface StateMachine {
  diagramBlocks: StateMachineDiagramBlock[];
  proposals: StateMachineProposal[];
  activeProposal: StateMachineProposal;
}
