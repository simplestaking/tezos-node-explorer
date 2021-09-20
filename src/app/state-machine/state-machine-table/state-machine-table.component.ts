import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { selectStateMachine } from '@state-machine/state-machine/state-machine.reducer';
import { Observable } from 'rxjs';
import { StateMachineProposal } from '@shared/types/state-machine/state-machine-proposal.type';
import {
  StateMachineActionTypes,
  StateMachineSetActiveProposal,
  StateMachineStartPlaying,
  StateMachineStopPlaying
} from '@state-machine/state-machine/state-machine.actions';
import { StateMachine } from '@shared/types/state-machine/state-machine.type';

@Component({
  selector: 'app-state-machine-table',
  templateUrl: './state-machine-table.component.html',
  styleUrls: ['./state-machine-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StateMachineTableComponent implements OnInit {

  stateMachine$: Observable<StateMachine>;

  private tableContainer: ElementRef<HTMLDivElement>;

  @ViewChild('tableContainer') set scrollBottom(content: ElementRef<HTMLDivElement>) {
    if (content) {
      this.tableContainer = content;
      this.tableContainer.nativeElement.scrollTop = this.tableContainer.nativeElement.offsetHeight;
    }
  }

  constructor(private store: Store<State>) { }

  ngOnInit(): void {
    this.stateMachine$ = this.store.select(selectStateMachine);
  }

  selectProposal(proposal: StateMachineProposal): void {
    this.store.dispatch<StateMachineStopPlaying>({ type: StateMachineActionTypes.STATE_MACHINE_STOP_PLAYING });
    this.store.dispatch<StateMachineSetActiveProposal>({
      type: StateMachineActionTypes.STATE_MACHINE_SET_ACTIVE_PROPOSAL,
      payload: proposal
    });
  }

  selectPrevProposal(proposals: StateMachineProposal[], activeProposal: StateMachineProposal): void {
    this.selectProposal(proposals[proposals.findIndex(p => p === activeProposal) - 1]);
  }

  selectNextProposal(proposals: StateMachineProposal[], activeProposal: StateMachineProposal): void {
    this.selectProposal(proposals[proposals.findIndex(p => p === activeProposal) + 1]);
  }

  togglePlayPause(isPlaying: boolean): void {
    if (isPlaying) {
      this.store.dispatch<StateMachineStopPlaying>({ type: StateMachineActionTypes.STATE_MACHINE_STOP_PLAYING });
    } else {
      this.store.dispatch<StateMachineStartPlaying>({ type: StateMachineActionTypes.STATE_MACHINE_START_PLAYING });
    }
  }
}
