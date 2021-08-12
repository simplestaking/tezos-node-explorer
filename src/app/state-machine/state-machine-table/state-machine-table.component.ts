import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../app.reducers';
import { selectStateMachine } from '../state-machine/state-machine.reducer';
import { Observable } from 'rxjs';
import { StateMachineProposal } from '../../shared/types/state-machine/state-machine-proposal.type';
import { StateMachineActionTypes, StateMachineSetActiveProposal } from '../state-machine/state-machine.actions';
import { StateMachine } from '../../shared/types/state-machine/state-machine.type';

@Component({
  selector: 'app-state-machine-table',
  templateUrl: './state-machine-table.component.html',
  styleUrls: ['./state-machine-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StateMachineTableComponent implements OnInit {

  stateMachine$: Observable<StateMachine>;

  constructor(private store: Store<State>) { }

  ngOnInit(): void {
    this.stateMachine$ = this.store.select(selectStateMachine);
  }

  selectProposal(proposal: StateMachineProposal): void {
    this.store.dispatch<StateMachineSetActiveProposal>({
      type: StateMachineActionTypes.STATE_MACHINE_SET_ACTIVE_PROPOSAL,
      payload: proposal
    });
  }
}
