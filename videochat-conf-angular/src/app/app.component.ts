import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{

  isAuthorization = false;

  changeIsAuthorization(event:boolean){

    this.isAuthorization = event;

  }


}
