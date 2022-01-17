import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {DeviceDetectorService} from "ngx-device-detector";
import {Dialog, ItemsHeight, Message} from "../../services/config";
import {CdkVirtualScrollViewport} from "@angular/cdk/scrolling";
import {Store} from "@ngrx/store";
import {selectDialogIdRouterParam} from "../../reducers/router.selector";
import {openDialog} from "../../reducers/dialog/dialog.actions";
import {
  dialogFindSelector,
  isActivatedConversationSelector,
  selectedConversationSelector
} from "../../reducers/dialog/dialog.selectors";
import {take} from "rxjs/operators";
import {ChatService} from "../../services/chat.service";
import {participant} from "../../reducers/participants/participants.reducer";
import {getMessagesSelector} from "../../reducers/messages/messages.selectors";
import {Observable} from "rxjs";

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

  public items: Array<number> = []
  public itemsTotalHeight = 0;
  public isScrollBarPressed = false;
  public selectedConversation$ = this.store$.select(selectedConversationSelector);
  public messages: Observable<Array<Message>> = this.store$.select(getMessagesSelector);
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
    pId: [],
    participants: new Map<string, participant>()
  };
  public subscribeDialogFind: any;
  public isMobile: boolean = this.deviceService.isMobile();
  public isTablet: boolean = this.deviceService.isTablet();
  public isGroupChat: boolean = false;

  constructor(
    private deviceService: DeviceDetectorService,
    private store$: Store,
    private chatService: ChatService
  ) {
    //Subscribe to change dialogId in URL
    this.store$.select(selectDialogIdRouterParam).subscribe(res => {
      if (res) {
        const dialogId = atob(<string>res);
        console.log(dialogId);
        if (this.subscribeDialogFind) {
          this.subscribeDialogFind.unsubscribe();
        }
        //Select data of selected dialog
        this.subscribeDialogFind = this.store$.select(dialogFindSelector, {id: dialogId})
          .subscribe((dialog: any) => {
            if (dialog !== undefined) {
              this.selectedDialog = dialog;
              this.isGroupChat = dialog.type === 2
              //Check has the chat been rendered?
              this.store$.select(isActivatedConversationSelector, {id: dialogId}).pipe(take(1))
                .subscribe(isActivated => {
                  if (isActivated !== undefined) {
                    this.store$.dispatch(openDialog({dialogId, isActivated}));
                    this.chatService.getChatHistory(this.selectedDialog, isActivated);
                  }
                })
            }
          })
      }
    })

    // Virtual Scroll
    this.messages.pipe(take(1)).subscribe(msgs => {
      if (msgs != undefined) {
        const itemsheight: ItemsHeight = this.measureMessages(msgs);
        console.warn(itemsheight);
        this.items = itemsheight.items;
        this.itemsTotalHeight = itemsheight.itemsTotalHeight;
      }
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

  private measureMessages(messages: Array<Message>): ItemsHeight {
    const PADDING_MES: number = 18;
    const MAX_INDEX: number = messages.length - 1;
    let heightSum: number = 0;
    let itemsArray: Array<number> = [];

    messages.forEach((msg: Message, index: number) => {
      let msgHeight: number = 0;

      let maxWidth = (this.messagesContainer.nativeElement.offsetWidth - 20) * 0.8;
      maxWidth = Math.round(maxWidth * 100) / 100;
      msgHeight = this.measureText(msg.body, maxWidth) + PADDING_MES;
      if (msg.senderName) {
        if (this.isGroupChat) {
          msgHeight += 19
        }
        if (index < MAX_INDEX) {
          // msgHeight += this.messages[index + 1].senderName ? 8 : 16;
        }
      }
      else {
        if (index < MAX_INDEX) {
          // msgHeight += this.messages[index + 1].senderName ? 16 : 8;
        }
      }

      itemsArray.push(msgHeight);
      heightSum += msgHeight;
    })

    return {items: itemsArray, itemsTotalHeight: heightSum};
  }

  messagesTrackBy(index:number,message:Message){
    return message.id;
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
      const message: Message = {
        id: "",
        senderName: "",
        body: text,
        date_sent: Math.floor(Date.now() / 1000)
      };

      if (trigger === 'area') {
        if (!this.isMobile && !this.isTablet) {
          this.chatService.sendMessage(this.selectedDialog, message)
            .then(() => {
              this.messages.pipe(take(1)).subscribe(msgs => {
                if (msgs !== undefined) {
                  const itemsheight: ItemsHeight = this.measureMessages(msgs);
                  console.warn(itemsheight);
                  this.items = itemsheight.items;
                  this.itemsTotalHeight = itemsheight.itemsTotalHeight;
                  this.scrollBarContent.nativeElement.style.height =
                    this.itemsTotalHeight + 'px';
                  this.virtualScroll.scrollToOffset(0);
                  this.scrollTrack();
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
          if (msgs !== undefined) {
            const itemsheight: ItemsHeight = this.measureMessages(msgs);
            console.warn(itemsheight);
            this.items = itemsheight.items;
            this.itemsTotalHeight = itemsheight.itemsTotalHeight;
            this.scrollBarContent.nativeElement.style.height =
              this.itemsTotalHeight + 'px';
            this.virtualScroll.scrollToOffset(0);
            this.scrollTrack();
          }
        })
      }
    }
    this.areaElement.nativeElement.value = '';
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.scrollBarContent.nativeElement.style.height =
      this.itemsTotalHeight + 'px';
    this.scrollBar.nativeElement.scrollTop = this.itemsTotalHeight - 1;

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
