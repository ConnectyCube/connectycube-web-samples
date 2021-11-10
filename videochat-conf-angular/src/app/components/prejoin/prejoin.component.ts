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

@Component({
  selector: 'app-prejoin',
  templateUrl: './prejoin.component.html',
  styleUrls: ['./prejoin.component.scss']
})
export class PrejoinComponent implements OnInit, OnDestroy {

  private ourLocalStream: any;

  @Output() JoinBtnClick: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('videoElement') videoTag: any;
  @ViewChild('userName') userName: any;
  public videoIconName: string = 'videocam';
  public meetingId$ = this.store$.pipe(select(selectMeetingIdRouterParam));
  public meetId: string = '';
  public previousUrl: any;

  constructor(
    private authService: AuthService,
    private callService: CallService,
    private router: Router,
    private urlService: UrlService,
    private store$: Store<State>,
  ) {
  }

  private onVideo() {
    this.callService.getLocalUserVideo().then((localStream) => {
      this.videoTag.nativeElement.srcObject = localStream;
      this.ourLocalStream = localStream;
    });
  }
  private offVideo(){
    this.ourLocalStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
  }

  public muteOrUnmuteVideo() {
    const videoSrc = this.videoTag.nativeElement.srcObject;
    if (videoSrc.active) {
      videoSrc.getVideoTracks()[0].stop();
    }
    else {
      this.onVideo();
    }
    this.videoIconName = this.videoIconName === 'videocam' ? 'videocam_off' : 'videocam';
  }

  public JoinToRoom() {
    const userName = this.userName.nativeElement.value;
    const meetId = atob(this.meetId);

    if(this.videoIconName === 'videocam_off'){
      mediaParams.video = false;
    }
    else{
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


  }

  ngOnInit(): void {
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
    this.offVideo();
  }

}
