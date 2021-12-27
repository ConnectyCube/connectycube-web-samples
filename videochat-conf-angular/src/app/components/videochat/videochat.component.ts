import {Component, OnDestroy, OnInit} from '@angular/core';
import {State} from "../../reducers";
import {select, Store} from "@ngrx/store";
import {selectMeetingIdRouterParam} from "../../reducers/route.selectors";
import {participantSelector, participantSortSelector} from "../../reducers/participant.selectors";
import {AuthService} from "../../services/auth.service";
import {CallService} from "../../services/call.service";
import {mediaParams} from "../../services/config";
import {removeAllUsers, updateVideoStatus} from "../../reducers/participant.actions";
import {Router} from "@angular/router";
import {UrlService} from "../../services/url.service";
import {DeviceDetectorService} from "ngx-device-detector";
import {User} from "../../reducers/participant.reducer";
import {
  chatStatusSelector,
  controlButtonsStatusSelector,
  interfaceSelector, showRecordButtonStatusSelector,
  switchVideoStatusSelector
} from "../../reducers/interface.selectors";
import {LoadingService} from "../../services/loading.service";
import {addChatOpenStatus, addControlButtonsStatus, addSwitchVideoStatus} from "../../reducers/interface.actions";
import {take} from "rxjs/operators";
import {ChatService} from "../../services/chat.service";

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
  public recordIconName = '';
  public isMobile = this.deviceService.isMobile();
  public isTablet = this.deviceService.isTablet();
  public MicroConnect: any;
  public CameraConnect: any;
  public Interface$ = this.store$.select(interfaceSelector);
  public videoPermission: any;
  public isRecording: any;
  public selectedValue: string = 'grid';
  public startSliceSide = 0;
  public endSliceSide = 1;
  public startSliceGrid = 0;
  public subscribeParticipantArray: any;
  public loading$ = this.loader.loading$;
  public recordBtnBg: any;
  public recordIconBg: any;
  public showRecord = this.store$.select(showRecordButtonStatusSelector);

  constructor
  (
    private router: Router,
    private urlService: UrlService,
    private store$: Store<State>,
    private authService: AuthService,
    private callService: CallService,
    private chatService: ChatService,
    private deviceService: DeviceDetectorService,
    public loader: LoadingService,
  ) {
  }

  private checkConnect() {
    navigator.mediaDevices.enumerateDevices()
      .then((dev: any) => {
        const InputDevice = dev.filter((device: any) => device.kind.includes('input'));
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

  private stopSharing() {
    if (this.videoPermission === false || this.videoIconName === 'videocam_off') {
      this.store$.dispatch(updateVideoStatus({id: 77777, videoStatus: false}));

      this.store$.select(participantSelector).pipe(take(1)).subscribe(res => {
        res.forEach((user: User) => {
          if (!user.me) {
            this.chatService.sendSystemMsg("VIDEO_OFF", user.id);
          }
        })
      })

      this.callService.stopSharingScreen('', false);
      this.shareScreenIconName = 'screen_share';
      return;
    }
    else {
      this.store$.dispatch(updateVideoStatus({id: 77777, videoStatus: true}));
      this.videoIconName = 'videocam';

      this.store$.select(participantSelector).pipe(take(1)).subscribe(res => {
        res.forEach((user: User) => {
          if (!user.me) {
            this.chatService.sendSystemMsg("SHARE_OFF", user.id);
          }
        })
      })
    }


    this.callService.stopSharingScreen();
    this.shareScreenIconName = 'screen_share';
  }

  trackById(index: number, user: User) {
    return user.id;
  }

  public muteOrUnmuteMicro() {
    this.callService.muteOrUnmuteMicro().then((microphoneIconName) => {
      this.microphoneIconName = microphoneIconName;
    });
  }

  public muteOrUnmuteVideo() {
    if (this.shareScreenIconName === 'stop_screen_share') {
      console.log("SCREEN SHARE IF", this.shareScreenIconName)
      this.callService.stopSharingScreen();

      this.store$.dispatch(updateVideoStatus({id: 77777, videoStatus: true}));
      this.store$.select(participantSelector).pipe(take(1)).subscribe(res => {
        res.forEach((user: User) => {
          if (!user.me) {
            this.chatService.sendSystemMsg("SHARE_OFF", user.id);
          }
        })
      })

      this.shareScreenIconName = 'screen_share';
      if (this.videoIconName === 'videocam_off') {
        this.videoIconName = 'videocam';
      }
    }
    else {
      console.log("VIDEO ELSE", this.shareScreenIconName)
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
    this.loader.hide();
    console.log("DISABLE", disable);
    this.DisableButton = disable;
  }

  public switchCamera(event: any) {
    const deviceId = event.target.name;
    this.switchVideoActive = false;
    if (this.shareScreenIconName === 'stop_screen_share') {
      this.callService.stopSharingScreen(deviceId);

      this.store$.dispatch(updateVideoStatus({id: 77777, videoStatus: true}));
      this.store$.select(participantSelector).pipe(take(1)).subscribe(res => {
        res.forEach((user: User) => {
          if (!user.me) {
            this.chatService.sendSystemMsg("SHARE_OFF", user.id);
          }
        })
      })

      this.shareScreenIconName = 'screen_share';
      if (this.videoIconName === 'videocam_off') {
        this.videoIconName = 'videocam';
      }
    }
    else {
      this.callService.switchCamera(deviceId, this.videoIconName).then(() => {
        this.store$.dispatch(updateVideoStatus({id: 77777, videoStatus: true}));

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
        console.warn(localDesktopStream);

        console.log("Then Videochat Component")

        this.store$.dispatch(updateVideoStatus({id: 77777, videoStatus: 'share'}));

        localDesktopStream.getVideoTracks()[0]
          .addEventListener("ended", () => {
            this.stopSharing();
          });

        this.shareScreenIconName = 'stop_screen_share';
      })
      .catch((error: any) => {
        console.log("Catch Videochat Component")
        if (error) {
          console.log(error)
        }
        else {
          console.log("Catch ELSE Videochat Component")
          this.stopSharing();
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

  toggleChat() {
    this.store$.select(chatStatusSelector).pipe(take(1)).subscribe(chatOpenStatus => {
      if (chatOpenStatus !== undefined) {
        chatOpenStatus = !chatOpenStatus;
        this.store$.dispatch(addChatOpenStatus({chatOpenStatus}))
      }
    })
  }

  public toggleControlButtons() {
    this.store$.dispatch(addSwitchVideoStatus({switchVideoStatus: false}));
    this.store$.select(controlButtonsStatusSelector).pipe(take(1))
      .subscribe(controlButtonsStatus => {
        if (controlButtonsStatus !== undefined) {
          controlButtonsStatus = !controlButtonsStatus;
          this.store$.dispatch(addControlButtonsStatus({controlButtonsStatus}))
        }
      })
  }

  public recording() {
    if (!this.recordIconName) {
      this.callService.recordingStart().then(() => {
        this.recordIconBg = '#dc143c';
        this.recordBtnBg = '#2c2c2e';
        this.recordIconName = 'stop';
      })
    }
    else {
      this.callService.recordingStop().then(() => {
        this.recordBtnBg = '#dc143c';
        this.recordIconName = '';
      })
    }
  }

  ngOnInit() {
    this.loader.show();

    this.store$.dispatch(addControlButtonsStatus({controlButtonsStatus: true}));
    this.store$.dispatch(addSwitchVideoStatus({switchVideoStatus: false}));
    this.store$.select(controlButtonsStatusSelector).subscribe(controlButtonsStatus => {
      if (controlButtonsStatus !== undefined) {
        controlButtonsStatus = !controlButtonsStatus;
        this.hideButtons = controlButtonsStatus;
      }
    })
    this.store$.select(switchVideoStatusSelector).subscribe(switchVideoStatus => {
      if (switchVideoStatus !== undefined) {
        this.switchVideoActive = switchVideoStatus;
      }
    })


    this.participantArray$.subscribe(res => {
      if (res.length === 1 && this.sidebarStatus) {
        this.gridView();
      }
    })
    this.Interface$.subscribe(res => {
      this.videoPermission = res.videoPermission;
    })
    this.Interface$.subscribe(res => {
      if (res.isRecording !== undefined) {
        this.isRecording = res.isRecording;
      }
    })

    this.checkConnect();

    console.log("VIDEO PERM", this.videoPermission);

    navigator.mediaDevices.addEventListener('devicechange', () => {
      this.checkConnect();
      this.callService.getListDevices().then((mediaDevice: any) => {
        this.mediaDevice = mediaDevice;
        console.log(this.mediaDevice)
      });
    })
    if (!mediaParams.video) {
      this.videoIconName = 'videocam_off';
    }
    this.callService.getListDevices().then((mediaDevice: any) => {
      this.mediaDevice = mediaDevice;
      console.log(this.mediaDevice)
    });
  }

  ngOnDestroy() {
    if (this.callService.getParticipantArrayLength() > 1) {
      this.callService.stopCheckUserMicLevel();
    }
  }
}
