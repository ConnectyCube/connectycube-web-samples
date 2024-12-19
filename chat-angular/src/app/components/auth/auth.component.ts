import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { appConfig, CREDENTIALS } from '../../services/config';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  private authAllowed: boolean = true;

  public authStatus: string = 'Log in';
  public authStatusText: string = 'Sign up';
  public invalid = false;

  public getErrors(value: string) {
    return this.authForm.get(value);
  }

  public authForm = this.fb.group({
    login: new UntypedFormControl(''),
    password: new UntypedFormControl(''),
  });

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: UntypedFormBuilder,
    public dialog: MatDialog
  ) {}

  private ModalOn(icon: string, message: string) {
    this.dialog.open(ModalComponent, {
      data: { icon: icon, message: message },
    });
  }

  public onSubmit() {
    if (!this.authAllowed) return;
    if (this.authForm.valid) {
      this.authAllowed = false;
      if (this.authStatus === 'Log in') {
        this.authService
          .login({
            login: this.authForm.value.login,
            password: this.authForm.value.password,
          })
          .then(() => {
            this.router.navigateByUrl('/chat');
          })
          .catch((error: any) => {
            this.invalid = true;
            this.authAllowed = true;
            console.log(error);
            localStorage.removeItem('token');
            localStorage.removeItem('login');
            this.ModalOn('error', JSON.stringify(error));
          });
      } else if (this.authStatus === 'Sign up') {
        this.authService
          .register(
            this.authForm.value.name,
            this.authForm.value.login,
            this.authForm.value.password
          )
          .then(() => {
            this.router.navigateByUrl('/chat');
          })
          .catch((error: any) => {
            this.invalid = true;
            this.authAllowed = true;
            console.error(error);
            localStorage.removeItem('token');
            localStorage.removeItem('login');
            this.ModalOn('error', JSON.stringify(error));
          });
      }
    } else {
      this.invalid = true;
    }
  }

  public toggleAuthStatus() {
    if (this.authStatus === 'Log in') {
      this.authForm = this.fb.group({
        name: new UntypedFormControl(''),
        login: new UntypedFormControl(''),
        password: new UntypedFormControl(''),
      });
      this.authStatus = 'Sign up';
      this.authStatusText = 'Sign in';
    } else {
      this.authForm = this.fb.group({
        login: new UntypedFormControl(''),
        password: new UntypedFormControl(''),
      });
      this.authStatus = 'Log in';
      this.authStatusText = 'Sign up';
    }
  }

  ngOnInit(): void {
    const appConfigToken = {
      ...appConfig,
      on: {
        sessionExpired: (handleResponse: any, retry: any) => {
          this.authService.cleanTokenAndNavigateToLoginScreen();
        },
      },
    };
    this.authService.init(CREDENTIALS, appConfigToken);
  }
}
