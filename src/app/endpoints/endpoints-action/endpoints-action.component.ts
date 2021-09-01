import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-endpoints-action',
  templateUrl: './endpoints-action.component.html',
  styleUrls: ['./endpoints-action.component.scss']
})
export class EndpointsActionComponent implements OnInit, OnDestroy {

  public endpointsAction;
  public endpointsActionList;
  public endpointsActionShow;
  public endpointsActionItem;

  public ITEM_SIZE = 36;

  @ViewChild(CdkVirtualScrollViewport) viewPort: CdkVirtualScrollViewport;

  constructor(
    public store: Store<any>,
    private activeRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.activeRoute.params
      .pipe(untilDestroyed(this))
      .subscribe((params) => {

        // triger action and get endpoints data
        this.store.dispatch({
          type: 'ENDPOINTS_ACTION_LOAD',
          payload: params.address ? params.address : '',
        });

      });

    // wait for data changes from redux
    this.store.select('endpointsAction')
      .pipe(untilDestroyed(this))
      .subscribe(data => {

        this.endpointsAction = data;

        this.endpointsActionShow = data.ids.length > 0 ? true : false;
        this.endpointsActionList = data.ids.map(id => ({ id, ...data.entities[id] }));

        // set viewport at the end
        if (this.endpointsActionShow) {

          const viewPortRange = this.viewPort && this.viewPort.getRenderedRange() ?
            this.viewPort.getRenderedRange() : { start: 0, end: 0 };
          const viewPortItemLength = this.endpointsActionList.length;

          // set hover
          this.endpointsActionList = this.endpointsActionList[this.endpointsActionList.length - 1];

          // trigger only if we are streaming and not at the end of page
          if (data.stream && viewPortItemLength > 0 && (viewPortRange.end !== viewPortItemLength) &&
            (viewPortRange.start !== viewPortRange.end)) {

            setTimeout(() => {
              const offset = this.ITEM_SIZE * this.endpointsActionList.length;
              // set scroll
              this.viewPort.scrollToOffset(offset);

            });

          }

        }

      });

  }

  onScroll(index) {

    if (this.endpointsActionList.length - index > 15) {
      // stop log actions stream
      this.store.dispatch({
        type: 'ENDPOINTS_ACTION_STOP',
        payload: event,
      });
    } else {
      // start log actions stream
      this.store.dispatch({
        type: 'ENDPOINTS_ACTION_START',
        payload: event,
      });
    }

  }

  scrollStart() {

    // triger action and get logs data
    this.store.dispatch({
      type: 'ENDPOINTS_ACTION_START',
    });

  }

  scrollStop() {

    // stop streaming logs actions
    this.store.dispatch({
      type: 'ENDPOINTS_ACTION_STOP',
    });

  }

  scrollToEnd() {

    const offset = this.ITEM_SIZE * this.endpointsActionList.length;
    this.viewPort.scrollToOffset(offset);

  }

  tableMouseEnter(item) {

    this.endpointsActionItem = item

  }

  ngOnDestroy() {
    // stop streaming logs actions
    this.store.dispatch({
      type: 'ENDPOINTS_ACTION_STOP',
    });
  }

}
