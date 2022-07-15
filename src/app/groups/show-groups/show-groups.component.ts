import {Component, OnInit} from '@angular/core';
import {UserStoreService} from '@core/services/stores/user-store.service';
import {Subscription} from 'rxjs';
import {CreateNewGroupDialogComponent} from '@core/components/modals/create-new-group-dialog/create-new-group-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {ChatService} from '@core/services/chat.service';
import {SocketIoService} from '@core/services/socket-io.service';
import {Router} from '@angular/router';
import {GroupsStoreService} from '@core/services/stores/groups-store.service';
import {CurrentUserData} from '@core/interfaces';
import {UserInfoService} from '@core/services/user-info.service';

@Component({
    selector: 'app-show-groups',
    templateUrl: './show-groups.component.html',
    styleUrls: ['./show-groups.component.scss']
})
export class ShowGroupsComponent implements OnInit {
    authUser: CurrentUserData;
    groups = [];

    subscriptions: Subscription[] = [];

    constructor(
        public groupsStore: GroupsStoreService,
        private chatService: ChatService,
        private userStore: UserStoreService,
        private socketService: SocketIoService,
        public router: Router,
        private dialog: MatDialog,
        private _userInfoService: UserInfoService,
    ) {
        this._getAuthInfo();
    }

    ngOnInit(): void {
        // this.getAuthUser();
        this.trackGroups();
    }

    trackGroups() {
        this.subscriptions.push(this.groupsStore.groups$.subscribe(dt => {
            this.groups = dt;
        }));
    }

    private _getAuthInfo() {
        this._userInfoService._userInfo.subscribe((data) => {
            this.authUser = data;
            console.log(this.authUser, 'Show Group  AUTHUSER DATA');
        });
    }

    // getAuthUser() {
    //     this.userStore.authUser$.subscribe(user => {
    //         this.authUser = user;
    //     });
    // }

    filterGroups(type) {
        return this.groups.filter(g => {
            return type === 'managed' ?
                g.creator_id === this.authUser.id :
                g.creator_id !== this.authUser.id;
        });
    }

    openModal() {
        this.dialog.open(CreateNewGroupDialogComponent, {
            width: '500px',
            height: '450px',
            data: this.authUser
        }).afterClosed().subscribe(async (selectedGroup) => {
            if (selectedGroup) {
                await this.router.navigateByUrl('/groups/' + selectedGroup.custom_name + '/people');
            }
        });
    }

}
