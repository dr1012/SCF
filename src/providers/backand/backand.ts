import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Http, Headers, HttpModule  } from '@angular/http';
import { ErrorHandler } from '@angular/core';

/*
  Generated class for the BackandProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BackandProvider {

  auth_token: {header_name: string, header_value: string} = {header_name: 'AnonymousToken', header_value: '25d59e1a-64af-4ec1-9cd0-91eb2516a8e2'};
  api_url: string = 'https://api.backand.com:443';
  app_name: string = 'scfapp';
 
  constructor(public http: Http) {}
 
  private authHeader() {
    var authHeader = new Headers();
    authHeader.append(this.auth_token.header_name, this.auth_token.header_value);
    return authHeader;
  }
 
  public getRegistrations() {
    return this.http.get(this.api_url + '/1/objects/registration', {
      headers: this.authHeader()
    })
    .map(res => res.json())
  }

  public getLoginData() {
    return this.http.get(this.api_url + '/1/objects/login_history', {
      headers: this.authHeader()
    })
    .map(res => res.json())
  }

  public getRegistrationQuestionnaireData() {
    return this.http.get(this.api_url + '/1/objects/registration_questionnaire', {
      headers: this.authHeader()
    })
    .map(res => res.json())
  }


  public getDiversityQuestionnaireData() {
    return this.http.get(this.api_url + '/1/objects/diversity_questionnaire', {
      headers: this.authHeader()
    })
    .map(res => res.json())
  }

  
 
  public addRegistration(registration: string[]) {
    let data = JSON.stringify({user_id: registration[0], first_name: registration[1], last_name: registration[2], email_address: registration[3], phone_number: registration[4], address: registration[5], postcode: registration[6], emergency_name: registration[7], emergency_telephone: registration[8], emergency_relationship: registration [9]});
    console.log("print from backand.ts shows what stringify looks like: "+ data)
    return this.http.post(this.api_url + '/1/objects/registration', data,
    {
      headers: this.authHeader()
    })
    .map(res => {
      return res.json();

    });
  }

  public addRegistrationData(data) {

    return this.http.post(this.api_url + '/1/objects/registration', data,
    {
      headers: this.authHeader()
    })
    .map(res => {
      return res.json();

    })
   
  }


  public getSingleRegistration(user_id:string) {
    
    return this.http.get(this.api_url + '/1/objects/registration/' + user_id , {
      headers: this.authHeader()
    })
    .map(res => res.json());
  
 
  }


  public getRegistrationsAsArray() {
     this.http.get(this.api_url + '/1/objects/registration', {
      headers: this.authHeader()
    })
    .map(res => res.json()).subscribe(data =>{
      console.log(data);
    });
    
  }

  public addLoginData(data) {
    
        return this.http.post(this.api_url + '/1/objects/login_history', data,
        {
          headers: this.authHeader()
        })
        .map(res => {
          return res.json();
    
        })
       
      }


      public addRegistrationQuestionnaireData(data) {
        
            return this.http.post(this.api_url + '/1/objects/registration_questionnaire', data,
            {
              headers: this.authHeader()
            })
            .map(res => {
              return res.json();
        
            })
           
          }



      public addDiversityQuestionnaireData(data) {
        
            return this.http.post(this.api_url + '/1/objects/diversity_questionnaire', data,
            {
              headers: this.authHeader()
            })
            .map(res => {
              return res.json();
        
            })
           
          }




  }


  

  


 
  

















  


