import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../app.reducers';
import { StateMachineActionTypes, StateMachineDiagramLoad, StateMachineProposalsLoad } from './state-machine.actions';

@Component({
  selector: 'app-state-machine',
  templateUrl: './state-machine.component.html',
  styleUrls: ['./state-machine.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StateMachineComponent implements OnInit {

  constructor(private store: Store<State>) { }

  ngOnInit(): void {
    this.store.dispatch<StateMachineDiagramLoad>({
      type: StateMachineActionTypes.STATE_MACHINE_DIAGRAM_LOAD,
      payload: null
    });
    this.store.dispatch<StateMachineProposalsLoad>({
      type: StateMachineActionTypes.STATE_MACHINE_PROPOSALS_LOAD,
      payload: null
    });
  }
}
