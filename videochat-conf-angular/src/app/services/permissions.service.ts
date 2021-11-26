import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  constructor() {
  }

  public checkAudioPermission() {
    return navigator.permissions.query({name: 'microphone'})
      .then((permissionObj) => {
        console.log(permissionObj.state)
        return permissionObj.state;
      })
      .catch((error: any) => {
        console.log("Microphone permissions Error!", error);
        return navigator.mediaDevices.getUserMedia({audio: true, video: false})
          .then((stream) => {
            return "granted";
          })
          .catch((error: any) => {
            return 'denied';
          })
      })
  }

  public async checkVideoPermission() {
    return await navigator.permissions.query({name: 'camera'})
      .then((permissionObj) => {
        return permissionObj.state;
      })
      .catch((error: any) => {
        console.log("Camera permissions Error!", error);
        return navigator.mediaDevices.getUserMedia({audio: false, video: true})
          .then((stream) => {
            return "granted";
          })
          .catch((error: any) => {
            return 'denied';
          })
      })
  }
}
