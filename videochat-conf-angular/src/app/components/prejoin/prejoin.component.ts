import {Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {CallService} from "../../services/call.service";
import {AuthService} from "../../services/auth.service";
import {User} from "../../reducers/participant.reducer";
import {Router} from "@angular/router";
import {UrlService} from "../../services/url.service";
import {select, Store} from "@ngrx/store";
import {selectMeetingIdRouterParam} from "../../reducers/route.selectors";
import {State} from "../../reducers";
import {appConfig, CREDENTIALS, mediaParams} from "../../services/config";
import {LoadingService} from "../../services/loading.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogWarningComponent} from "../dialog-warning/dialog-warning.component";
import {Message} from "@angular/compiler/src/i18n/i18n_ast";

@Component({
  selector: 'app-prejoin',
  templateUrl: './prejoin.component.html',
  styleUrls: ['./prejoin.component.scss']
})
export class PrejoinComponent implements OnInit, OnDestroy {

  private ourLocalStream: any;
  private AllDenied = false;
  private MicroDenied = false;
  private MicroConnect = false;
  private DoorOpen = true;

  @Output() JoinBtnClick: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('videoElement') videoTag: any;
  @ViewChild('userName') userName: any;

  public videoIconName: string = 'videocam';
  public meetingId$ = this.store$.pipe(select(selectMeetingIdRouterParam));
  public meetId: string = '';
  public previousUrl: any;
  public disableVideoBtn: any;
  public loading$ = this.loader.loading$;

  constructor(
    private authService: AuthService,
    private callService: CallService,
    private router: Router,
    private urlService: UrlService,
    private store$: Store<State>,
    public loader: LoadingService,
    public dialog: MatDialog,
  ) {
  }

  private onVideo() {
    this.loader.show();
    this.disableVideoBtn = true;
    this.callService.getLocalUserVideo().then((localStream) => {
      localStream.getAudioTracks().forEach((audioTrack: MediaStreamTrack) => {
        audioTrack.stop();
      })
      this.videoTag.nativeElement.srcObject = localStream;
      this.ourLocalStream = localStream;
    }).then(() => {
      this.loader.hide();
      this.disableVideoBtn = false;
    })
      .catch((error: any) => {
        if (error.message === 'Permission denied') {
          const messageError = `You not allow permission to use your camera or microphone,
           please necessarily give permission for use your microphone,
           at worst we can not join you to meet room`

          this.ModalOn(messageError);
          if (window.innerWidth < 768) {
            this.videoTag.nativeElement.style.width = `${window.innerWidth * 0.8}px`;
          }
          else {
            this.videoTag.nativeElement.style.width = `${window.innerWidth * 0.5}px`;
          }

          this.videoIconName = 'videocam_off';
          this.loader.hide();
        }
        else if (error.message === 'Requested device not found') {
          const messageError = `Your camera or microphone not found,
           please connect one of this devices, at worst we can not join you to meet room`;
          this.ModalOn(messageError);
          if (window.innerWidth < 768) {
            this.videoTag.nativeElement.style.width = `${window.innerWidth * 0.8}px`;
          }
          else {
            this.videoTag.nativeElement.style.width = `${window.innerWidth * 0.5}px`;
          }
          this.videoIconName = 'videocam_off';
          this.loader.hide();
        }
        else {
          console.log("OnVideo Error!", error);
        }
      });
  }

  private offVideo() {
    this.ourLocalStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
  }

  private ModalOn(message: string) {
    this.dialog.open(DialogWarningComponent, {
      data: {message: message}
    });
  }

  private checkPermissions() {
    const permissions = {audio: '', video: ''};
    navigator.permissions.query({name: 'microphone'})
      .then((permissionObj) => {
        permissions.audio = permissionObj.state;
      })
      .catch((error: any) => {
        console.log("Microphone permissions Error!", error);
      })
      .then(() => {
        navigator.permissions.query({name: 'camera'})
          .then((permissionObj) => {
            permissions.video = permissionObj.state;

            if (permissions.audio === 'denied' && permissions.video === 'denied') {
              this.AllDenied = true;
            }
            else if (permissions.audio === 'denied' && permissions.video === 'granted') {
              this.MicroDenied = true;
            }
          })
          .catch((error: any) => {
            console.log("Camera permissions Error!", error);
          })
      })
  }

  public muteOrUnmuteVideo() {
    const videoSrc = this.videoTag.nativeElement.srcObject;
    if (videoSrc.active) {
      this.offVideo();
    }
    else {
      this.onVideo();
    }
    this.videoIconName = this.videoIconName === 'videocam' ? 'videocam_off' : 'videocam';
  }

  public JoinToRoom() {
    if (this.DoorOpen) {
      this.DoorOpen = false;

      navigator.mediaDevices.enumerateDevices().then((dev: any) => {
        const InputDevice = dev.filter((device: any) => device.kind.includes('input'))
        console.log(InputDevice);
        this.MicroConnect = InputDevice.some((device: any) => device.kind === "audioinput");
        console.log(this.MicroConnect);
      }).then(() => {
        const userName = this.userName.nativeElement.value;
        const meetId = atob(this.meetId);

        if (!this.MicroConnect || this.AllDenied || this.MicroDenied) {
          this.userName.nativeElement.value = '';
          return;
        }
        else if (this.videoIconName === 'videocam_off') {
          mediaParams.video = false;
        }
        else {
          mediaParams.video = true;
        }

        if (meetId && !this.previousUrl) {
          console.log("Meeting ID", this.meetId);

          this.authService.init(CREDENTIALS, appConfig)
          this.callService.init();

          if (userName) {
            this.authService.auth(userName, this.JoinBtnClick).then((userId) => {
              const user: User = {id: userId, name: userName};

              this.callService.joinUser(meetId, userId, userName).then(() => {
              });

            })
          }
          else {
            this.userName.nativeElement.value = '';
            return;
          }

        }

        else {
          if (userName.trim()) {
            this.callService.init();

            this.authService.auth(userName, this.JoinBtnClick).then((userId) => {
              const user: User = {id: userId, name: userName};

              this.callService.createMeetingAndJoin(user).then((roomUrl: string) => {
                this.router.navigateByUrl("/join/" + roomUrl).then(() => {
                });
              })
            })
          }
          else {
            this.userName.nativeElement.value = '';
            return;
          }
        }
      })
    }
    else {
      this.userName.nativeElement.value = '';
      return;
    }
  }

  ngOnInit(): void {
    this.checkPermissions();
    this.onVideo();

    //Get previous url
    this.urlService.previousUrl$
      .subscribe((previousUrl: string) => {
        this.previousUrl = previousUrl
      });

    //Get meet id
    this.meetingId$.subscribe(event => event ? this.meetId = event : this.meetId = '');
  }

  ngOnDestroy() {
    if (this.videoIconName === 'videocam') {
      this.offVideo();
    }
  }

}
