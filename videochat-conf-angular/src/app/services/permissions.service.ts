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
        return permissionObj.state;
      })
      .catch((error: any) => {
        console.log("Microphone permissions Error!", error);
      })
  }

  public checkVideoPermission() {
    return navigator.permissions.query({name: 'camera'})
      .then((permissionObj) => {
        return permissionObj.state;
      })
      .catch((error: any) => {
        console.log("Camera permissions Error!", error);
      })
  }
}
