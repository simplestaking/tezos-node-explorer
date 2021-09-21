import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { StateMachineActionTypes, StateMachineClose, StateMachineDiagramLoad, StateMachineProposalsLoad, StateMachineStateLoad } from './state-machine.actions';
import { selectStateMachine } from '@state-machine/state-machine/state-machine.reducer';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-state-machine',
  templateUrl: './state-machine.component.html',
  styleUrls: ['./state-machine.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StateMachineComponent implements OnInit, OnDestroy {

  readonly tabs = ['HANDSHAKE', 'BOOTSTRAP', 'MEMPOOL'];
  activeTab: string = 'HANDSHAKE';
  state: any;

  constructor(private store: Store<State>) { }

  ngOnInit(): void {
    this.store.dispatch<StateMachineStateLoad>({
      type: StateMachineActionTypes.STATE_MACHINE_STATE_LOAD
    });
    this.store.dispatch<StateMachineDiagramLoad>({
      type: StateMachineActionTypes.STATE_MACHINE_DIAGRAM_LOAD,
      payload: null
    });
    this.store.dispatch<StateMachineProposalsLoad>({
      type: StateMachineActionTypes.STATE_MACHINE_PROPOSALS_LOAD,
      payload: null
    });

    this.store.select(selectStateMachine)
      .pipe(untilDestroyed(this))
      .subscribe(stateMachine => this.state = stateMachine.state);
  }

  ngOnDestroy(): void {
    this.store.dispatch<StateMachineClose>({
      type: StateMachineActionTypes.STATE_MACHINE_CLOSE
    });
  }
}
