import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import {VideoComponent} from '@app/users/openvidu-stuff/publisher-flow/video/video.component';

@Injectable({
  providedIn: 'root'
})
export class DoNotLeavePageGuard implements CanDeactivate<VideoComponent> {
  canDeactivate(
    component: VideoComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (component.recordingState === 'started') {
          component.alertOfLeaving();
          return false;
      }

      return true;
  }
}
