import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { StateMachineProposal } from '@shared/types/state-machine/state-machine-proposal.type';
import { Observable, tap } from 'rxjs';
import { selectStateMachine, selectStateMachineActiveAction } from '@state-machine/state-machine/state-machine.reducer';
import { NgxObjectDiffService } from 'ngx-object-diff';
import { StateMachine } from '@shared/types/state-machine/state-machine.type';

@Component({
  selector: 'app-state-machine-action-details',
  templateUrl: './state-machine-action-details.component.html',
  styleUrls: ['./state-machine-action-details.component.scss']
})
export class StateMachineActionDetailsComponent implements OnInit {

  stateMachine$: Observable<StateMachine>;
  readonly tabs = ['CONTENT', 'DIFF'];
  activeTab: string = 'DIFF';
  diffValueChanges: string;

  constructor(private store: Store<State>,
              private objectDiff: NgxObjectDiffService) { }

  ngOnInit(): void {
    // this.objectDiff.setOpenChar('');
    // this.objectDiff.setCloseChar('');
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
            .split('</ins><span>,</span>').join(insEndingTag)
            // .split('<span>,</span>').join('')
            // .split('<span></span>').join('');
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
          this.diffValueChanges = innerHTML || 'No differences';
        })
      );
  }

}
