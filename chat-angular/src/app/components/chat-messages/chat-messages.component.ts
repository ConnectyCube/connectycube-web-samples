import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {DeviceDetectorService} from "ngx-device-detector";
import {Dialog, imageMIMETypes, ItemsHeight, Message} from "../../services/config";
import {CdkVirtualScrollViewport} from "@angular/cdk/scrolling";
import {Store} from "@ngrx/store";
import {selectDialogIdRouterParam} from "../../reducers/router.selector";
import {openDialog, setNullConverastion,} from "../../reducers/dialog/dialog.actions";
import {
  dialogFindSelector,
  getDialogsTypingParticipant,
  isActivatedConversationSelector,
  selectedConversationSelector
} from "../../reducers/dialog/dialog.selectors";
import {filter, take} from "rxjs/operators";
import {ChatService} from "../../services/chat.service";
import {getMessagesSelector} from "../../reducers/messages/messages.selectors";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {getParticipantActivity, meSelector} from "../../reducers/participants/participants.selectors";
import {isToday} from "../../services/utilities";
import {updateParticipantLastActivity} from "../../reducers/participants/participants.actions";
import {chatConnectedSelector} from "../../reducers/interface/interface.selectors";
import {MeasureService} from "../../services/measure.service";
import {throttle} from "throttle-typescript";
import {MatLegacyDialog as MatDialog} from "@angular/material/legacy-dialog";
import {GroupChatDetails} from "../group-chat-details/group-chat-details";
import {UserProfile} from "../user-profile/user-profile";

@Component({
  selector: 'app-chat-messages',
  templateUrl: './chat-messages.component.html',
  styleUrls: ['./chat-messages.component.scss'],
})
export class ChatMessagesComponent implements OnInit {

  @ViewChild('areaElement') areaElement: ElementRef;
  @ViewChild('messagesContainer') messagesContainer: ElementRef;
  @ViewChild('inputFile') inputFile: ElementRef;

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;
  @ViewChild('scrollBar') scrollBar: ElementRef;
  @ViewChild('scrollBarContent') scrollBarContent: ElementRef;

  private timerId: number | undefined;

  public lastActivity: number | undefined;
  public lastActivityStatus: string = "";
  public items: Array<number> = []
  public itemsTotalHeight = 0;
  public isScrollBarPressed = false;
  public selectedConversation$ = this.store$.select(selectedConversationSelector);
  public messages: Observable<Array<Message>> = this.store$.select(getMessagesSelector);
  public meId: any;
  public selectedDialog: Dialog = {
    id: "",
    type: 0,
    name: "",
    photo: null,
    creatorId: 0,
    lastMessage: null,
    lastMessageDate: null,
    lastMessageUserId: null,
    unreadMessage: 0,
    createAt: "",
    msgIds: [],
    participantIds: [],
    typingParticipants: []
  };
  public subscribeDialogFind: any;
  public subscribeVirtualScrollCalc: any;
  public isMobile: boolean = this.deviceService.isMobile();
  public isTablet: boolean = this.deviceService.isTablet();
  public isGroupChat: boolean = false;
  public typingParticipants$: any;
  public typingParticipants: string = "";
  public lastActivity$: Observable<number>;
  public lastActiveUserId: number | undefined;

  constructor(
    private deviceService: DeviceDetectorService,
    private store$: Store,
    private chatService: ChatService,
    private router: Router,
    private measureService: MeasureService,
    private dialog: MatDialog,
  ) {
    //resize event for realculation virtual scroll height
    window.addEventListener('resize', throttle(this.windowResize.bind(this), 500));
    //select meId from store
    this.store$.select(meSelector).pipe(filter(v => !!v), take(1)).subscribe(userMe => {
      this.meId = userMe!.id;
    })
    //subscribe for chat connected
    this.store$.select(chatConnectedSelector).subscribe(chatConnected => {
      if (chatConnected) {
        //Subscribe to change dialogId in URL
        this.store$.select(selectDialogIdRouterParam).subscribe(res => {
          if (res !== undefined) {
            if (this.timerId) {
              clearTimeout(this.timerId);
              this.sendIsStopTypingStatus();
            }
            const dialogId = atob(<string>res);
            console.log(dialogId);
            if (this.subscribeDialogFind) {
              this.subscribeDialogFind.unsubscribe();
            }
            if (this.areaElement) {
              this.areaElement.nativeElement.value = "";
            }
            //Select data of selected dialog
            this.subscribeDialogFind = this.store$.select(dialogFindSelector, {id: dialogId})
              .pipe(filter(v => !!v), take(1)).subscribe((dialog: any) => {
                if (dialog !== undefined) {
                  //Typing participants
                  this.typingParticipants$ = this.store$.select(getDialogsTypingParticipant, {dialogId: dialog.id})
                    .subscribe(typParticipants => {
                      if (typParticipants !== undefined) {
                        this.typingParticipants = typParticipants.join(",");
                      }
                    });

                  this.selectedDialog = dialog;
                  this.isGroupChat = dialog.type === 2
                  //Check has the chat been rendered?
                  this.store$.select(isActivatedConversationSelector, {id: dialogId}).pipe(take(1))
                    .subscribe(isActivated => {
                      this.virtualScroll.scrollToOffset(0);
                      if (isActivated !== undefined) {
                        this.store$.dispatch(openDialog({dialogId, isActivated}));
                        this.chatService.getChatHistory(this.selectedDialog, isActivated).then(() => {
                          //last activity
                          this.getUserLastActivity(dialog);
                        })
                      }
                    })
                }
              })
          }
        })
      }
    })
  }

  private windowResize() {
    this.measureService.resetAllHeightCalculation();
    this.messages.pipe(take(1)).pipe(take(1)).subscribe(msgs => {
      console.log("RESIZE");
      this.calculateVirtualScrollHeight(msgs);
    })
  }

  private calculateVirtualScrollHeight(msgs: Array<Message>) {
    if (msgs.length !== 0 && !msgs.some(item => item === undefined)) {
      const msgContainerWidth = this.messagesContainer.nativeElement.offsetWidth;
      const isGroupChat = this.isGroupChat;
      this.measureService.measureMessages(msgs, msgContainerWidth, isGroupChat, this.selectedDialog.id).then((res: any) => {
        if (res) {
          const itemsheight: ItemsHeight = res;
          console.log(itemsheight);
          this.items = itemsheight.items;
          this.itemsTotalHeight = itemsheight.itemsTotalHeight;
          this.scrollBarContent.nativeElement.style.height =
            this.itemsTotalHeight + 'px';
          this.scrollBar.nativeElement.scrollTop = this.itemsTotalHeight - 1;
        }
      });

      this.virtualScroll.elementScrolled().subscribe((event) => {
        if (!this.isScrollBarPressed) {
          this.scrollTrack();
        }
      });

      this.scrollBar.nativeElement.addEventListener(
        'mousedown',
        () => {
          console.log('mousedown');
          this.isScrollBarPressed = true;
        },
        false
      );
      this.scrollBar.nativeElement.addEventListener(
        'mouseup',
        () => {
          console.log('mouseup');
          this.isScrollBarPressed = false;
        },
        false
      );

      this.scrollBar.nativeElement.onscroll = () => {
        const newScrollOffset =
          this.itemsTotalHeight -
          this.scrollBar.nativeElement.scrollTop -
          this.scrollBar.nativeElement.clientHeight;

        if (this.isScrollBarPressed) {
          this.virtualScroll.scrollToOffset(newScrollOffset);
        }
      };
    }
  }

  private getUserLastActivity(dialog: Dialog) {
    //unsubscribe from last user activity
    if (this.lastActiveUserId) {
      this.chatService.unsubscribeFromUserLastActivity(this.lastActiveUserId);
    }
    if (dialog.type === 3) {
      this.lastActiveUserId = dialog.participantIds.find((id: number) => id !== this.meId);
      if (this.lastActiveUserId) {
        this.chatService.subscribeToUserLastActivity(this.lastActiveUserId);
        this.getUserStatus(this.lastActiveUserId).then(() => {
          this.lastActivity$ = this.store$.select(getParticipantActivity, {
            pId: this.lastActiveUserId
          });
        });
      }
    }
  }

  private getUserStatus(userId: number) {
    return new Promise<void>((resolve, reject) => {
      this.chatService.getLastActivity(userId)?.then((result: any) => {
        const seconds = result.seconds;
        this.store$.dispatch(updateParticipantLastActivity({participantId: userId, lastActivity: seconds}));
        resolve()
      })
        .catch((error: any) => {
          console.error(error);
        });
      resolve();
    })
  }

  private sendIsStopTypingStatus() {
    this.chatService.sendStopTypingStatus(this.selectedDialog);
    this.timerId = undefined;
  }

  private scrollTrack() {
    const vsScrolled = this.virtualScroll.measureScrollOffset('top');

    this.scrollBar.nativeElement.scrollTop =
      this.itemsTotalHeight -
      (vsScrolled + this.scrollBar.nativeElement.clientHeight);
  }

  private setItemsHeight(res: any) {
    const itemsheight: ItemsHeight = res;
    this.items = itemsheight.items;
    this.itemsTotalHeight = itemsheight.itemsTotalHeight;
    this.scrollBarContent.nativeElement.style.height =
      this.itemsTotalHeight + 'px';
    this.virtualScroll.scrollToOffset(0);
    this.scrollTrack();
  }

  messagesTrackBy(index: number, message: Message) {
    return message.id;
  }

  public dialogDetailsHandler(isGroupChat: boolean, dialogId: string) {
    this.store$.select(dialogFindSelector, {id: dialogId}).pipe(take(1)).subscribe(dialog => {
      if (dialog) {
        if (isGroupChat) {
          this.dialog.open(GroupChatDetails, {panelClass: 'dialog-details', disableClose: true, data: {dialog}});
        }
        else {
          this.dialog.open(UserProfile, {
            panelClass: 'user-profile',
            disableClose: true,
            data: {dialog, meId: this.meId}
          });
        }
      }
    })
  }

  public onFileSelected(e: any) {
    const file: any = e.target.files[0];
    console.log(file);
    const isValidFile: boolean = !!file && imageMIMETypes.includes(file.type);
    console.log("[isValidFile]", isValidFile);
    if (isValidFile) {
      this.chatService.sendMsgWithPhoto(file, this.selectedDialog, this.meId);
      this.inputFile.nativeElement.value = '';
    }
    else {
      alert("Can not send this file type");
    }
  }

  public getLastSeen(lastActivity: number | null) {
    if (lastActivity === -1 || lastActivity === null) {
      this.lastActivityStatus = "";
    }
    else {
      this.lastActivity = lastActivity;
      if (lastActivity < 60) {
        this.lastActivityStatus = "Online";
      }
      else {
        const date = new Date(new Date().getTime() - lastActivity * 1000);
        const activity = isToday(date) ? date.toLocaleTimeString() : date.toLocaleString();
        this.lastActivityStatus = "Last seen: " + activity;
      }
    }
    return this.lastActivityStatus;
  }

  public setNullConversation() {
    this.router.navigateByUrl("/chat/");
    this.store$.dispatch(setNullConverastion());
  }

  public typing(e: any) {
    if (e.target.value.trim()) {
      if (this.timerId === undefined) {
        this.chatService.sendStartTypingStatus(this.selectedDialog);
      }
      window.clearTimeout(this.timerId);
      this.timerId = window.setTimeout(() => {
        this.sendIsStopTypingStatus();
      }, 3000);
    }
  }

  public pageUpDown(e: any) {
    e.preventDefault();
  }

  public sendMessage(e: any, trigger: string) {
    const text: string = this.areaElement.nativeElement.value.trim();

    if (text) {
      this.areaElement.nativeElement.value = "";
      clearTimeout(this.timerId);
      this.sendIsStopTypingStatus();
      const message: Message = {
        id: "",
        senderId: this.meId,
        status: "pending",
        senderName: "",
        body: text,
        date_sent: Math.floor(Date.now() / 1000)
      };

      if (trigger === 'area') {
        if (e.preventDefault) e.preventDefault();
        if (!this.isMobile && !this.isTablet) {
          this.chatService.sendMessage(this.selectedDialog, message)
            .then(() => {
              this.messages.pipe(take(1)).subscribe(msgs => {
                if (msgs.length !== 0) {
                  const msgContainerWidth = this.messagesContainer.nativeElement.offsetWidth;
                  const isGroupChat = this.isGroupChat;
                  this.measureService.measureMessages(msgs, msgContainerWidth, isGroupChat, this.selectedDialog.id).then((res: any) => {
                    if (res) {
                      this.setItemsHeight(res);
                    }
                  });
                }
              })
            });
        }
        else {
          return;
        }
      }
      else if (trigger === 'button') {
        this.chatService.sendMessage(this.selectedDialog, message);
        this.messages.pipe(take(1)).subscribe(msgs => {
          if (msgs.length !== 0) {
            const msgContainerWidth = this.messagesContainer.nativeElement.offsetWidth;
            const isGroupChat = this.isGroupChat;
            this.measureService.measureMessages(msgs, msgContainerWidth, isGroupChat, this.selectedDialog.id).then((res: any) => {
              if (res) {
                this.setItemsHeight(res);
              }
            });
          }
        })
      }
    }
    this.areaElement.nativeElement.value = '';
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    // Virtual Scroll
    this.subscribeVirtualScrollCalc = this.messages.subscribe(msgs => {
      if (msgs.length === 0) {
        this.items = [];
        this.itemsTotalHeight = 0;
        this.scrollBarContent.nativeElement.style.height =
          this.itemsTotalHeight + 'px';
      }
      else {
        this.calculateVirtualScrollHeight(msgs);
      }
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if ($event) {
      this.sendIsStopTypingStatus();
    }
  }

  @HostListener('wheel', ['$event'])
  public onScroll(event: WheelEvent) {
    this.virtualScroll.scrollToOffset(
      this.virtualScroll.elementRef.nativeElement.scrollTop - event.deltaY
    );
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    // console.log('event.key', event.key);

    let offsetDelta;

    if (event.key === 'ArrowDown') {
      offsetDelta = 10;
    }
    else if (event.key === 'ArrowUp') {
      offsetDelta = -10;
    }

    if (offsetDelta) {
      this.virtualScroll.scrollToOffset(
        this.virtualScroll.elementRef.nativeElement.scrollTop + offsetDelta
      );
    }
  }

}
