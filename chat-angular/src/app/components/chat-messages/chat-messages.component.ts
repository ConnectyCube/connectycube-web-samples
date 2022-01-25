import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {DeviceDetectorService} from "ngx-device-detector";
import {Dialog, ItemsHeight, Message} from "../../services/config";
import {CdkVirtualScrollViewport} from "@angular/cdk/scrolling";
import {Store} from "@ngrx/store";
import {selectDialogIdRouterParam} from "../../reducers/router.selector";
import {
  openDialog,
  readDialogAllMessages,
  setNullConverastion,
  updateParticipantLastActivity
} from "../../reducers/dialog/dialog.actions";
import {
  dialogFindSelector, getDialogParticipant, getDialogsParticipants, getDialogsTypingParticipant,
  isActivatedConversationSelector,
  selectedConversationSelector
} from "../../reducers/dialog/dialog.selectors";
import {filter, take} from "rxjs/operators";
import {ChatService} from "../../services/chat.service";
import {participant} from "../../reducers/participants/participants.reducer";
import {getMessagesSelector} from "../../reducers/messages/messages.selectors";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {meSelector} from "../../reducers/participants/participants.selectors";

@Component({
  selector: 'app-chat-messages',
  templateUrl: './chat-messages.component.html',
  styleUrls: ['./chat-messages.component.scss']
})
export class ChatMessagesComponent implements OnInit {

  @ViewChild('areaElement') areaElement: ElementRef;
  @ViewChild('messagesContainer') messagesContainer: ElementRef;

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;
  @ViewChild('scrollBar') scrollBar: ElementRef;
  @ViewChild('scrollBarContent') scrollBarContent: ElementRef;

  private timerId: number | undefined;

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
    lastMessage: null,
    lastMessageDate: null,
    unreadMessage: 0,
    createAt: "",
    msgIds: [],
    participantIds: [],
    participants: new Map<string, participant>(),
    typingParticipants: []
  };
  public subscribeDialogFind: any;
  public subscribeVirtualScrollCalc: any;
  public isMobile: boolean = this.deviceService.isMobile();
  public isTablet: boolean = this.deviceService.isTablet();
  public isGroupChat: boolean = false;
  public typingParticipants$: any;
  public typingParticipants: string = "";
  public lastActivity: number = -1;
  public lastActiveUserId: number;

  constructor(
    private deviceService: DeviceDetectorService,
    private store$: Store,
    private chatService: ChatService,
    private router: Router,
  ) {
    this.store$.select(meSelector).pipe(filter(v => !!v), take(1)).subscribe(userMe => {
      this.meId = userMe!.id;
    })

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
              //last activity
              this.chatService.unsubscribeFromUserLastActivity(this.lastActiveUserId);
              if (dialog.type === 3) {
                this.lastActiveUserId = dialog.participantIds.find((id: number) => id !== this.meId);
                this.chatService.subscribeToUserLastActivity(this.lastActiveUserId);
                this.getUserStatus(this.lastActiveUserId).then(() => {
                  this.store$.select(getDialogParticipant, {
                    dialogId,
                    pId: this.lastActiveUserId
                  }).pipe(filter(v => !!v && v.lastActivity), take(1)).subscribe(participant => {
                    console.warn(participant)
                    this.lastActivity = participant.lastActivity;
                  })
                });
              }
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
                    this.chatService.getChatHistory(this.selectedDialog, isActivated)
                  }
                })
              this.store$.select(getDialogsParticipants, {dialogId})
                .pipe(filter(v => v.size !== 0), take(1)).subscribe(participants => {
                if (participants !== undefined) {
                  this.selectedDialog = {...this.selectedDialog, participants};
                }
              })
            }
          })
      }
    })
  }

  private getUserStatus(userId: number) {
    return new Promise<void>((resolve, reject) => {
      console.warn(userId)
      this.chatService.getLastActivity(userId)?.then((result: any) => {
        const seconds = result.seconds;
        this.store$.dispatch(updateParticipantLastActivity({participantId: userId, lastActivity: seconds}));
        console.warn(result);
        resolve()
      })
        .catch((error: any) => {
          console.error(error);
        });
    })
  }

  private sendIsStopTypingStatus() {
    // console.trace("[STOP] 1111111111111")
    this.chatService.sendStopTypingStatus(this.selectedDialog);
    console.warn(1111)
    this.timerId = undefined;
  }

  private measureImage(src: string) {
    return new Promise<number>((resolve, reject) => {
      const img = new Image();
      img.addEventListener('load', () => resolve(img.naturalHeight > 200 ? 200 : img.naturalHeight));
      img.src = src;
    })
  }

  private measureText(text: string, maxWidth: number) {
    const mainStyle = `width:${maxWidth}px; word-wrap: break-word; white-space: pre-line;
     font-size: 16px; font-family: "Source Sans Pro"; line-height: 1.25`;
    const div = document.createElement('div');
    div.innerHTML = text;
    div.style.cssText = mainStyle;
    document.body.appendChild(div);
    const testHeight = div.offsetHeight;
    div.remove();

    return testHeight;
  }

  private scrollTrack() {
    const vsScrolled = this.virtualScroll.measureScrollOffset('top');

    this.scrollBar.nativeElement.scrollTop =
      this.itemsTotalHeight -
      (vsScrolled + this.scrollBar.nativeElement.clientHeight);
  }

  private async measureMessages(messages: Array<Message>) {
    const PADDING_MES: number = 22;
    const MAX_INDEX: number = messages.length - 1;
    let heightSum: number = 0;
    let itemsArray: Array<number> = [];
    let index = 0;

    for (const msg of messages) {
      //first element + container padding
      let msgHeight: number = index === 0 ? 14 : 0;
      let maxWidth = (this.messagesContainer.nativeElement.offsetWidth - 20) * 0.8;
      maxWidth = Math.round(maxWidth * 100) / 100;
      msgHeight += PADDING_MES;
      if (msg.senderName) {
        if (this.isGroupChat) {
          msgHeight += 19
        }
        if (index < MAX_INDEX) {
          msgHeight += messages[index + 1].senderName ? 8 : 16;
        }
      }
      else {
        if (index < MAX_INDEX) {
          msgHeight += messages[index + 1].senderName ? 16 : 8;
        }
      }

      if (msg.photo) {
        await this.measureImage(msg.photo).then((imgHeight: number) => {
          msgHeight += imgHeight;
        })
        msgHeight += 5;
      }
      else {
        msgHeight += this.measureText(msg.body, maxWidth);
      }

      itemsArray.push(msgHeight);
      heightSum += msgHeight;

      index++;
    }

    return {items: itemsArray, itemsTotalHeight: heightSum};
  }

  messagesTrackBy(index: number, message: Message) {
    return message.id;
  }

  public onFileSelected(e: any) {
    const file: any = e.target.files[0];
    console.warn(file);
    if (file) {
      this.chatService.sendMsgWithPhoto(file, this.selectedDialog, this.meId);
    }
  }

  public getLastSeen(lastActivity: number) {
    if(lastActivity === - 1){
      return "Unknown last activity";
    }
    if(lastActivity < 30){
      return "Online";
    }
    const date = new Date().getTime() - lastActivity * 1000;
    const activity = lastActivity > 86400 ? new Date(date).toLocaleString() : new Date(date).toLocaleTimeString();
    return "Last seen: " + activity;
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
      clearTimeout(this.timerId);
      this.timerId = setTimeout(() => {
        this.sendIsStopTypingStatus();
      }, 3000);
    }
  }

  public pageUpDown(e: any) {
    e.preventDefault();
  }

  public getDateMessage(date_sent: number): string {
    return new Date(date_sent * 1000).toLocaleString()
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
        if (!this.isMobile && !this.isTablet) {
          console.warn(this.selectedDialog)
          this.chatService.sendMessage(this.selectedDialog, message)
            .then(() => {
              this.messages.pipe(take(1)).subscribe(msgs => {
                if (msgs.length !== 0) {
                  this.measureMessages(msgs).then((res: any) => {
                    const itemsheight: ItemsHeight = res;
                    console.warn(itemsheight);
                    this.items = itemsheight.items;
                    this.itemsTotalHeight = itemsheight.itemsTotalHeight;
                    this.scrollBarContent.nativeElement.style.height =
                      this.itemsTotalHeight + 'px';
                    this.virtualScroll.scrollToOffset(0);
                    this.scrollTrack();
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
            this.measureMessages(msgs).then((res: any) => {
              const itemsheight: ItemsHeight = res;
              console.warn(itemsheight);
              this.items = itemsheight.items;
              this.itemsTotalHeight = itemsheight.itemsTotalHeight;
              this.scrollBarContent.nativeElement.style.height =
                this.itemsTotalHeight + 'px';
              this.virtualScroll.scrollToOffset(0);
              this.scrollTrack();
            });
          }
        })
      }
    }
    this.areaElement.nativeElement.value = '';
  }

  public getMessageStatus(status: string): string {
    switch (status) {
      case "pending":
        return "schedule"
        break;
      case "sent":
        return "done"
        break;
      case "read":
        return "done_all"
        break;
      default:
        return "error"
    }
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    // Virtual Scroll
    this.subscribeVirtualScrollCalc = this.messages.subscribe(msgs => {
      if (msgs.length !== 0 && !msgs.some(item => item === undefined)) {
        this.measureMessages(msgs).then((res: any) => {
          const itemsheight: ItemsHeight = res;
          console.warn(itemsheight);
          this.items = itemsheight.items;
          this.itemsTotalHeight = itemsheight.itemsTotalHeight;
          this.scrollBarContent.nativeElement.style.height =
            this.itemsTotalHeight + 'px';
          this.scrollBar.nativeElement.scrollTop = this.itemsTotalHeight - 1;
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
    })
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
