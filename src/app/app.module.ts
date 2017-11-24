import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomepagePage } from '../pages/homepage/homepage';
import { LoginPage } from '../pages/login/login';
import { LogoutPage } from '../pages/logout/logout';
import { Register1Page } from '../pages/register1/register1';
import { Register2Page } from '../pages/register2/register2';
import { Register3Page } from '../pages/register3/register3';
import { Questionnaire0Page } from '../pages/questionnaire0/questionnaire0';
import { Register5Page } from '../pages/register5/register5';
import { Register4Page } from '../pages/register4/register4';
import { Register0Page } from '../pages/register0/register0';
import {HttpClientModule} from '@angular/common/http';
import { Questionnaire1Page } from '../pages/questionnaire1/questionnaire1';
import { Questionnaire2Page } from '../pages/questionnaire2/questionnaire2';
import { HttpModule } from '@angular/http';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { IonicStorageModule } from '@ionic/storage';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ShareProvider } from '../providers/share/share';
import { WebService } from '../providers/web-service';

import { File } from '@ionic-native/file';



@NgModule({
  declarations: [
    MyApp,
    HomepagePage,
    LoginPage,
    LogoutPage,
    Register1Page,
    Register2Page,
    Register3Page,
    Questionnaire0Page,
    Register5Page,
    Register4Page,
    Register0Page,
    Questionnaire1Page,
    Questionnaire2Page
  ],
  imports: [
    HttpClientModule,
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomepagePage,
    LoginPage,
    LogoutPage,
    Register1Page,
    Register2Page,
    Register3Page,
    Questionnaire0Page,
    Register5Page,
    Register4Page,
    Register0Page,
    Questionnaire1Page,
    Questionnaire2Page
  ],
  providers: [
    SQLite,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ShareProvider,
    WebService,
    File
  ]
})
export class AppModule {}