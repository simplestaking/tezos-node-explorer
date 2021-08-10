import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StateChartRoutingModule } from './state-chart-routing.module';
import { StateChartComponent } from './state-chart/state-chart.component';
import { StateD3ChartComponent } from './state-d3-chart/state-d3-chart.component';
import { StateNgxGraphComponent } from './state-ngx-graph/state-ngx-graph.component';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TezedgeDiagramModule } from '../shared/diagram/tezedge-diagram.module';


@NgModule({
  declarations: [
    StateChartComponent,
    StateD3ChartComponent,
    StateNgxGraphComponent
  ],
  imports: [
    CommonModule,
    StateChartRoutingModule,
    NgxChartsModule,
    TezedgeDiagramModule,
  ]
})
export class StateChartModule { }
