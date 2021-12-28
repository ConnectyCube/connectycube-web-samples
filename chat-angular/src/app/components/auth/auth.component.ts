import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {appConfig, CREDENTIALS} from "../../services/config";
import {Router} from "@angular/router";
import {MatDialog, MAT_DIALOG_DATA} from "@angular/material/dialog";
import {ModalComponent} from "../modal/modal.component";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  public authStatus: string = 'Log in';
  public authStatusText: string = 'Sign up';

  public getErrors(value: string) {
    return this.authForm.get(value);
  }

  public authForm = this.fb.group({
    login: new FormControl(''),
    password: new FormControl('')
  })

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    public dialog: MatDialog,
  ) {
  }

  private ModalOn(icon: string, message: string) {
    this.dialog.open(ModalComponent, {
      data: {icon: icon, message: message}
    });
  }

  public onSubmit() {
    if (this.authForm.valid) {
      console.log("VALID")
      if (this.authStatus === "Log in") {
        console.warn("[Login]", this.authForm.value);
        this.authService.login(this.authForm.value.login, this.authForm.value.password, true)
          .then(() => {
            this.router.navigateByUrl('/chat');
          })
          .catch((error: any) => {
            console.log(error);
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            this.ModalOn('error', JSON.stringify(error));
          });
      }
      else if (this.authStatus === "Sign up") {
        console.warn("[Sign up]", this.authForm.value);
        this.authService.auth(this.authForm.value.name, this.authForm.value.login, this.authForm.value.password)
          .then(() => {
            this.router.navigateByUrl('/chat');
          })
          .catch((error: any) => {
            console.log(error);
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            this.ModalOn('error', JSON.stringify(error));
          });
      }
    }
  }

  public toggleAuthStatus() {
    if (this.authStatus === 'Log in') {
      this.authForm = this.fb.group({
        name: new FormControl(''),
        login: new FormControl(''),
        password: new FormControl('')
      })
      this.authStatus = 'Sign up';
      this.authStatusText = 'Sign in';
    }
    else {
      this.authForm = this.fb.group({
        login: new FormControl(''),
        password: new FormControl('')
      })
      this.authStatus = 'Log in';
      this.authStatusText = 'Sign up';
    }
  }

  ngOnInit(): void {
    const appConfigToken = {
      ...appConfig, on: {
        sessionExpired: (handleResponse: any, retry: any) => {
          this.authService.logout();
        },
      }
    };
    this.authService.init(CREDENTIALS, appConfigToken)
  }

}
