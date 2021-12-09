import {AfterViewChecked, Component, OnInit, ViewChild} from '@angular/core';
import {State} from "../../reducers";
import {Store} from "@ngrx/store";
import {take} from "rxjs/operators";
import {addChatOpenStatus} from "../../reducers/interface.actions";
import {ChatService} from "../../services/chat.service";
import {dialogIdSelector, dialogMessagesSelector} from "../../reducers/dialog.selectors";
import {addMessage} from "../../reducers/dialog.actions";

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewChecked {

    @ViewChild('messageArea') messageArea: any;
    @ViewChild('messageContainer') messageContainer: any;
    public dialogMessages$ = this.store$.select(dialogMessagesSelector);

    constructor(
        private store$: Store<State>,
        private chatService: ChatService,
    ) {
    }

    private ScrollBottom() {
        this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
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

    ngAfterViewChecked() {
        this.ScrollBottom();
    }

}
