import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SqlitetestPage } from './sqlitetest';

@NgModule({
  declarations: [
    SqlitetestPage,
  ],
  imports: [
    IonicPageModule.forChild(SqlitetestPage),
  ],
})
export class SqlitetestPageModule {}
