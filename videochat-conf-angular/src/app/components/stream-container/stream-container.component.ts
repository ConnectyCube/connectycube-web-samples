import {
  Component, ElementRef,
  EventEmitter,
  Input, OnChanges,
  Output, SimpleChanges,
} from '@angular/core';
import {Subject} from "rxjs";
import {DeviceDetectorService} from "ngx-device-detector";

@Component({
  selector: 'app-stream-container',
  templateUrl: './stream-container.component.html',
  styleUrls: ['./stream-container.component.scss']
})
export class StreamContainerComponent {

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
  @Output() videoLoaded: EventEmitter<any> = new EventEmitter<any>();

  public videoWork: boolean = false;
  public statsHide: boolean = true;
  public isMobile = this.deviceService.isMobile();
  public isTablet = this.deviceService.isTablet();

  onChanges = new Subject<SimpleChanges>();

  showVideo() {
    console.warn(this.modeGrid);
    if (this.userIndex === 0 && this.modeGrid) {
      this.videoWork = false;
    }
    else {
      this.videoWork = true;
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

  constructor(
    private elementRef: ElementRef,
    private deviceService: DeviceDetectorService,
  ) {
  }


}
