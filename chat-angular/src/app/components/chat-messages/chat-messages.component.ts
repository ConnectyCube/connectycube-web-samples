import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {DeviceDetectorService} from "ngx-device-detector";
import {ItemsHeight, Message} from "../../services/config";
import {CdkVirtualScrollViewport} from "@angular/cdk/scrolling";

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

  public messages: Array<Message> = [];
  public isMobile: boolean = this.deviceService.isMobile();
  public isTablet: boolean = this.deviceService.isTablet();
  public isGroupChat: boolean = true;

  constructor(private deviceService: DeviceDetectorService) {
    const itemsheight: ItemsHeight = this.measureMessages(this.messages);
    console.warn(itemsheight);
    this.items = itemsheight.items;
    this.itemsTotalHeight = itemsheight.itemsTotalHeight;
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

  private measureMessages(messages: Array<Message>): ItemsHeight {
    const PADDING_MES: number = 18;
    const MAX_INDEX: number = messages.length - 1;
    let heightSum: number = 0;
    let itemsArray: Array<number> = [];

    this.messages.forEach((msg: Message, index: number) => {
      let msgHeight: number = 0;

      let maxWidth = (this.messagesContainer.nativeElement.offsetWidth - 20) * 0.8;
      maxWidth = Math.round(maxWidth * 100) / 100;
      msgHeight = this.measureText(msg.body, maxWidth) + PADDING_MES;
      if (msg.senderName) {
        if (index < MAX_INDEX) {
          msgHeight += this.messages[index + 1].senderName ? 16 : 8;
        }
      }
      else {
        if (index < MAX_INDEX) {
          msgHeight += this.messages[index + 1].senderName ? 8 : 16;
        }
      }

      if (this.isGroupChat && msg.senderName) {
        msgHeight += 19
      }

      itemsArray.push(msgHeight);
      heightSum += msgHeight;

    })

    return {items: itemsArray, itemsTotalHeight: heightSum};
  }

  public pageUpDown(e: any) {
    e.preventDefault();
  }

  public sendMessage(e: any, trigger: string) {
    const text: string = this.areaElement.nativeElement.value.trim();

    if (text) {
      const sname = text.includes('Cuuu') ? 'Yupi' : '';
      const message: Message = {
        senderName: sname,
        body: text,
        time: new Date().toLocaleTimeString().slice(0, 5)
      };

      if (trigger === 'area') {
        if (!this.isMobile && !this.isTablet) {
          this.messages = [...this.messages, message];

          const itemsheight: ItemsHeight = this.measureMessages(this.messages);
          console.warn(itemsheight);
          this.items = itemsheight.items;
          this.itemsTotalHeight = itemsheight.itemsTotalHeight;
          this.scrollBarContent.nativeElement.style.height =
            this.itemsTotalHeight + 'px';
        }
        else {
          return;
        }
      }
      else if (trigger === 'button') {
        this.messages = [...this.messages, message];

        const itemsheight: ItemsHeight = this.measureMessages(this.messages);
        console.warn(itemsheight);
        this.items = itemsheight.items;
        this.itemsTotalHeight = itemsheight.itemsTotalHeight;
        this.scrollBarContent.nativeElement.style.height =
          this.itemsTotalHeight + 'px';
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

}
