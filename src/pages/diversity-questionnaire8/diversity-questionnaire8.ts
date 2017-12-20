import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { DiversityQuestionnaire9Page } from '../diversity-questionnaire9/diversity-questionnaire9';
import { HomepagePage } from '../homepage/homepage';

import {AlertController } from 'ionic-angular';

import { sqlitedatabase } from '../../providers/sqlitedatabase/sqlitedatabase';
import { QuestionnaireDatabaseProvider } from '../../providers/questionnaire-database/questionnaire-database';

@IonicPage()
@Component({
  selector: 'page-diversity-questionnaire8',
  templateUrl: 'diversity-questionnaire8.html',
})
export class DiversityQuestionnaire8Page {
  
    
    
      choices: string[] = [
        "Working full or part time", "Unemployed", "Not working - due to health issues/disability", "Not working  - looking after house/children", "Not working - Retired", "Student", "Self-employed", "Other"
    ];
    
    responses:boolean[];
    response_text = '';
    
    question_id:number = 0;
    question_text:string = '';
    
    
    constructor(public navCtrl: NavController,  
        private alertController: AlertController, 
        private sqlitedatabase :sqlitedatabase, 
        private questionnairedb: QuestionnaireDatabaseProvider ) {
        this.getDiversityQuestion();
        this.responses = this.choices.map(function(x,i){ return false; })
    
    }
    
    getDiversityQuestion(){
        this.sqlitedatabase.getDiversityQuestion(8)
            .then((data) => {
                if (data == null) {
                    console.log("no data in table");
                    return;
                }
                if (data.rows.length > 0) {
                    this.question_id = data.rows.item(0).id;
                    this.question_text = data.rows.item(0).question_text;
                    console.log('question:'+this.question_text);
                }
            }, err => {
                console.log('Error: ', err);
            }); 
    }
    
    goNext(){
        if(this.responses.indexOf(true) > -1){
            let all_choices = this.choices;
            let input_text = this.response_text;
            console.log("responses:"+this.responses);
            let selected = this.responses
            .map(function(x, i){
              if(x){
                  if (i < all_choices.length -1 )
                      return all_choices[i];
                  else
                      return input_text;
              }
          }).filter(function(x, i) { return x!= null;});
            console.log("selected:"+selected);
            this.sqlitedatabase.addToDiversityCache(this.question_id, selected);
            this.sqlitedatabase.logDiversityCache();
    
            //this.sqlitedatabase.insertCachedAnswers(0);
    
            this.navCtrl.push(DiversityQuestionnaire9Page);
        }
        else{
            let addTodoAlert=this.alertController.create({ 
                message: "Please select at least one option"
            });
            addTodoAlert.present();
        }
    }
    
    selectOnly(i:number){
        console.log("selected number index:"+i);
        this.responses = this.responses.map(function(x, index) { return i==index; });
    }
    
    goToHomepage(){
        this.navCtrl.push(HomepagePage);
    }
    
    goBack(){
        this.navCtrl.pop();
    }
    
      
    }      
    