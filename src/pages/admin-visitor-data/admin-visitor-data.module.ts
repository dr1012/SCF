import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminVisitorDataPage } from './admin-visitor-data';

@NgModule({
  declarations: [
    AdminVisitorDataPage,
  ],
  imports: [
    IonicPageModule.forChild(AdminVisitorDataPage),
  ],
})
export class AdminVisitorDataPageModule {}
