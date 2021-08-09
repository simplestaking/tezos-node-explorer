import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StateChartComponent } from './state-chart/state-chart.component';
import { StateD3ChartComponent } from './state-d3-chart/state-d3-chart.component';

const routes: Routes = [
  {
    path: '',
    component: StateD3ChartComponent,
    children: []
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StateChartRoutingModule {}
