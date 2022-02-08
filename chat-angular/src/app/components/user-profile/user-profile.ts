import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Dialog} from "../../services/config";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.scss']
})
export class UserProfile implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { dialog: Dialog }) { }

  ngOnInit(): void {
  }

}
