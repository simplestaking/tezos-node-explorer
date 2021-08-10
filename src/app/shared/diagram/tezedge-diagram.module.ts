import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TezedgeDiagramComponent } from './tezedge-diagram/tezedge-diagram.component';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { NgxChartsModule } from '@swimlane/ngx-charts';



@NgModule({
  declarations: [
    TezedgeDiagramComponent
  ],
  exports: [
    TezedgeDiagramComponent
  ],
  imports: [
    CommonModule,
    NgxGraphModule,
    NgxChartsModule
  ]
})
export class TezedgeDiagramModule { }
