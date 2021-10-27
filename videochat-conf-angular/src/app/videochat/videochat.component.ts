import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-videochat',
  templateUrl: './videochat.component.html',
  styleUrls: ['./videochat.component.scss']
})
export class VideochatComponent {

  countOfUsers = 3;
  userArray = this.createArray();

  createArray(){
    let arr = [];

    for (let i=0;i<this.countOfUsers;i++){
      arr.push(i);
    }
    return arr;

  }

}
