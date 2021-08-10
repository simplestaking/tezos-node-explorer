import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ClusterNode, Edge, Node } from '@swimlane/ngx-graph';

@Component({
  selector: 'app-state-ngx-graph',
  templateUrl: './state-ngx-graph.component.html',
  styleUrls: ['./state-ngx-graph.component.scss']
})
export class StateNgxGraphComponent implements OnInit {

  @ViewChild('viewRef', { static: true }) private viewRef: ElementRef;

  nodes: Node[] = nodes;
  clusters: ClusterNode[] = clusters;
  links: Edge[] = links;
  view: number[];

  constructor() { }

  ngOnInit(): void {
    this.view = [this.viewRef.nativeElement.offsetWidth, 500];
  }

}

export const nodes: Node[] = [
  {
    id: '1',
    label: 'Connection initiated',
    data: {
      customColor: 'rgba(255,255,255,0.1)'
    },
    position: { x: 50, y: 50}
  },
  {
    id: '3',
    label: 'Send message'
   , position: { x: 50, y: 50}
  },
  {
    id: '4',
    label: 'Receive message'
   , position: { x: 50, y: 50}
  }
];

export const clusters: ClusterNode[] = [
  {
    id: 'c1',
    label: 'Exchange connection message',
    childNodeIds: ['3', '4'],
    data: {
      customHeight: 100
    }
  }
];

export const links: Edge[] = [
  {
    id: 'edge1c1',
    source: '1',
    target: '3',
    label: 'is parent of'
  }, {
    id: 'edge34',
    source: '3',
    target: '4',
    label: 'custom label'
  },
  // {
  //   id: 'c',
  //   source: 'first',
  //   target: 'c1',
  //   label: 'custom label'
  // }, {
  //   id: 'd',
  //   source: 'first',
  //   target: 'c2',
  //   label: 'custom label'
  // }
];
