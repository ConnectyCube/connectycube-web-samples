import {AfterViewChecked, AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {State} from "../../reducers";
import {Store} from "@ngrx/store";
import {take} from "rxjs/operators";
import {addChatOpenStatus} from "../../reducers/interface.actions";
import {ChatService} from "../../services/chat.service";
import {dialogIdSelector, dialogMessagesSelector} from "../../reducers/dialog.selectors";
import {addMessage} from "../../reducers/dialog.actions";
import {CdkVirtualScrollViewport} from "@angular/cdk/scrolling";
import {Message} from "../../reducers/dialog.reducer";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit, AfterViewChecked {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;
  @ViewChild('messageArea') messageArea: any;
  @ViewChild('messageContainer') messageContainer: any;

  @ViewChild('scrollBar') scrollBar: ElementRef;
  @ViewChild('scrollBarContent') scrollBarContent: ElementRef;

  public items: Array<number> = []
  public isScrollBarPressed = false;
  public dialogMessages$ = this.store$.select(dialogMessagesSelector);
  public itemsTotalHeight = 0;


  constructor(
    private store$: Store<State>,
    private chatService: ChatService,
  ) {
    this.store$.select(dialogMessagesSelector).pipe(take(1)).subscribe(res => {
      this.items = res.map((msg: Message) => {
        if (msg.senderName) {
          return 57;
        }
        return 38;
      })
      this.items.reduce((partial_sum, a) => partial_sum + a, 0);
    })
  }

  private alignScrollToBottom() {
    this.virtualScroll.scrollToOffset(0);
  }

  public closeChat() {
    this.store$.dispatch(addChatOpenStatus({chatOpenStatus: false}));
  }

  public sendMessage() {
    const msg = this.messageArea?.nativeElement.value.trim();
    if (msg) {
      console.log(msg);

      const message_text: string = msg;
      const message_time = new Date().toLocaleTimeString().slice(0, 5);

      this.store$.dispatch(addMessage({time: message_time, body: message_text}))

      this.alignScrollToBottom();

      this.messageArea.nativeElement.value = "";
      this.store$.select(dialogIdSelector).pipe(take(1)).subscribe(dialogId => {
        console.warn("dialogId", dialogId);
        if (dialogId) {
          this.chatService.sendMessage(msg, dialogId)
        }
        else {

        }
      })
    }
  }


  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.scrollBarContent.nativeElement.style.height =
      this.itemsTotalHeight + 'px';
    this.scrollBar.nativeElement.scrollTop = this.itemsTotalHeight - 1;

    this.virtualScroll.elementScrolled().subscribe((event) => {
      if (!this.isScrollBarPressed) {
        const vsScrolled = this.virtualScroll.measureScrollOffset('top');

        this.scrollBar.nativeElement.scrollTop =
          this.itemsTotalHeight -
          (vsScrolled + this.scrollBar.nativeElement.clientHeight);
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
    console.log('event.key', event.key);

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

  ngAfterViewChecked() {

  }

}
