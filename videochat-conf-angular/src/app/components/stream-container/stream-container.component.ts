import {
  Component, ElementRef,
  EventEmitter,
  Input, OnInit,
  Output, SimpleChanges,
} from '@angular/core';
import {Subject} from "rxjs";
import {DeviceDetectorService} from "ngx-device-detector";
import {Store} from "@ngrx/store";
import {State} from "../../reducers";
import {updateVideoStatus} from "../../reducers/participant.actions";
import {mediaParams} from "../../services/config";
import {LoadingService} from "../../services/loading.service";

@Component({
  selector: 'app-stream-container',
  templateUrl: './stream-container.component.html',
  styleUrls: ['./stream-container.component.scss']
})
export class StreamContainerComponent implements OnInit {

  @Input() userId: number = 0;
  @Input() userStream: any;
  @Input() userIndex: number = -1;
  @Input() userName: string | undefined;
  @Input() shareScreenIconName: string | undefined;
  @Input() userMicrophoneLevel: number | undefined;
  @Input() switchDone: boolean | undefined;
  @Input() modeGrid: boolean = true;
  @Input() userBitrate: string | undefined;
  @Input() userConnectionStatus: string | undefined = 'good';
  @Input() userVideoStatus: boolean | undefined;
  @Output() videoLoaded: EventEmitter<any> = new EventEmitter<any>();

  public videoWork: boolean = false;
  public statsHide: boolean = true;
  public isMobile = this.deviceService.isMobile();
  public isTablet = this.deviceService.isTablet();
  public bgImageNum: number = 1;

  onChanges = new Subject<SimpleChanges>();

  constructor(
    private elementRef: ElementRef,
    private deviceService: DeviceDetectorService,
    private store$: Store<State>,
  ) {
  }

  randomNumber(min: number, max: number) {
    return Math.trunc(Math.random() * (max - min) + min);
  }

  showVideo() {
    console.warn(this.modeGrid);
    console.warn("userVideoStatus", this.userVideoStatus)
    if (!mediaParams.video) {
      this.store$.dispatch(updateVideoStatus({id: 77777, videoStatus: false}));
      console.warn("userVideoStatus FAlSE", this.userVideoStatus)
      mediaParams.video = true;
    }
    else if (mediaParams.video) {
      this.store$.dispatch(updateVideoStatus({id: this.userId, videoStatus: true}));
      console.warn("userVideoStatus TRUE", this.userVideoStatus)
    }
  }

  unDisableButton() {
    this.videoLoaded.emit(false);
  }

  toFullScreen(e: any) {
    const videoTagID = [...e.target.closest('.fullscreen').classList]
      .find((className: string) => className.includes('btn-')).replace('btn-', 'stream-');
    const videoTag = this.elementRef.nativeElement.querySelector('#' + videoTagID);
    if (videoTag.requestFullscreen) {
      videoTag.requestFullscreen({navigationUI: "hide"});
    }
    else if (videoTag.mozRequestFullScreen) {
      videoTag.mozRequestFullScreen({navigationUI: "hide"});
    }
    else if (videoTag.webkitRequestFullscreen) {
      videoTag.webkitRequestFullscreen({navigationUI: "hide"});
    }
  }

  ngOnInit() {
    this.bgImageNum = this.randomNumber(1, 10)

    console.warn(this.userStream);
  }

}
