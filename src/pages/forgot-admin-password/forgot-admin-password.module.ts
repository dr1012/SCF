import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ForgotAdminPasswordPage } from './forgot-admin-password';

@NgModule({
  declarations: [
    ForgotAdminPasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(ForgotAdminPasswordPage),
  ],
})
export class ForgotAdminPasswordPageModule {}
