import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GraphCustomPage } from './graph-custom';

@NgModule({
  declarations: [
    GraphCustomPage,
  ],
  imports: [
    IonicPageModule.forChild(GraphCustomPage),
  ],
})
export class GraphCustomPageModule {}
