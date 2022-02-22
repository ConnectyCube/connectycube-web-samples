import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import {Store} from "@ngrx/store";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit, OnChanges {

  @Input() id: string;
  @Input() senderId: number;
  @Input() senderName: string;
  @Input() status: string;
  @Input() body: string;
  @Input() date_sent: number;
  @Input() photo: string | undefined;
  @Input() width: number;
  @Input() height: number;
  @Input() meId: number;
  @Input() isGroupChat: boolean;

  public avatar: string;

  constructor(
    private cdr: ChangeDetectorRef,
    private store$: Store
  ) {
  }

  public getDateMessage(date_sent: number): string {
    return new Date(date_sent * 1000).toLocaleString()
  }

  public getMessageStatus(status: string): string {
    switch (status) {
      case "pending":
        return "schedule"
      case "sent":
        return "done"
      case "read":
        return "done_all"
      default:
        return "error"
    }
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.senderId) {
      if (changes.senderId.currentValue !== changes.senderId.previousValue) {

      }
    }
  }

}
