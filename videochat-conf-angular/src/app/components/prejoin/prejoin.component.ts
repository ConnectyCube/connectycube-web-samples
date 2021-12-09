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
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";
import {addAudioPermission, addVideoPermission} from "../../reducers/interface.actions";
import {ChatService} from "../../services/chat.service";
import {addMessages, setActiveDialogId, addMessage} from "../../reducers/dialog.actions";
import {Message} from "../../reducers/dialog.reducer";

@Component({
  selector: 'app-prejoin',
  templateUrl: './prejoin.component.html',
  styleUrls: ['./prejoin.component.scss']
})
export class PrejoinComponent implements OnInit, OnDestroy {

  private ourLocalStream: any;
  private audioPermission: string = '';
  private videoPermission: string = '';
  private isMicrophoneAvailable = false;
  private isCameraAvailable = false;
  private DoorOpen = true;
  private messageErrorDeniedAll = `You not allow permission to use your camera and microphone,
           please necessarily give permission for use your microphone,
           at worst we can not join you to meet room`;
  private messageErrorDeniedMicro = `You not allow permission microphone,
           please necessarily give permission for use your microphone,
           at worst we can not join you to meet room`;
  private messageErrorDevice = `Your camera or microphone not found,
           please connect one of this devices, at worst we can not join you to meet room`;
  private messageErrorDeviceMicro = `Your microphone not found,
           please connect one of this devices, at worst we can not join you to meet room`;

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
    private chatService: ChatService,
    private router: Router,
    private urlService: UrlService,
    private store$: Store<State>,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    public loader: LoadingService,
    public dialog: MatDialog,
  ) {
    this.matIconRegistry.addSvgIcon('videocam',
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets//icons/videocam_white_24dp.svg"));
    this.matIconRegistry.addSvgIcon('videocam_off',
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets//icons/videocam_off_white_24dp.svg"));
  }

  private checkPermissions() {
    return new Promise<void>((resolve, reject) => {
      if (navigator.mediaDevices !== undefined) {
        navigator.mediaDevices.getUserMedia({audio: true})
          .then(() => {
            this.audioPermission = "granted";
          })
          .catch(() => {
            this.audioPermission = "denied";
          })
        navigator.mediaDevices.getUserMedia({video: true})
          .then(() => {
            this.videoPermission = "granted";
            resolve();
          })
          .catch(() => {
            this.videoPermission = "denied";
            resolve();
          })
      }
      else {
        console.log("navigator undefined")
        reject();
      }
    })
  }

  private checkDeviceWidth() {
    if (window.innerWidth < 768) {
      this.videoTag.nativeElement.style.width = `${window.innerWidth * 0.8}px`;
    }
    else {
      this.videoTag.nativeElement.style.width = `${window.innerWidth * 0.5}px`;
    }
  }

  private checkMediaDevices() {
    return navigator.mediaDevices.enumerateDevices()
      .then((dev: any) => {
        console.log("Join Devices", dev);
        const InputDevice = dev.filter((device: any) => device.kind.includes('input'));
        console.log(InputDevice);
        this.isMicrophoneAvailable = InputDevice.some((device: any) => device.kind === "audioinput");
        this.isCameraAvailable = InputDevice.some((device: any) => device.kind === "videoinput");
        console.log("Micro", this.isMicrophoneAvailable);
        console.log("Camera", this.isCameraAvailable);
      })
  }

  private onVideo() {
    console.log("onVideo =>")
    this.loader.hide();
    this.loader.show();
    this.disableVideoBtn = true;

    navigator.mediaDevices.getUserMedia({video: true}).then((localStream) => {

      console.warn("Local Stream", localStream);

      this.callService.SetOurDeviceId(localStream.getVideoTracks()[0].getSettings().deviceId);

      console.log("SRC BEFORE", this.videoTag.nativeElement.srcObject);

      this.ourLocalStream = localStream;
      this.videoTag.nativeElement.srcObject = this.ourLocalStream;


      console.log("SRC AFTER", this.videoTag.nativeElement.srcObject);
    }).then(() => {
      this.loader.hide();
      this.disableVideoBtn = false;
    })
      .catch((error: any) => {
        console.log("onVideo Error!", error);
        if (error.message === 'Permission denied' ||
          error.message.includes("user denied permission") ||
          error.message.includes("The request is not allowed") ||
          error.message.includes("Invalid constraint")) {
          console.log("onVideo permission Denied =>")

          if (this.audioPermission === 'denied' && this.videoPermission === 'denied') {
            this.ModalOn('Camera and Microphone Denied', this.messageErrorDeniedAll);
          }
          else if (this.audioPermission === 'denied') {
            this.ModalOn('Microphone Denied', this.messageErrorDeniedMicro);
          }

        }
        else if (error.message === 'Requested device not found') {
          console.log("onVideo Requested device not found =>")
          this.ModalOn('Camera or Microphone Not Found', this.messageErrorDevice);
        }
        this.checkDeviceWidth();

        this.videoIconName = 'videocam_off';
        this.loader.hide();
      });
  }

  private offVideo() {
    console.warn(this.ourLocalStream.getVideoTracks())
    this.ourLocalStream.getVideoTracks().forEach((track: MediaStreamTrack) => track.stop());
  }

  private ModalOn(title: string, message: string) {
    this.dialog.open(DialogWarningComponent, {
      data: {title: title, message: message}
    });
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


      this.checkMediaDevices()
        .then(() => {
          const userName = this.userName.nativeElement.value;
          const meetId = atob(this.meetId);

          if (!this.isMicrophoneAvailable || this.audioPermission === 'denied') {
            if (!this.isMicrophoneAvailable) {
              this.ModalOn('Microphone Not Found', this.messageErrorDeviceMicro);
            }
            else if (this.audioPermission === 'denied' && this.videoPermission === 'denied') {
              this.ModalOn('Camera and Microphone Denied', this.messageErrorDeniedAll);
            }
            else if (this.audioPermission === 'denied') {
              this.ModalOn('Microphone Denied', this.messageErrorDeniedMicro);
            }
            this.userName.nativeElement.value = '';
            this.DoorOpen = true;
            return;
          }

          else if (this.videoIconName === 'videocam_off') {
            mediaParams.video = false;
          }
          else {
            mediaParams.video = true;
          }

          console.warn("PREV URL", this.previousUrl)
          if (meetId && !this.previousUrl) {
            console.log("=> Login and Join Room");
            console.log("Meeting ID", this.meetId);

            this.authService.init(CREDENTIALS, appConfig)
            this.callService.init();
            this.chatService.init();

            if (userName.trim()) {
              this.JoinBtnClick.emit()
              this.authService.auth(userName).then((userId: any) => {

                this.chatService.subscribeToDialog(meetId).then((dialog: any) => {
                  console.warn(dialog._id);
                  this.store$.dispatch(setActiveDialogId({dialogId: dialog._id}));
                  this.chatService.getDialogHistory(dialog._id).then((dialogMessages: Array<Message>) => {
                    console.warn(dialogMessages);
                    this.store$.dispatch(addMessages({dialogMessages}));
                  });
                })

                this.callService.joinUser(meetId, userId, userName).then((obj: any) => {
                  this.DoorOpen = true;
                }).catch((error: any) => {
                  alert("PreJoin JoinUser Error")
                  console.log("PreJoin JoinUser Error", error);
                });

              }).catch((error: any) => {
                alert("PreJoin Auth Error")
                console.log("PreJoin Auth Error", error);
              })
            }
            else {
              this.userName.nativeElement.value = '';
              this.DoorOpen = true;
              return;
            }

          }

          else {
            console.log("=> Create room and join");
            if (userName.trim()) {
              this.JoinBtnClick.emit();
              this.callService.init();
              this.chatService.init();

              this.authService.auth(userName).then((userId) => {
                const user = {id: userId, name: userName};

                this.callService.createMeetingAndJoin(user).then((roomUrl: string) => {
                  this.router.navigateByUrl("/join/" + roomUrl).then(() => {
                    this.DoorOpen = true;
                  });
                })
              })
            }
            else {
              this.userName.nativeElement.value = '';
              this.DoorOpen = true;
              return;
            }
          }
        })
        .catch((error: any) => {
          console.log("join error!", error);
          alert(error.message);
        })
    }
    else {
      this.userName.nativeElement.value = '';
      return;
    }
  }

  ngOnInit(): void {
    this.loader.show();
    //Get previous url
    this.urlService.previousUrl$
      .subscribe((previousUrl: string) => {
        this.previousUrl = previousUrl
      });

    //Get meet id
    this.meetingId$.subscribe(event => {
      if (event) {
        event !== 'prejoin' ? this.meetId = event : this.meetId = '';
      }
    });

    try {
      this.checkPermissions().then(() => {
        console.log("AUDIO", this.audioPermission)
        console.log("VIDEO", this.videoPermission)
        this.store$.dispatch(addVideoPermission({videoPermission: this.videoPermission === 'granted'}));
        this.store$.dispatch(addAudioPermission({audioPermission: this.audioPermission === 'granted'}));
        this.onVideo();
      });
    }
    catch {
      console.log("Can not check permissions");
    }
  }

  ngOnDestroy() {
    if (this.videoIconName === 'videocam') {
      this.offVideo();
    }
  }

}
