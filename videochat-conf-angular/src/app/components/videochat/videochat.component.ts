import {Component, OnInit} from '@angular/core';
import {State} from "../../reducers";
import {select, Store} from "@ngrx/store";
import {selectMeetingIdRouterParam} from "../../reducers/route.selectors";
import {participantSelector} from "../../reducers/participant.selectors";
import {AuthService} from "../../services/auth.service";
import {CallService} from "../../services/call.service";
import {mediaParams} from "../../services/config";
import {removeAllUsers} from "../../reducers/participant.actions";
import {Router} from "@angular/router";
import {UrlService} from "../../services/url.service";
import {DeviceDetectorService} from "ngx-device-detector";
import {PermissionsService} from "../../services/permissions.service";

@Component({
  selector: 'app-videochat',
  templateUrl: './videochat.component.html',
  styleUrls: ['./videochat.component.scss']
})
export class VideochatComponent implements OnInit {

  public meetingId$ = this.store$.pipe(select(selectMeetingIdRouterParam));
  public participantArray$ = this.store$.select(participantSelector);
  public hideButtons: boolean = false;
  public microphoneIconName: string = 'mic';
  public videoIconName: string = 'videocam';
  public DisableButton: boolean = true;
  public mediaDevice: any;
  public switchVideoActive: boolean = false;
  public shareScreenIconName = 'screen_share';
  public isMobile = this.deviceService.isMobile();
  public isTablet = this.deviceService.isTablet();
  public MicroConnect = false;
  public CameraConnect = false;
  public videoPermission: any;

  constructor
  (
    private router: Router,
    private urlService: UrlService,
    private store$: Store<State>,
    private authService: AuthService,
    private callService: CallService,
    private deviceService: DeviceDetectorService,
    private permission: PermissionsService,
  ) {
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

  public muteOrUnmuteMicro() {
    this.callService.muteOrUnmuteMicro().then(() => {
      this.microphoneIconName = this.microphoneIconName === 'mic' ? 'mic_off' : 'mic';
    });
  }

  public muteOrUnmuteVideo() {
    this.callService.muteOrUnmuteVideo(this.videoIconName === 'videocam').then(() => {
      this.videoIconName = this.videoIconName === 'videocam' ? 'videocam_off' : 'videocam';
    })
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
    this.callService.switchCamera(deviceId, this.videoIconName).then(() => {
      this.videoIconName = 'videocam';
    });
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

  ngOnInit() {
    this.checkConnect();
    this.checkPermissions();
    navigator.mediaDevices.addEventListener('devicechange', () => {
      this.checkConnect();
      this.callService.getListDevices().then((mediaDevice: any) => {
        this.mediaDevice = mediaDevice;
        console.log(this.mediaDevice)
      });
    })
    if (mediaParams.video === false) {
      this.videoIconName = 'videocam_off';
    }
    this.callService.getListDevices().then((mediaDevice: any) => {
      this.mediaDevice = mediaDevice;
      console.log(this.mediaDevice)
    });
  }
}
