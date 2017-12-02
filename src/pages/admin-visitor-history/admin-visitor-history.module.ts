import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminVisitorHistoryPage } from './admin-visitor-history';

@NgModule({
  declarations: [
    AdminVisitorHistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(AdminVisitorHistoryPage),
  ],
})
export class AdminVisitorHistoryPageModule {}
