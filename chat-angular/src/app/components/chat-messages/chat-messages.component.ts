import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-chat-messages',
  templateUrl: './chat-messages.component.html',
  styleUrls: ['./chat-messages.component.scss']
})
export class ChatMessagesComponent implements OnInit {

  public messages = [];

  constructor() {
  }

  sendMessage(e: any) {

  }

  ngOnInit(): void {
  }

}
