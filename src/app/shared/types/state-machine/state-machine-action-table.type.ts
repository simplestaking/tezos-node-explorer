import { VirtualScrollActivePage } from '@shared/types/shared/virtual-scroll-active-page.type';
import { StateMachineAction } from '@shared/types/state-machine/state-machine-action.type';

export interface StateMachineProposalTable {
  ids: number[];
  entities: { [id: string]: StateMachineAction };
  activePage: VirtualScrollActivePage;
  pages: number[];
  lastCursorId: number;
  stream: boolean;
}
