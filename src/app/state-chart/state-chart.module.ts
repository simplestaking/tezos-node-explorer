import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StateChartRoutingModule } from './state-chart-routing.module';
import { StateChartComponent } from './state-chart/state-chart.component';
import { StateD3ChartComponent } from './state-d3-chart/state-d3-chart.component';


@NgModule({
  declarations: [
    StateChartComponent,
    StateD3ChartComponent
  ],
  imports: [
    CommonModule,
    StateChartRoutingModule
  ]
})
export class StateChartModule { }
