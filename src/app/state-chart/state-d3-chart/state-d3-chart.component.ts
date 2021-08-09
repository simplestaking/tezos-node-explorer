import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import * as d3 from 'd3';
import * as dagreD3 from 'dagre-d3';
import { StateChartBlock } from '../../shared/types/state-chart/state-chart-block.type';

@Component({
  selector: 'app-state-d3-chart',
  templateUrl: './state-d3-chart.component.html',
  styleUrls: ['./state-d3-chart.component.scss']
})
export class StateD3ChartComponent implements AfterViewInit {

  @ViewChild('d3Diagram') private d3Diagram: ElementRef;

  constructor() { }

  ngAfterViewInit(): void {

    const g = new dagreD3.graphlib.Graph()
      .setGraph({})
      .setDefaultEdgeLabel(() => ({}));
    g.graph().rankDir = 'LR';

    mock.forEach(m => {
      const cls = m.status + (m.type === 'action' ? ' action' : '');
      // m.status === 'active' ? 'active ' : '',
      // m.type === 'action' ? 'action ' : '',
      // m.type === 'action' ? 'action ' : '',
      // [class.action]="block.type === 'action'"
      // [class.active]="block.status === 'active'"
      // [class.completed]="block.status === 'completed'"
      // [class.pending]="block.status === 'pending'"
      g.setNode(m.id, { label: m.title, class: cls, data: m });
    });


    // Here we're setting nodeclass, which is used by our custom drawNodes function
    // g.setNode(0, { label: 'TOP', class: 'type-TOP' });
    // g.setNode(1, { label: 'S', class: 'type-S' });
    // g.setNode(2, { label: 'NP', class: 'type-NP' });
    // g.setNode(3, { label: 'DT', class: 'type-DT' });
    // g.setNode(4, { label: 'This', class: 'type-TK' });
    // g.setNode(5, { label: 'VP', class: 'type-VP' });
    // g.setNode(6, { label: 'VBZ', class: 'type-VBZ' });
    // g.setNode(7, { label: 'is', class: 'type-TK' });
    // g.setNode(8, { label: 'NP', class: 'type-NP' });
    // g.setNode(9, { label: 'DT', class: 'type-DT' });
    // g.setNode(10, { label: 'an', class: 'type-TK' });
    // g.setNode(11, { label: 'NN', class: 'type-NN' });
    // g.setNode(12, { label: 'example', class: 'type-TK' });
    // g.setNode(13, { label: '.', class: 'type-.' });
    // g.setNode(14, { label: 'sentence', class: 'type-TK' });

    g.nodes().forEach((v) => {
      const node = g.node(v);
      // Round the corners of the nodes
      node.rx = node.ry = 5;
      node.height = node.data.type === 'action' ? 4 : 16;
    });


    mock.filter(m => m.next.length).forEach(m => {
      m.next.forEach(next => {
        g.setEdge(m.id, next, { arrowheadStyle: 'fill: #7f7f82; stroke: none', style: 'stroke: #7f7f82; fill: none' });
      });
    });

    // g.setEdge(3, 4);
    // g.setEdge(2, 3);
    // g.setEdge(1, 2);
    // g.setEdge(6, 7);
    // g.setEdge(5, 6);
    // g.setEdge(9, 10);
    // g.setEdge(8, 9);
    // g.setEdge(11, 12);
    // g.setEdge(8, 11);
    // g.setEdge(5, 8);
    // g.setEdge(1, 5);
    // g.setEdge(13, 14);
    // g.setEdge(1, 13);
    // g.setEdge(0, 1);

    // Create the renderer
    const render = new dagreD3.render();

    // Set up an SVG group so that we can translate the final graph.
    const svg = d3.select('#d3Diagram svg');
    const svgGroup = svg.append('g');

    // Run the renderer. This is what draws the final graph.
    render(d3.select('#d3Diagram svg g'), g);

    // Center the graph
    // const xCenterOffset = (this.d3Diagram.nativeElement.offsetWidth - g.graph().width) / 2;
    // svgGroup.attr('transform', 'translate(' + xCenterOffset + ', 20)');
    svg
      .attr('width', d3.select('#d3Diagram svg g')['_groups'][0][0].getBBox().width)
      .attr('height', this.d3Diagram.nativeElement.offsetHeight);
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
    status: 'completed',
    currentState: null,
    blocks: []
  },
  {
    type: 'info',
    title: 'Message received successfully',
    id: 3,
    next: [4],
    prev: 2,
    status: 'active',
    currentState: null,
    blocks: []
  },
  {
    type: 'info',
    title: 'Retry?',
    id: 4,
    next: [1, 5],
    prev: 3,
    status: 'pending',
    currentState: null,
    blocks: []
  },
  {
    type: 'info',
    title: 'Finished!',
    id: 5,
    next: [],
    prev: 4,
    status: 'pending',
    currentState: null,
    blocks: []
  },
];
