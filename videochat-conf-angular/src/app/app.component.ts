import {Component, OnInit} from '@angular/core';

declare let ConnectyCube:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  CREDENTIALS = {
    appId: 5574,
    authKey: "TZU3fqTqdJPzhDB",
    authSecret: "hacNUHLEbOtXHYJ",
  };


  ngOnInit() {
    ConnectyCube.init(this.CREDENTIALS);
    console.log(ConnectyCube)
  }

}
