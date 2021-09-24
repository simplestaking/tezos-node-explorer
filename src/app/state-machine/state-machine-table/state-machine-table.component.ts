import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { selectStateMachine } from '@state-machine/state-machine/state-machine.reducer';
import { Observable } from 'rxjs';
import { StateMachineAction } from '@shared/types/state-machine/state-machine-action.type';
import { StateMachineActionTypes, StateMachineSetActiveAction, } from '@state-machine/state-machine/state-machine.actions';
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
    // if (content) {
    //   this.tableContainer = content;
    //   this.tableContainer.nativeElement.scrollTop = this.tableContainer.nativeElement.offsetHeight;
    // }
  }

  constructor(private store: Store<State>) { }

  ngOnInit(): void {
    this.stateMachine$ = this.store.select(selectStateMachine);
  }

  selectAction(action: StateMachineAction): void {
    // this.store.dispatch<StateMachineStopPlaying>({ type: StateMachineActionTypes.STATE_MACHINE_PAUSE_PLAYING });
    this.store.dispatch<StateMachineSetActiveAction>({
      type: StateMachineActionTypes.STATE_MACHINE_SET_ACTIVE_ACTION,
      payload: action
    });
  }

  // selectPrevProposal(proposals: StateMachineProposal[], activeProposal: StateMachineProposal): void {
  //   this.selectProposal(proposals[proposals.findIndex(p => p === activeProposal) - 1]);
  // }
  //
  // selectNextProposal(proposals: StateMachineProposal[], activeProposal: StateMachineProposal): void {
  //   this.selectProposal(proposals[proposals.findIndex(p => p === activeProposal) + 1]);
  // }
  //
  // togglePlayPause(isPlaying: boolean): void {
  //   if (isPlaying) {
  //     this.store.dispatch<StateMachineStopPlaying>({ type: StateMachineActionTypes.STATE_MACHINE_PAUSE_PLAYING });
  //   } else {
  //     this.store.dispatch<StateMachineStartPlaying>({ type: StateMachineActionTypes.STATE_MACHINE_START_PLAYING });
  //   }
  // }
}
