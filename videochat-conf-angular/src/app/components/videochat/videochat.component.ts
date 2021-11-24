import {Component, OnDestroy, OnInit} from '@angular/core';
import {State} from "../../reducers";
import {select, Store} from "@ngrx/store";
import {selectMeetingIdRouterParam} from "../../reducers/route.selectors";
import {participantSelector, participantSortSelector} from "../../reducers/participant.selectors";
import {AuthService} from "../../services/auth.service";
import {CallService} from "../../services/call.service";
import {mediaParams} from "../../services/config";
import {removeAllUsers} from "../../reducers/participant.actions";
import {Router} from "@angular/router";
import {UrlService} from "../../services/url.service";
import {DeviceDetectorService} from "ngx-device-detector";
import {PermissionsService} from "../../services/permissions.service";
import {take} from "rxjs/operators";
import {User} from "../../reducers/participant.reducer";
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-videochat',
  templateUrl: './videochat.component.html',
  styleUrls: ['./videochat.component.scss']
})
export class VideochatComponent implements OnInit, OnDestroy {

  public gridStatus: boolean = true;
  public sidebarStatus: boolean = false;
  public meetingId$ = this.store$.pipe(select(selectMeetingIdRouterParam));
  public participantArray$ = this.store$.select(this.gridStatus ? participantSelector : participantSortSelector);
  public participantArray: any;
  public hideButtons: boolean = false;
  public microphoneIconName: string = 'mic';
  public videoIconName: string = 'videocam';
  public DisableButton: boolean = true;
  public mediaDevice: any;
  public switchVideoActive: boolean = false;
  public switchDone: boolean = false
  public shareScreenIconName = 'screen_share';
  public isMobile = this.deviceService.isMobile();
  public isTablet = this.deviceService.isTablet();
  public MicroConnect = false;
  public CameraConnect = false;
  public videoPermission: any;
  public selectedValue: string = 'grid';
  public startSliceSide = 0;
  public endSliceSide = 1;
  public startSliceGrid = 0;
  public subscribeParticipantArray: any;

  constructor
  (
    private router: Router,
    private urlService: UrlService,
    private store$: Store<State>,
    private authService: AuthService,
    private callService: CallService,
    private deviceService: DeviceDetectorService,
    private permission: PermissionsService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon('fullscreen',
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets//icons/fullscreen_white_24dp.svg"));
    this.matIconRegistry.addSvgIcon('connection',
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets//icons/connection.svg"));
    this.matIconRegistry.addSvgIcon('videocam',
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets//icons/videocam_white_24dp.svg"));
    this.matIconRegistry.addSvgIcon('videocam_off',
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets//icons/videocam_off_white_24dp.svg"));
    this.matIconRegistry.addSvgIcon('mic',
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets//icons/mic_white_24dp.svg"));
    this.matIconRegistry.addSvgIcon('mic_off',
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets//icons/mic_off_white_24dp.svg"));
    this.matIconRegistry.addSvgIcon('phone_missed',
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets//icons/phone_missed_white_24dp.svg"));
    this.matIconRegistry.addSvgIcon('switch_video',
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets//icons/switch_video_white_24dp.svg"));
    this.matIconRegistry.addSvgIcon('screen_share',
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets//icons/screen_share_black_24dp.svg"));
    this.matIconRegistry.addSvgIcon('stop_screen_share',
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets//icons/stop_screen_share_black_24dp.svg"));
  }

  private checkPermissions() {
    this.permission.checkVideoPermission().then((perm: any) => {
      if (perm === 'denied') {
        this.videoPermission = true;
      }
      else if (perm === 'granted') {
        this.videoPermission = false;
      }
    })
      .catch(() => {
        this.videoPermission = 'granted';
      })
  }

  private checkConnect() {
    navigator.mediaDevices.enumerateDevices()
      .then((dev: any) => {
        const InputDevice = dev.filter((device: any) => device.kind.includes('input'))
        console.log(InputDevice);
        this.MicroConnect = InputDevice.some((device: any) => device.kind === "audioinput");
        this.CameraConnect = InputDevice.some((device: any) => device.kind === "videoinput");
        console.log("Micro", this.MicroConnect);
        console.log("Camera", this.CameraConnect);
      })
  }

  private gridView() {
    console.log('[Grid View]');
    this.participantArray$ = this.store$.select(participantSelector);
    this.callService.setCurrentMode('grid');
    this.gridStatus = true;
    this.sidebarStatus = false;
    this.startSliceGrid = 0;
  }

  private sidebarView() {
    console.log('[Sidebar View]');
    this.participantArray$ = this.store$.select(participantSortSelector);
    this.callService.setCurrentMode('sidebar');
    this.gridStatus = false;
    this.sidebarStatus = true;
    this.startSliceGrid = 1;
  }

  trackById(index: number, user: User) {
    return user.id;
  }

  public muteOrUnmuteMicro() {
    this.callService.muteOrUnmuteMicro().then(() => {
      this.microphoneIconName = this.microphoneIconName === 'mic' ? 'mic_off' : 'mic';
    });
  }

  public muteOrUnmuteVideo() {
    if (this.shareScreenIconName === 'stop_screen_share') {
      this.callService.stopSharingScreen();
      this.shareScreenIconName = 'screen_share';
      if (this.videoIconName === 'videocam_off') {
        this.videoIconName = 'videocam';
      }
    }
    else {
      this.callService.muteOrUnmuteVideo(this.videoIconName === 'videocam').then(() => {
        this.videoIconName = this.videoIconName === 'videocam' ? 'videocam_off' : 'videocam';
      })
    }
  }

  public stopCall() {
    this.callService.stopCall()
      .then(() => {
        this.router.navigateByUrl("/")
          .then(() => {
            this.store$.dispatch(removeAllUsers());
          })
      })
  }

  public ChangeDisable(disable: boolean) {
    this.DisableButton = disable;
  }

  public switchCamera(event: any) {
    const deviceId = event.target.name;
    if (this.shareScreenIconName === 'stop_screen_share') {
      this.callService.stopSharingScreen(deviceId);
      this.shareScreenIconName = 'screen_share';
    }
    else {
      this.callService.switchCamera(deviceId, this.videoIconName).then(() => {
        this.videoIconName = 'videocam';
      }).catch(() => {
        if (this.isMobile) {
          this.switchDone = !this.switchDone;
        }
        else {
          this.switchDone = false;
        }
      })
      if (this.isMobile) {
        this.switchDone = !this.switchDone;
      }
    }
  }

  public shareScreen() {
    this.callService.shareScreen()
      .then((localDesktopStream: any) => {
        localDesktopStream.getVideoTracks()[0]
          .addEventListener("ended", () => {
            if (this.videoIconName === 'videocam_off') {
              this.videoIconName = 'videocam';
            }
            this.callService.stopSharingScreen();
            this.shareScreenIconName = 'screen_share';
          });
        this.shareScreenIconName = 'stop_screen_share';
      })
      .catch((error: any) => {
        if (error) {
          console.log(error)
        }
        else {
          if (this.videoIconName === 'videocam_off') {
            this.videoIconName = 'videocam';
          }
          this.callService.stopSharingScreen();
          this.shareScreenIconName = 'screen_share';
        }
      })
  }

  public changeView() {
    switch (this.selectedValue) {
      case "grid":
        this.gridView();
        break;
      case "sidebar":
        this.sidebarView();
        break;
      default:
        this.gridView();
    }
  }

  setNgClassProperty(arrayLength: any) {
    return {
      ['grid-' + arrayLength]: this.gridStatus,
      'sidebar-view': this.sidebarStatus,
      'grid': this.gridStatus,
      'sidebar': this.sidebarStatus
    };
  }

  ngOnInit() {
    this.participantArray$.subscribe(res => {
      if (res.length === 1 && this.sidebarStatus) {
        this.gridView();
      }
    })

    // this.checkConnect();
    // this.checkPermissions();
    // navigator.mediaDevices.addEventListener('devicechange', () => {
    //   this.checkConnect();
    //   this.callService.getListDevices().then((mediaDevice: any) => {
    //     this.mediaDevice = mediaDevice;
    //     console.log(this.mediaDevice)
    //   });
    // })
    if (!mediaParams.video) {
      this.videoIconName = 'videocam_off';
    }
    // this.callService.getListDevices().then((mediaDevice: any) => {
    //   this.mediaDevice = mediaDevice;
    //   console.log(this.mediaDevice)
    // });
  }

  ngOnDestroy() {
    if (this.callService.getParticipantArrayLength() > 1) {
      this.callService.stopCheckUserMicLevel();
    }
  }
}
