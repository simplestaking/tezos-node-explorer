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

    const g = new dagreD3.graphlib.Graph({ compound: true })
      .setGraph({})
      .setDefaultEdgeLabel(() => ({}));
    g.graph().rankDir = 'LR';

    // Create
    // const setBlocks = (blocks: any[]) => blocks.forEach(block => {
    //   const cls = block.status + (block.type === 'action' ? ' action' : '');
    //   g.setNode(block.id, {
    //     label: block.title,
    //     class: cls,
    //     data: block,
    //     clusterLabelPos: block.blocks.length ? 'top' : undefined
    //   });
    // });
    //
    // setBlocks(stateBlockArray.reduce((acc, current) => [...acc, current, ...current.blocks], []));

    stateBlockArray.filter(bl => bl.blocks.length === 0).forEach(block => {
      const cls = block.status + (block.type === 'action' ? ' action' : '');
      g.setNode(block.id, {
        label: block.title,
        class: cls,
        data: block,
      });
    });
    stateBlockArray.filter(bl => bl.blocks.length > 0).forEach(block => {
      const cls = block.status + (block.type === 'action' ? ' action' : '');
      g.setNode(block.id, {
        label: block.title,
        class: cls,
        data: block,
        clusterLabelPos: 'top'
      });
      block.blocks.filter(bl => bl.blocks.length === 0).forEach(bl => {
        const clss = bl.status + (bl.type === 'action' ? ' action' : '');
        g.setNode(bl.id, {
          label: bl.title,
          class: clss,
          data: bl,
        });
      });
    });

    stateBlockArray.forEach(block =>
      block.blocks.forEach(childBlock => {
        g.setParent(block.id, childBlock.id);
      })
    );

    // Connect
    stateBlockArray
      .reduce((acc, current) => [...acc, current, ...current.blocks], [])
      .filter(block => block.next.length)
      .forEach(block => {
        debugger;
        block.next.forEach((next, i) => {
          console.log('connecting ' + block.id + ' with ' + next);
          g.setEdge(block.id, next, {
            label: block.labels ? block.labels[i] : '',
            labelStyle: 'fill: rgba(255,255,255,0.7)',
            arrowheadStyle: 'fill: #7f7f82; stroke: none',
            style: 'stroke: #7f7f82; fill: none'
          });
        });
      });
    console.log(g);
    g.nodes().forEach((v) => {
      const node = g.node(v);
      console.log(node);
      node.rx = node.ry = 5;
      // node.height = node.data.type === 'action' ? 4 : 16;
    });

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

const stateBlockArray: StateChartBlock[] = [
  {
    type: 'info',
    title: 'Connection initiated',
    id: 1,
    next: [21],
    prev: null,
    status: 'completed',
    currentState: null,
    blocks: []
  },
  {
    type: 'info',
    title: 'Exchange connection message',
    id: 2,
    next: [],
    prev: 1,
    status: 'completed',
    currentState: null,
    blocks: [
      {
        type: 'action',
        title: 'Send message',
        id: 21,
        next: [22],
        prev: 1,
        status: 'completed',
        currentState: null,
        blocks: []
      },
      {
        type: 'info',
        title: 'Receive message',
        id: 22,
        next: [3],
        prev: 21,
        status: 'completed',
        currentState: null,
        blocks: []
      },
    ]
  },
  {
    type: 'info',
    title: 'Exchange metadata message',
    id: 3,
    next: [],
    prev: 21,
    status: 'active',
    currentState: null,
    blocks: []
  },
  // {
  //   type: 'info',
  //   title: 'Exchange ack message',
  //   id: 4,
  //   next: [5],
  //   prev: 3,
  //   status: 'pending',
  //   currentState: null,
  //   blocks: []
  // },
  // {
  //   type: 'info',
  //   title: 'Retry?',
  //   id: 5,
  //   next: [1, 6],
  //   labels: ['BLACKLISTED', 'Success'],
  //   prev: 4,
  //   status: 'pending',
  //   currentState: null,
  //   blocks: []
  // },
  // {
  //   type: 'info',
  //   title: 'Finished!',
  //   id: 6,
  //   next: [],
  //   prev: 5,
  //   status: 'pending',
  //   currentState: null,
  //   blocks: []
  // },
];
