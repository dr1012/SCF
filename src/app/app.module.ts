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
import { AdminPage } from '../pages/admin/admin'; 
import { TapRevealComponent } from '../components/tap-reveal/tap-reveal';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { IonicStorageModule } from '@ionic/storage';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ShareProvider } from '../providers/share/share';


import { File } from '@ionic-native/file';
import { sqlitedatabase } from '../providers/sqlitedatabase/sqlitedatabase';

import { AdminHomePage } from '../pages/admin-home/admin-home';
import { AdminAppSettingsPage } from '../pages/admin-app-settings/admin-app-settings';
import { AdminVisitorHistoryPage } from '../pages/admin-visitor-history/admin-visitor-history';
import { AdminVisitorDataPage } from '../pages/admin-visitor-data/admin-visitor-data'; 
import { Graph1Page } from '../pages/graph1/graph1';
import { Graph2Page } from '../pages/graph2/graph2';
import { Graph3Page } from '../pages/graph3/graph3';
import { Graph4Page } from '../pages/graph4/graph4';
import { GraphCustomPage } from '../pages/graph-custom/graph-custom';
import { ForgotAdminPasswordPage } from '../pages/forgot-admin-password/forgot-admin-password';


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
    Questionnaire2Page,
    AdminPage,
    AdminHomePage,
    AdminAppSettingsPage,
    AdminVisitorHistoryPage,
    AdminVisitorDataPage,
    TapRevealComponent,
    Graph1Page,
    Graph2Page,
    Graph3Page,
    Graph4Page,
    GraphCustomPage,
    ForgotAdminPasswordPage
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
    Questionnaire2Page,
    AdminPage,
    AdminHomePage,
    AdminAppSettingsPage,
    AdminVisitorHistoryPage,
    AdminVisitorDataPage,
    Graph1Page,
    Graph2Page,
    Graph3Page,
    Graph4Page,
    GraphCustomPage,
    ForgotAdminPasswordPage
  ],
  providers: [
    SQLite,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ShareProvider,
    File,
    sqlitedatabase
  ]
})
export class AppModule {}