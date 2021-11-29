import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UrlService {
  private previousUrl: BehaviorSubject<string> = new BehaviorSubject<any>(null);
  public previousUrl$: Observable<string> = this.previousUrl.asObservable();

  setPreviousUrl(previousUrl: any) {
    this.previousUrl.next(previousUrl);
  }

  constructor() {
  }
}
