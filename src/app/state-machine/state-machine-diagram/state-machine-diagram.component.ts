import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { StateMachineDiagramBlock } from '../../shared/types/state-machine/state-machine-diagram-block.type';
import { Store } from '@ngrx/store';
import { State } from '../../app.reducers';

import * as d3 from 'd3';
import * as dagreD3 from 'dagre-d3';
import { selectStateMachineDiagram } from '../state-machine/state-machine.reducer';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-state-machine-diagram',
  templateUrl: './state-machine-diagram.component.html',
  styleUrls: ['./state-machine-diagram.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StateMachineDiagramComponent implements OnInit {

  @ViewChild('d3Diagram', { static: true }) private d3Diagram: ElementRef<HTMLDivElement>;

  constructor(private store: Store<State>) { }

  ngOnInit(): void {
    this.listenToDiagramChange();
  }

  private listenToDiagramChange(): void {
    this.store.select(selectStateMachineDiagram)
      .pipe(untilDestroyed(this))
      .subscribe((diagram: StateMachineDiagramBlock[]) => {
        this.generateDiagram(diagram);
      });
  }

  generateDiagram(diagram: StateMachineDiagramBlock[]): void {
    const g = new dagreD3.graphlib.Graph({ compound: true })
      .setGraph({})
      .setDefaultEdgeLabel(() => ({}));
    // g.graph().rankDir = 'LR';

    // Create
    const setBlocks = (blocks: any[]) => blocks.forEach(block => {
      const cls = block.status + (block.type === 'action' ? ' action' : '');
      g.setNode(block.id, {
        label: block.title,
        class: cls,
        data: block,
        id: block.id,
        clusterLabelPos: block.blocks.length ? 'top' : undefined
      });
    });

    setBlocks(diagram.reduce((acc, current) => [...acc, current, ...current.blocks], []));

    diagram.forEach(block => block.blocks.forEach(childBlock => {
      g.setParent(childBlock.id, block.id);
    }));

    // Connect
    diagram
      .reduce((acc, current) => [...acc, current, ...current.blocks], [])
      .filter(block => block.next.length)
      .forEach(block => {
        block.next.forEach((next, i) => {
          g.setEdge(block.id, next, {
            label: block.labels ? block.labels[i] : '',
            labelStyle: 'fill: rgba(255,255,255,0.7)',
            arrowheadStyle: 'fill: #7f7f82; stroke: none',
            style: 'stroke: #7f7f82; fill: none'
          });
        });
      });

    g.nodes().forEach((v) => {
      const node = g.node(v);
      node.rx = node.ry = 5;
      node.height = node.data.type === 'action' ? 4 : 16;
    });

    // Create the renderer
    const render = new dagreD3.render();

    // Set up an SVG group so that we can translate the final graph.
    const svg = d3.select('#d3Diagram svg');
    const svgGroup = svg.append('g');

    // Run the renderer. This is what draws the final graph.
    render(d3.select('#d3Diagram svg g'), g);

    const zoom = d3.zoom().on('zoom', (event) => {
      svgGroup.attr('transform', event.transform);
    });
    svg.call(zoom);

    const svgClusters = d3.select('#d3Diagram svg').selectAll('g.cluster');
    svgClusters.attr('class', (id) => {
      return 'cluster ' + diagram.find(bl => bl.id === Number(id)).status;
    });

    svg
      // .attr('width', d3.select('#d3Diagram svg g')['_groups'][0][0].getBBox().width)
      // .attr('height', d3.select('#d3Diagram svg g')['_groups'][0][0].getBBox().height)
      // .attr('viewBox', '0 0 ' + this.d3Diagram.nativeElement.offsetWidth + ' ' + this.d3Diagram.nativeElement.offsetHeight)
      .attr('width', this.d3Diagram.nativeElement.offsetWidth)
      .attr('height', this.d3Diagram.nativeElement.offsetHeight);

    const initialScale = Math.min(
      this.d3Diagram.nativeElement.offsetWidth / g.graph().width,
      this.d3Diagram.nativeElement.offsetHeight / g.graph().height
    ) - 0.02;
    const transform = d3.zoomIdentity
      .translate((Number(svg.attr('width')) - g.graph().width * initialScale) / 2, 20)
      .scale(initialScale);
    svg
      .transition()
      .duration(0)
      .call(zoom.transform as any, transform);
    // svg.attr('height', g.graph().height * initialScale + 40);
  }

}
