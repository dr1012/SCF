import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


/*
  Generated class for the ShareProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ShareProvider {
  private new_registration =  []; 
  private new_questionnaire = [];

  constructor(public http: HttpClient) {
    console.log('Hello ShareProvider Provider');
  }

getElements(){
 return this.new_registration;
}

clear(){
  this.new_registration = [];
}

addElements(element){
  this.new_registration.push(element);
}




getQuestionnaireElement(i){
  return this.new_questionnaire[i];
 }


getQuestionnaireElements(){
  return this.new_questionnaire;
 }
 
 QuestionnaireClear(){
   this.new_questionnaire = [];
 }
 
 QuestionnaireAddElements(element){
   this.new_questionnaire.push(element);
 }
 
 QuestionnaireGetElement(i){
   return this.new_questionnaire[i];
  }

}
