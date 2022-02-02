import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {

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

  public h = 100;

  constructor(private cdr: ChangeDetectorRef) {
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

}
