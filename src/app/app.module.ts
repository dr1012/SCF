import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomepagePage } from '../pages/homepage/homepage';

import { LoginPage } from '../pages/login/login';
import { LogoutPage } from '../pages/logout/logout';

import { Register0Page } from '../pages/register0/register0';
import { Register1Page } from '../pages/register1/register1';
import { Register2Page } from '../pages/register2/register2';
import { Register3Page } from '../pages/register3/register3';
import { Register4Page } from '../pages/register4/register4';
import { Register5Page } from '../pages/register5/register5';
import { Register6Page } from '../pages/register6/register6';

import { Questionnaire1Page } from '../pages/questionnaire1/questionnaire1';
import { Questionnaire2Page } from '../pages/questionnaire2/questionnaire2';
import { Questionnaire3Page } from '../pages/questionnaire3/questionnaire3';
import { Questionnaire4Page } from '../pages/questionnaire4/questionnaire4';
import { Questionnaire6Page } from '../pages/questionnaire6/questionnaire6';
import { Questionnaire7Page } from '../pages/questionnaire7/questionnaire7';
import { Questionnaire9Page } from '../pages/questionnaire9/questionnaire9';
import { Questionnaire10Page } from '../pages/questionnaire10/questionnaire10';
import { Questionnaire11Page } from '../pages/questionnaire11/questionnaire11';

import {HttpClientModule} from '@angular/common/http';


import { SQLite } from '@ionic-native/sqlite';

import { IonicStorageModule } from '@ionic/storage';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ShareProvider } from '../providers/share/share';

import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';

import { sqlitedatabase } from '../providers/sqlitedatabase/sqlitedatabase';

import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { HttpModule } from '@angular/http';



import { AdminPage } from '../pages/admin/admin'; 
import { AdminHomePage } from '../pages/admin-home/admin-home';
import { AdminAppSettingsPage } from '../pages/admin-app-settings/admin-app-settings';
import { AdminVisitorHistoryPage } from '../pages/admin-visitor-history/admin-visitor-history';
import { AdminVisitorDataPage } from '../pages/admin-visitor-data/admin-visitor-data'; 
import { Graph1Page } from '../pages/graph1/graph1';
import { Graph2Page } from '../pages/graph2/graph2';
import { Graph3Page } from '../pages/graph3/graph3';
import { Graph4Page } from '../pages/graph4/graph4';




import { GraphScatter1Page } from '../pages/graph-scatter1/graph-scatter1';
import { GraphScatter2Page } from '../pages/graph-scatter2/graph-scatter2';
import { GraphScatter3Page } from '../pages/graph-scatter3/graph-scatter3';
import { GraphScatter4Page } from '../pages/graph-scatter4/graph-scatter4';
import { GraphScatter5Page } from '../pages/graph-scatter5/graph-scatter5';
import { GraphPie2Page } from '../pages/graph-pie2/graph-pie2';
import { GraphPie3Page } from '../pages/graph-pie3/graph-pie3';
import { GraphPie4Page } from '../pages/graph-pie4/graph-pie4';
import { GraphPie5Page } from '../pages/graph-pie5/graph-pie5';
import { GraphBar1Page } from '../pages/graph-bar1/graph-bar1';
import { GraphBar2Page } from '../pages/graph-bar2/graph-bar2';
import { GraphBar3Page } from '../pages/graph-bar3/graph-bar3';
import { GraphBar4Page } from '../pages/graph-bar4/graph-bar4';
import { GraphBar5Page } from '../pages/graph-bar5/graph-bar5';

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
import { GoogleDriveProvider } from '../providers/google-drive/google-drive';

import { BackandProvider } from '../providers/backand/backand';
import { ConnectionCheckProvider } from '../providers/connection-check/connection-check';
import { Network } from '@ionic-native/network';

import { CsvDownloadsPage } from '../pages/csv-downloads/csv-downloads';

@NgModule({
  declarations: [
    MyApp,
    
    HomepagePage,
    LoginPage,
    LogoutPage,
    Register1Page,
    Register2Page,
    Register3Page,
    Register5Page,
    Register6Page,
    Register4Page,
    Register0Page,
    AdminPage,
    AdminHomePage,
    AdminAppSettingsPage,
    AdminVisitorHistoryPage,
    AdminVisitorDataPage,
    Graph1Page,
    Graph2Page,
    Graph3Page,
    Graph4Page,
    Questionnaire1Page,
    Questionnaire2Page,
    Questionnaire3Page,
    Questionnaire4Page,
    Questionnaire6Page,
    Questionnaire7Page,
    Questionnaire9Page,
    Questionnaire10Page,
    Questionnaire11Page,
    GraphScatter1Page,
    GraphScatter2Page,
    GraphScatter3Page,
    GraphScatter4Page,
    GraphScatter5Page,
    GraphPie2Page,
    GraphPie3Page,
    GraphPie4Page,
    GraphPie5Page,
    GraphBar1Page,
    GraphBar2Page,
    GraphBar3Page,
    GraphBar4Page,
    GraphBar5Page,

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
    CsvDownloadsPage,
    
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomepagePage,
    LoginPage,
    LogoutPage,
    Register0Page,
    Register1Page,
    Register2Page,
    Register3Page,
    Register4Page,
    Register5Page,
    Register6Page,
    Questionnaire1Page,
    Questionnaire2Page,
    Questionnaire3Page,
    Questionnaire4Page,
    Questionnaire6Page,
    Questionnaire7Page,
    Questionnaire9Page,
    Questionnaire10Page,
    Questionnaire11Page,
    
    AdminPage,
    AdminHomePage,
    AdminAppSettingsPage,
    AdminVisitorHistoryPage,
    AdminVisitorDataPage,
    Graph1Page,
    Graph2Page,
    Graph3Page,
    Graph4Page,
    GraphScatter1Page,
    GraphScatter2Page,
    GraphScatter3Page,
    GraphScatter4Page,
    GraphScatter5Page,
    GraphPie2Page,
    GraphPie3Page,
    GraphPie4Page,
    GraphPie5Page,
    GraphBar1Page,
    GraphBar2Page,
    GraphBar3Page,
    GraphBar4Page,
    GraphBar5Page,

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
    CsvDownloadsPage


  ],
  providers: [
    SQLite,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ShareProvider,
    File,
    sqlitedatabase,
    ScreenOrientation,
    GoogleDriveProvider,
    FileTransfer,
    FileTransferObject,
    Network,
    Camera,
    FilePath,
    BackandProvider,
    ConnectionCheckProvider,
  ]
})
export class AppModule {}