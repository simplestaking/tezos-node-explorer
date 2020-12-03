import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, NgZone } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { VirtualScrollDirective } from '../../shared/virtual-scroll.directive';

@Component({
  selector: 'app-logs-action',
  templateUrl: './logs-action.component.html',
  styleUrls: ['./logs-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogsActionComponent implements OnInit, OnDestroy {

  virtualScrollItems;
  logsActionItem; // TODO type log - define an interface for log
  logsActionShow: boolean;
  ITEM_SIZE = 36;

  onDestroy$ = new Subject();

  @ViewChild(VirtualScrollDirective) vrFor: VirtualScrollDirective;

  constructor(
    public store: Store<any>,
    private changeDetector: ChangeDetectorRef
    // private ngZone: NgZone
  ) {
  }

  ngOnInit() {
    this.scrollStart(null);

    this.store.select('logsAction')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.virtualScrollItems = data;
        this.logsActionShow = this.virtualScrollItems.ids.length > 0;

        this.changeDetector.markForCheck();

        if (this.virtualScrollItems.ids.length > 0 && this.vrFor) {
          this.vrFor.afterReceivingData();
        }
        // this.logsActionList = data.ids.map(id => ({id, ...data.entities[id]}));

        // set viewport at the end
        // if (this.logsActionShow) {
        //
        //   const viewPortRange = this.viewPort && this.viewPort.getRenderedRange() ?
        //     this.viewPort.getRenderedRange() : {start: 0, end: 0};
        //   const viewPortItemLength = this.logsActionList.length;
        //
        //   // set hover
        //   this.logsActionItem = this.logsActionList[this.logsActionList.length - 1];
        //
        //   // trigger only if we are streaming and not at the end of page
        //   if (data.stream && viewPortItemLength > 0 && (viewPortRange.end !== viewPortItemLength) &&
        //     (viewPortRange.start !== viewPortRange.end)) {
        //     // console.log('[set][scrollToOffset] ', data.stream, this.logsActionList.length, viewPortItemLength, viewPortRange);
        //
        //     setTimeout(() => {
        //       const offset = this.ITEM_SIZE * this.logsActionList.length;
        //       // set scroll
        //       this.viewPort.scrollToOffset(offset);
        //
        //     });
        //
        //   }
        //
        // }
      });

    // this.logsAction$ = this.store.select('logsAction');
    // this.logsDataSource = new LogsDataSource(this.logsAction$, this.store);
  }

  getItems($event) {
    this.store.dispatch({
      type: 'LOGS_ACTION_LOAD',
      payload: {
        cursor_id: $event?.nextCursorId,
        limit: $event?.limit
      }
    });
  }

  startStopDataStream(event) {
    if (event.stop) {
      this.store.dispatch({
        type: 'LOGS_ACTION_STOP',
      });
    } else {
      this.store.dispatch({
        type: 'LOGS_ACTION_START',
        payload: {
          limit: event?.limit
        }
      });
    }
  }

  scrollStart($event) {
    // trigger action and get logs data
    this.store.dispatch({
      type: 'LOGS_ACTION_START',
      payload: {
        cursor_id: $event?.nextCursorId ? $event?.nextCursorId : null,
        limit: $event?.limit ? $event.limit : 120
      }
    });
  }

  scrollStop() {
    this.store.dispatch({
      type: 'LOGS_ACTION_STOP'
    });
  }

  scrollToEnd() {
    this.vrFor.scrollToBottom();
  }

  tableMouseEnter(item) {
    // this.ngZone.runOutsideAngular(() => {
    //   if (this.logsActionItem && this.logsActionItem.id === item.id) {
    //     return;
    //   }
    //
    //   this.ngZone.run(() => {
    //     this.logsActionItem = item;
    //   });
    // });
  }

  ngOnDestroy() {
    // stop logs stream
    this.store.dispatch({
      type: 'LOGS_ACTION_STOP'
    });

    // close all observables
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
