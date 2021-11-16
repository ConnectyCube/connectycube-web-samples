import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  DoCheck,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'app-stream-container',
  templateUrl: './stream-container.component.html',
  styleUrls: ['./stream-container.component.scss']
})
export class StreamContainerComponent {

  @Input() currentUserId: number = 0;
  @Input() currentUserStream: any;
  @Input() currentUserIndex: number = -1;
  @Input() currentUserName:string | undefined;
  @Input() currentShareScreenIconName:string | undefined;
  @Input() switchDone:boolean | undefined;
  @Output() videoLoaded:EventEmitter<any> = new EventEmitter<any>();

  public videoWork: boolean = false;

  showVideo() {
    if(this.currentUserIndex !== 0){
      this.videoWork = true;
    }
  }
  unDisableButton(){
    this.videoLoaded.emit(false);
  }

  constructor() {
  }


}
