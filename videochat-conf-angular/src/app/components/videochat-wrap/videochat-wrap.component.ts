import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-videochat-wrap',
  templateUrl: './videochat-wrap.component.html',
  styleUrls: ['./videochat-wrap.component.scss']
})
export class VideochatWrapComponent implements OnInit {

  public showPrejoinScreen = true;

  constructor() {
  }

  ngOnInit(): void {
  }

}
