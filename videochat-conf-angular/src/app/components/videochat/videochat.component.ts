import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {State} from "../../reducers";
import {select, Store} from "@ngrx/store";
import {selectMeetingIdRouterParam, selectRouteData} from "../../reducers/route.selectors";
import {participantSelector} from "../../reducers/participant.selectors";
import {AuthService} from "../../services/auth.service";
import {CallService} from "../../services/call.service";
import {appConfig, CREDENTIALS, mediaParams} from "../../services/config";
import {User} from "../../reducers/participant.reducer";
import {removeAllUsers} from "../../reducers/participant.actions";
import {Router} from "@angular/router";
import {UrlService} from "../../services/url.service";

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

  constructor
  (
    private router: Router,
    private urlService: UrlService,
    private store$: Store<State>,
    private authService: AuthService,
    private callService: CallService,
  ) {
  }

  public muteOrUnmuteMicro() {
    this.callService.muteOrUnmuteMicro().then(() => {
      this.microphoneIconName = this.microphoneIconName === 'mic' ? 'mic_off' : 'mic';
    });
  }

  public muteOrUnmuteVideo() {
    this.callService.muteOrUnmuteVideo().then(() => {
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
    this.callService.switchCamera(deviceId);
  }

  public shareScreen() {
    this.callService.shareScreen()
      .then((localDesktopStream: any) => {
        localDesktopStream.getVideoTracks()[0]
          .addEventListener("ended", () => {
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
          this.callService.stopSharingScreen();
          this.shareScreenIconName = 'screen_share';
        }
      })
  }

  ngOnInit() {
    if(mediaParams.video === false){
      this.videoIconName = 'videocam_off';
    }
    this.callService.getListDevices().then((mediaDevice: any) => {
      this.mediaDevice = mediaDevice;
      console.log(this.mediaDevice)
    });
  }
}
