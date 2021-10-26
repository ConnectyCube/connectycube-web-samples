import { Component, OnInit } from '@angular/core';

declare let ConnectyCube:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private CREDENTIALS = {
    appId: 5574,
    authKey: "TZU3fqTqdJPzhDB",
    authSecret: "hacNUHLEbOtXHYJ",
  };

  private userAuthorization(userName:string){

    const userProfile = {
      login: "TempUser",
      password: "TempUserPassword",
      full_name: userName,
    };

    ConnectyCube.users.signup(userProfile)
      .then((user:any)=>{

        ConnectyCube.login({login:userProfile.login,password:userProfile.password})
          .then((user:any)=>{console.log("logging user",user)})
          .catch((error:any)=>{console.log('LoginError!',error)})

      })
      .catch((error:any)=>{

        const IsRegisteredUser: boolean = error.info.errors.base.includes("login must be unique");

        if(IsRegisteredUser){
          ConnectyCube.login({login:userProfile.login,password:userProfile.password})
            .then((user:any)=>{console.log("logging user",user)})
            .catch((error:any)=>{console.log('LoginError!',error)})
        }
        else{
          console.log("signUpError",error)
        }

      })

  }


  ngOnInit(): void {

    ConnectyCube.init(this.CREDENTIALS);

    ConnectyCube.createSession();

  }

  public joinToGuestRoom(){

    const userName = prompt("Input user name","User");

    if(userName){

      this.userAuthorization(userName);

    }

  }

}
