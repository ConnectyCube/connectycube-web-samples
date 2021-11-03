import {AfterViewChecked, AfterViewInit, Component, DoCheck, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-stream-container',
  templateUrl: './stream-container.component.html',
  styleUrls: ['./stream-container.component.scss']
})
export class StreamContainerComponent {

  @Input() currentUserId: number = 0;
  @Input() currentUserStream: any;
  @Input() currentUserIndex: number = -1;

  public videoWork: boolean = false;

  showVideo() {
    if(this.currentUserIndex !== 0){
      this.videoWork = true;
    }
  }

  constructor() {
  }


}
