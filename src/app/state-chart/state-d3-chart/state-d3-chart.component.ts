import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import * as d3 from 'd3';
import * as dagreD3 from 'dagre-d3';

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

    // Here we're setting nodeclass, which is used by our custom drawNodes function
    g.setNode(0, { label: 'TOP', class: 'type-TOP' });
    g.setNode(1, { label: 'S', class: 'type-S' });
    g.setNode(2, { label: 'NP', class: 'type-NP' });
    g.setNode(3, { label: 'DT', class: 'type-DT' });
    g.setNode(4, { label: 'This', class: 'type-TK' });
    g.setNode(5, { label: 'VP', class: 'type-VP' });
    g.setNode(6, { label: 'VBZ', class: 'type-VBZ' });
    g.setNode(7, { label: 'is', class: 'type-TK' });
    g.setNode(8, { label: 'NP', class: 'type-NP' });
    g.setNode(9, { label: 'DT', class: 'type-DT' });
    g.setNode(10, { label: 'an', class: 'type-TK' });
    g.setNode(11, { label: 'NN', class: 'type-NN' });
    g.setNode(12, { label: 'example', class: 'type-TK' });
    g.setNode(13, { label: '.', class: 'type-.' });
    g.setNode(14, { label: 'sentence', class: 'type-TK' });

    g.nodes().forEach((v) => {
      const node = g.node(v);
      // Round the corners of the nodes
      node.rx = node.ry = 5;
    });

    // Set up edges, no special attributes.
    g.setEdge(3, 4);
    g.setEdge(2, 3);
    g.setEdge(1, 2);
    g.setEdge(6, 7);
    g.setEdge(5, 6);
    g.setEdge(9, 10);
    g.setEdge(8, 9);
    g.setEdge(11, 12);
    g.setEdge(8, 11);
    g.setEdge(5, 8);
    g.setEdge(1, 5);
    g.setEdge(13, 14);
    g.setEdge(1, 13);
    g.setEdge(0, 1);

    // Create the renderer
    const render = new dagreD3.render();

    // Set up an SVG group so that we can translate the final graph.
    const svg = d3.select('#d3Diagram svg');
    const svgGroup = svg.append('g');

    // Run the renderer. This is what draws the final graph.
    render(d3.select('#d3Diagram svg g'), g);

    // Center the graph
    const xCenterOffset = (this.d3Diagram.nativeElement.offsetWidth - g.graph().width) / 2;
    svgGroup.attr('transform', 'translate(' + xCenterOffset + ', 20)');
    svg.attr('height', g.graph().height + 40);
  }

}
