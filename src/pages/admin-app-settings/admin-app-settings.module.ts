import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminAppSettingsPage } from './admin-app-settings';

@NgModule({
  declarations: [
    AdminAppSettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(AdminAppSettingsPage),
  ],
})
export class AdminAppSettingsPageModule {}
