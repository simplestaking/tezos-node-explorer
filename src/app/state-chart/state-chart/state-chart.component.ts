import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { StateChartBlock } from '../../shared/types/state-chart/state-chart-block.type';

@Component({
  selector: 'app-state-chart',
  templateUrl: './state-chart.component.html',
  styleUrls: ['./state-chart.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StateChartComponent implements OnInit, AfterViewInit {

  @ViewChild('stateWizard', { static: true }) wizard: ElementRef<HTMLDivElement>;
  @ViewChildren('blocks', { read: ElementRef }) blockRefs: QueryList<ElementRef<HTMLDivElement>>;

  data = mock;

  wizardWidth: number;
  wizardHeight: number;

  constructor(private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {

    this.wizardWidth = this.wizard.nativeElement.offsetWidth;
    this.wizardHeight = this.wizard.nativeElement.offsetHeight;
    console.log(this.wizardWidth);
    console.log(this.wizardHeight);
  }

  ngAfterViewInit(): void {
    const divs = Array.from(this.blockRefs).map(el => el.nativeElement);
    this.data.forEach((block, i) => {
      // if (i > 0) {
      //   block.left = divs[i - 1].offsetWidth + divs[i - 1].style.left + 20;
      // } else {
      //   block.left = 0;
      // }
    });
    console.log(this.data);
    this.cdRef.detectChanges();
  }

}

const mock: StateChartBlock[] = [
  {
    type: 'info',
    title: 'Receive connection message',
    id: 1,
    next: [2],
    prev: null,
    status: 'completed',
    currentState: null,
    blocks: []
  },
  {
    type: 'action',
    title: 'Waiting approval',
    id: 2,
    next: [3],
    prev: 1,
    status: 'active',
    currentState: null,
    blocks: []
  },
  {
    type: 'info',
    title: 'Message received successfully',
    id: 3,
    next: [],
    prev: 2,
    status: 'pending',
    currentState: null,
    blocks: []
  },
];
