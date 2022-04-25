import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserStoreService} from '@core/services/stores/user-store.service';

@Component({
    selector: 'app-show-notifications',
    templateUrl: './show-notifications.component.html',
    styleUrls: ['./show-notifications.component.scss']
})
export class ShowNotificationsComponent implements OnInit {
    authUser;

    constructor(private userStore: UserStoreService) {
    }

    ngOnInit(): void {
        this.userStore.authUser$.subscribe(user => {
            this.authUser = user;
        });
    }

}
