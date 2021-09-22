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
import { NgxObjectDiffService } from 'ngx-object-diff';
import { tap } from 'rxjs';

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

  readonly tabs = ['STATE', 'ACTION', 'DIFF'];
  activeTab: string = 'DIFF';
  diffValueChanges: string;

  constructor(private store: Store<State>,
              private objectDiff: NgxObjectDiffService) { }

  ngOnInit(): void {
    let proposal; // remove
    this.stateMachine$ = this.store.select(selectStateMachine)
      .pipe(
        tap(state => {
          const diff = this.objectDiff.diff(state.state, state.activeProposal?.state || {});
          let innerHTML = this.objectDiff.toJsonDiffView(diff);
          const findAllOccurrences = (str, substr) => {
            str = str.toLowerCase();
            const result = [];
            let idx = str.indexOf(substr);
            while (idx !== -1) {
              result.push(idx);
              idx = str.indexOf(substr, idx + 1);
            }
            return result;
          };
          const delEndingTag = '</del>';
          const insEndingTag = '</ins>';
          innerHTML = innerHTML
            .split('</del><span>,</span>').join(delEndingTag)
            .split('</ins><span>,</span>').join(insEndingTag);
          const delStart = '<del class="diff diff-key">';
          const insStart = '<ins class="diff diff-key">';
          const spanInside = '<span>: </span>';
          findAllOccurrences(innerHTML, delStart).reverse().forEach(index => {
            const delContentStartIdx = index + delStart.length;
            const spanDelEndLimit = delContentStartIdx + innerHTML.substr(delContentStartIdx).indexOf(spanInside) + spanInside.length;
            const delContentEndIdx = delContentStartIdx + innerHTML.substr(delContentStartIdx).indexOf(delEndingTag);
            const oldValueTag = '<div class="old-value">' + innerHTML.substring(spanDelEndLimit, delContentEndIdx) + '</div>';
            innerHTML = innerHTML.substring(0, spanDelEndLimit) + oldValueTag + innerHTML.substring(delContentEndIdx);
          });
          findAllOccurrences(innerHTML, delStart).reverse().forEach(index => {
            const delContentStartIdx = index + delStart.length;
            const delContentEndIdx = delContentStartIdx + innerHTML.substr(delContentStartIdx).indexOf(delEndingTag);
            const nextInsTagStart = delContentEndIdx + innerHTML.substr(delContentEndIdx).indexOf(delEndingTag) + delEndingTag.length + 1;
            const nextInsTagEnd = delContentEndIdx + innerHTML.substr(delContentEndIdx).indexOf(insEndingTag) + insEndingTag.length;
            const nextInsTag = innerHTML.substring(nextInsTagStart, nextInsTagEnd);
            innerHTML = innerHTML.substring(0, delContentEndIdx) + nextInsTag + innerHTML.substring(delContentEndIdx);

            innerHTML = innerHTML.substring(0, nextInsTagStart + nextInsTag.length - 1) + innerHTML.substring(nextInsTagEnd + nextInsTag.length);
          });
          findAllOccurrences(innerHTML, insStart).reverse().forEach(index => {
            const insContentStartIdx = index + insStart.length;
            const spanInsEndLimit = innerHTML.substr(insContentStartIdx).indexOf(spanInside) + spanInside.length;
            innerHTML = innerHTML.substring(0, insContentStartIdx) + innerHTML.substring(insContentStartIdx + spanInsEndLimit);
          });


          this.diffValueChanges = innerHTML;


          proposal = state.proposals[2]; // remove
        })
      );

    setTimeout(() => this.selectProposal(proposal), 100); // remove
  }

  selectProposal(proposal: StateMachineProposal): void {
    // this.store.dispatch<StateMachineStopPlaying>({ type: StateMachineActionTypes.STATE_MACHINE_PAUSE_PLAYING });
    this.store.dispatch<StateMachineSetActiveProposal>({
      type: StateMachineActionTypes.STATE_MACHINE_SET_ACTIVE_PROPOSAL,
      payload: proposal
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
