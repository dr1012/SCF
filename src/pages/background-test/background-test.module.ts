import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BackgroundTestPage } from './background-test';

@NgModule({
  declarations: [
    BackgroundTestPage,
  ],
  imports: [
    IonicPageModule.forChild(BackgroundTestPage),
  ],
})
export class BackgroundTestPageModule {}
