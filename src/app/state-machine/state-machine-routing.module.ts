import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StateMachineComponent } from './state-machine/state-machine.component';

const routes: Routes = [
  {
    path: '',
    component: StateMachineComponent,
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
export class StateMachineRoutingModule {}
