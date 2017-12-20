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
import { Questionnaire3Page } from '../pages/questionnaire3/questionnaire3';
import { Questionnaire4Page } from '../pages/questionnaire4/questionnaire4';
import { Questionnaire6Page } from '../pages/questionnaire6/questionnaire6';
import { Questionnaire7Page } from '../pages/questionnaire7/questionnaire7';
import { Questionnaire9Page } from '../pages/questionnaire9/questionnaire9';
import { Questionnaire10Page } from '../pages/questionnaire10/questionnaire10';
import { Questionnaire11Page } from '../pages/questionnaire11/questionnaire11';
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
import { TestPage } from '../pages/test/test';
import { Register6Page } from '../pages/register6/register6';
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
import { QuestionnaireDatabaseProvider } from '../providers/questionnaire-database/questionnaire-database';
import { LoginDatabaseProvider } from '../providers/login-database/login-database';

import { DiversityQuestionnaire0Page } from '../pages/diversity-questionnaire0/diversity-questionnaire0';
import { DiversityQuestionnaire1Page } from '../pages/diversity-questionnaire1/diversity-questionnaire1';
import { DiversityQuestionnaire2Page } from '../pages/diversity-questionnaire2/diversity-questionnaire2';
import { DiversityQuestionnaire3Page } from '../pages/diversity-questionnaire3/diversity-questionnaire3';
import { DiversityQuestionnaire4Page } from '../pages/diversity-questionnaire4/diversity-questionnaire4';
import { DiversityQuestionnaire5Page } from '../pages/diversity-questionnaire5/diversity-questionnaire5';
import { DiversityQuestionnaire6Page } from '../pages/diversity-questionnaire6/diversity-questionnaire6';
import { DiversityQuestionnaire7Page } from '../pages/diversity-questionnaire7/diversity-questionnaire7';
import { DiversityQuestionnaire8Page } from '../pages/diversity-questionnaire8/diversity-questionnaire8';
import { DiversityQuestionnaire9Page } from '../pages/diversity-questionnaire9/diversity-questionnaire9';
import { DiversityQuestionnaire10Page } from '../pages/diversity-questionnaire10/diversity-questionnaire10';
import { DiversityQuestionnaire11Page } from '../pages/diversity-questionnaire11/diversity-questionnaire11';

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
    Register6Page,
    Questionnaire1Page,
    Questionnaire2Page,
    AdminPage,
    AdminHomePage,
    AdminAppSettingsPage,
    AdminVisitorHistoryPage,
    AdminVisitorDataPage,
    TapRevealComponent,
    TestPage,
    Graph1Page,
    Graph2Page,
    Graph3Page,
    Graph4Page,
    GraphCustomPage,
    ForgotAdminPasswordPage,
    Questionnaire3Page,
    Questionnaire4Page,
    Questionnaire6Page,
    Questionnaire7Page,
    Questionnaire9Page,
    Questionnaire10Page,
    Questionnaire11Page,
    DiversityQuestionnaire0Page,
    DiversityQuestionnaire1Page,
    DiversityQuestionnaire2Page,
    DiversityQuestionnaire3Page,
    DiversityQuestionnaire4Page,
    DiversityQuestionnaire5Page,
    DiversityQuestionnaire6Page,
    DiversityQuestionnaire7Page,
    DiversityQuestionnaire8Page,
    DiversityQuestionnaire9Page,
    DiversityQuestionnaire10Page,
    DiversityQuestionnaire11Page

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
    Register6Page,
    TestPage,
    Questionnaire0Page,
    Questionnaire3Page,
    Questionnaire4Page,
    Questionnaire6Page,
    Questionnaire7Page,
    Questionnaire9Page,
    Questionnaire10Page,
    Questionnaire11Page,
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
    ForgotAdminPasswordPage,

    DiversityQuestionnaire0Page,
    DiversityQuestionnaire1Page,
    DiversityQuestionnaire2Page,
    DiversityQuestionnaire3Page,
    DiversityQuestionnaire4Page,
    DiversityQuestionnaire5Page,
    DiversityQuestionnaire6Page,
    DiversityQuestionnaire7Page,
    DiversityQuestionnaire8Page,
    DiversityQuestionnaire9Page,
    DiversityQuestionnaire10Page,
    DiversityQuestionnaire11Page

  ],
  providers: [
    SQLite,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ShareProvider,
    File,
    sqlitedatabase,
    QuestionnaireDatabaseProvider,
    LoginDatabaseProvider
  ]
})
export class AppModule {}