import { Component } from '@angular/core';

/**
 * Generated class for the TapRevealComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'tap-reveal',
  templateUrl: 'tap-reveal.html'
})
export class TapRevealComponent {

  text: string;

  constructor() {
    console.log('Hello TapRevealComponent Component');
    this.text = 'Hello World';
  }

}
