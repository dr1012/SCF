import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http, Headers, HttpModule  } from '@angular/http';
import { sqlitedatabase } from '../../providers/sqlitedatabase/sqlitedatabase';

@Injectable()
export class GoogleformsProvider {
 
  registrationArray = [];
  latestTimeStamp = '';
  latestTimeStamp2 = '';
  valueChangeStatus = false;
  valueChangeStatus2 = false;
  constructor(public http: Http, private sqlitedatabase: sqlitedatabase) {
    
  }


getGoogleDocRegistrationData(){
  this.updateLastSync();


  this.http.get('https://sheets.googleapis.com/v4/spreadsheets/1t5AGJgB67IL9lqQyVqVSR4YJALsLGWCvHQheGr5lTDM/values/A2%3AZZZ?key=AIzaSyB1gTt1BzWO6sueuIYAwabWPfgWE6MZrOU').map(res => res.json()).subscribe(data => {
    for(var i = 0; i<data.values.length; i++){
      var lastGoogleTimestamp = data.values[i][0];
    
      
     
      var lastGoogleTimestampUTC = this.spliceDateToUTC(lastGoogleTimestamp);

          
      console.log("unmodified lastgoogletimestamp2: "+ lastGoogleTimestampUTC)
      console.log("unmodified lastgoogletimestamp: "+ lastGoogleTimestamp)
          console.log("parsed lastTimestamp: "+ this.latestTimeStamp);
          console.log("parsed lastGoogleTimestamp: "+ Date.parse(lastGoogleTimestampUTC));
          if(Date.parse(lastGoogleTimestampUTC)>+this.latestTimeStamp){
            console.log ("adding new data from google sheets because new data available");
          let inputArray = [];
          let outputRegistrationArray = [];
         
    
          for(var j = 0; j<data.values[i].length; j++){
            
            inputArray.push(data.values[i][j]);
            
          }
        console.log("inputArray: " + inputArray)  ;
        this.spliceDataForRegistration(inputArray,outputRegistrationArray);
        this.registerUserFromDB(outputRegistrationArray);
          this.valueChangeStatus = true;
        }
        
      
}
 
if(this.valueChangeStatus){
  this.sqlitedatabase.setLastSync(Date.parse(lastGoogleTimestampUTC));
  this.valueChangeStatus = false;
}
  });


}
  


getGoogleDocDiversityQuestionnaireData(){
  this.updateLastSync2();
  

   this.http.get('https://sheets.googleapis.com/v4/spreadsheets/1L2xWuxWk-y1V7jqJCUogYc2R5eRj0xjfKAOhBLeSHfI/values/A2%3AZZZ?key=AIzaSyB1gTt1BzWO6sueuIYAwabWPfgWE6MZrOU').map(res => res.json()).subscribe(data => {
    for(var i = 0; i<data.values.length; i++){
      var lastGoogleTimestamp = data.values[i][0];
    
      var lastGoogleTimestampUTC = this.spliceDateToUTC(lastGoogleTimestamp);

          console.log("unmodified lastgoogletimestamp2: "+ lastGoogleTimestampUTC)
          console.log("unmodified lastgoogletimestamp: "+ lastGoogleTimestamp)
          console.log("unparsed lastTimestamp: "+ this.latestTimeStamp2);
          console.log("parsed lastGoogleTimestamp: "+ Date.parse(lastGoogleTimestampUTC));
          if(Date.parse(lastGoogleTimestampUTC)>+this.latestTimeStamp2){
            console.log ("adding new data from google sheets because new data available");
          let inputArray = [];
          let outputRegistrationArray = [];

          for(var j = 0; j<data.values[i].length; j++){
            
            inputArray.push(data.values[i][j]);
            
          }

        console.log("inputArray: " + inputArray);
        this.spliceDataForDiversityQuestionnaire(inputArray,outputRegistrationArray);

        for(var l = 0; l<9 ;l++){
        this.addDiversityAnswer(l+1,outputRegistrationArray[l],data.values[i][0]);
        }
        this.valueChangeStatus2 = true;

        }
        
      
}

if(this.valueChangeStatus2){
  this.sqlitedatabase.setLastSync2(Date.parse(lastGoogleTimestampUTC));
  this.valueChangeStatus2 = false;
}
  });

}

  

public updateLastSync(){

  this.sqlitedatabase.getLastSync().then((data2) => {
    
           if (data2 == null) {
               console.log("no timestamp yet");
               return;
           }
           if (data2.rows.length > 0) {
              this.latestTimeStamp = data2.rows.item(0).last_sync;
             
               console.log('maximumValue:'+data2.rows.item(0).last_sync);
 
           }
 
         });
}

public updateLastSync2(){
  
    this.sqlitedatabase.getLastSync2().then((data2) => {
      
             if (data2 == null) {
                 console.log("no timestamp yet");
                 return;
             }
             if (data2.rows.length > 0) {
                this.latestTimeStamp2 = data2.rows.item(0).last_sync;
               
                 console.log('maximumValue:'+data2.rows.item(0).last_sync);
   
             }
   
           });
  }


spliceDataForRegistration(inputArray, outputArray){
  var str = inputArray[1];

  var splitted = str.split(' ');
  //first name
  outputArray.push(splitted[0]);
  var str2 = ''
  for(var k = 1; k<splitted.length; k++){
    str2 = str2 + splitted[k] + ' ';
  }
//last name  
outputArray.push(str2);

//email
outputArray.push(inputArray[4]);

//phone number
outputArray.push(inputArray[3]);

//address with postcode
outputArray.push(inputArray[2]);

//instead of postcode
outputArray.push("");

//emergency_name
outputArray.push(inputArray[16]);

//emergency_telephone
outputArray.push(inputArray[17]);

//emergency_relationship
outputArray.push(inputArray[18]);


}





spliceDataForDiversityQuestionnaire(inputArray, outputArray){
 
outputArray.push(inputArray[1]);
outputArray.push(inputArray[2]);
outputArray.push(inputArray[3]);
outputArray.push(inputArray[4]);
outputArray.push(inputArray[5]);
outputArray.push(inputArray[6]);
outputArray.push(inputArray[7]);
outputArray.push(inputArray[8]);
outputArray.push(inputArray[9]);


}





spliceDateToUTC(inputDate): string {
  var outputUTCDate = '';
  var splitted = inputDate.split('/', 3);
  var splitted2 = splitted[2].split(' ');
  outputUTCDate = outputUTCDate + splitted2[0] +'-'+ splitted[1] +'-'+ splitted[0] + ' ' + splitted2[1];
  console.log(outputUTCDate);
  return outputUTCDate;
}



addRegistrationQuestionnaireToDB(data): Promise<any> {
  var sql =   "insert into question_response(\
                  id, user_id, \
                  recorded_at, \
                  question_id, option_text\
              ) values (?,?,?,?,?)";
  var values = [
                  data[0], 
                  data[1], 
                  data[2], 
                  data[3],
                  data[4]
               ];
                        
  return this.sqlitedatabase.db.executeSql(sql,values).catch(e => console.log(e));
}



registerUserFromDB(dataArray): Promise<any> {
  var sql =   "insert into sutton_user(\
                 first_name, last_name, \
                  email_address, \
                  phone_number, \
                  address, postcode, \
                  emergency_name,\
                  emergency_telephone,\
                  emergency_relationship\
              ) values (?,?,?,?,?,?,?,?,?)";
  var values = [
    dataArray[0], 
    dataArray[1], 
    dataArray[2], 
    dataArray[3], 
    dataArray[4], 
    dataArray[5],
    dataArray[6],
    dataArray[7],
    dataArray[8]
               ];
                        
  return this.sqlitedatabase.db.executeSql(sql,values).catch(e => console.log(e));
}


public addDiversityAnswer(question_id:number,answer:string, timestamp:string){        
    let insert_sql = "INSERT INTO diversity_response (\
                        question_id, option_text, recorded_at)\
                        VALUES (?, ?, ?)";
            let params = [question_id, answer, timestamp];
            this.sqlitedatabase.db.executeSql(insert_sql, params)


 }


}
