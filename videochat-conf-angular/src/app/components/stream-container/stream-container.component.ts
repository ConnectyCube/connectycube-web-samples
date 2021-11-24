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

  @Input() currentUserId: number = 0;
  @Input() currentUserStream: any;
  @Input() currentUserIndex: number = -1;
  @Input() currentUserName: string | undefined;
  @Input() currentShareScreenIconName: string | undefined;
  @Input() currentUserMicrophoneLevel: number | undefined;
  @Input() switchDone: boolean | undefined;
  @Input() currentModeGrid: boolean = true;
  @Input() currentUserBitrate: string | undefined;
  @Input() currentConnectionStatus: string | undefined = 'good';
  @Output() videoLoaded: EventEmitter<any> = new EventEmitter<any>();

  public videoWork: boolean = false;
  public statsHide: boolean = true;
  public isMobile = this.deviceService.isMobile();
  public isTablet = this.deviceService.isTablet();

  onChanges = new Subject<SimpleChanges>();

  showVideo() {
    console.warn(this.currentModeGrid);
    if (this.currentUserIndex === 0 && this.currentModeGrid) {
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
