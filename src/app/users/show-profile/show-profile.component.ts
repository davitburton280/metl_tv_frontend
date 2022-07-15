import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserStoreService} from '@core/services/stores/user-store.service';
import {Subscription} from 'rxjs';
import {UsersMessagesSubjectService} from '@core/services/stores/users-messages-subject.service';
import {PROFILE_PAGE_TABS} from '@core/constants/global';
import {ActivatedRoute, Router} from '@angular/router';
import {UsersService} from '@core/services/users.service';
import {SocketIoService} from '@core/services/socket-io.service';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';
import {StocksService} from '@core/services/stocks.service';
import {UserInfoService} from '@core/services/user-info.service';

@Component({
    selector: 'app-show-profile',
    templateUrl: './show-profile.component.html',
    styleUrls: ['./show-profile.component.scss']
})
export class ShowProfileComponent implements OnInit, OnDestroy {
    authUser;
    profileUser;
    profileTabs = PROFILE_PAGE_TABS;
    subscriptions: Subscription[] = [];

    connectionsCount = 0;
    connections = [];
    connectionRequests = [];
    passedUsername: string;

    ownProfile = false;


    usersConnection;
    usersConnectionStatus = 'idle';
    attemptedToConnect = false;
    isBlocked = false;

    profileUserStocks;

    constructor(
        private _userInfoService: UserInfoService,
        private userStore: UserStoreService,
        private usersConnectionsStore: UsersMessagesSubjectService,
        private groupsMessagesStore: GroupsMessagesSubjectService,
        private usersService: UsersService,
        private socketService: SocketIoService,
        private stocksService: StocksService,
        private route: ActivatedRoute,
        public router: Router
    ) {
    }

    ngOnInit(): void {
        this.passedUsername = this.route.snapshot.params.username;
        // this.trackAuthUserChanges();
        this._getAuthInfo();
        this.getUserInfo();
        if (this.ownProfile) {
            this.trackUserConnections();
        }
    }

    trackAuthUserChanges() {
        this.subscriptions.push(this.userStore.authUser$.subscribe(user => {
            this.authUser = user;
        }));
    }

    private _getAuthInfo() {
        // this._userInfoService._getCurrentUserInfo();
        this._userInfoService._userInfo.subscribe((data) => {
            this.authUser = data;
            console.log(this.authUser, 'dsadsadas');
        });
    }

    getUserInfo() {
        this.ownProfile = this.authUser.username === this.passedUsername;
        if (this.passedUsername) {
            this.subscriptions.push(this.usersService.getUserInfo({
                username: this.passedUsername,
                own_channel: this.ownProfile
            }).subscribe(dt => {
                if (dt) {
                    this.profileUser = dt;
                    this.checkIfUsersConnected();
                    this.getAcceptedDeclinedRequests();
                    this.getConnectWithUser();
                    this.getDisconnectUsers();
                    this.cancelledUsersConnecting();
                    this.getBlockUnblockUser();
                    this.getConnectionsChanges();

                    if (!this.ownProfile) {
                        this.getProfileUserStocks();
                        this.connectionsCount = this.profileUser.users_connections.filter(uc => uc.confirmed).length;
                        console.log(this.profileUser);
                    } else {
                        this.profileUserStocks = [];
                    }
                }
            }));
        }
    }

    trackUserConnections() {
        this.subscriptions.push(this.usersConnectionsStore.usersMessages$.subscribe(dt => {
            this.connectionsCount = dt.filter(d => d.users_connections[0].confirmed === 1).length;
            this.connections = dt.filter(d => d.users_connections[0].confirmed === 1);
            this.connectionRequests = dt.filter(d => d.users_connections[0].confirmed === 0);
        }));
    }

    getConnectionsChanges() {
        this.subscriptions.push(this.usersConnectionsStore.usersMessages$.subscribe((dt: any) => {
            // console.log('connection changed!!!', dt, this.profileUser.id);
            this.usersConnection = dt.find(d => d.id === this.profileUser.id)?.users_connections[0];
            // console.log(this.usersConnection);
            //
            //     if (dt.filter(d => d.id === this.channelUser.id)) {
            //         this.usersConnectionStatus = 'connected';
            //         this.isBlocked = false;
            //     }
        }));
    }

    getAcceptedDeclinedRequests() {
        this.subscriptions.push(this.socketService.acceptedConnection().subscribe((dt: any) => {
            const {notification, profile_user_contacts} = dt;
            if ((notification.to_user.id === this.authUser.id && notification.from_user.id === this.profileUser.id)
                || (notification.to_user.id === this.profileUser.id && notification.from_user.id === this.authUser.id)) {
                this.usersConnectionStatus = 'connected';
                this.isBlocked = false;
            }

            if (notification.from_user.id !== this.authUser.id) {
                this.connectionsCount = profile_user_contacts.length;
            }
        }));

        this.subscriptions.push(this.socketService.declinedConnection().subscribe(() => {
            console.log('declined');
            this.usersConnectionStatus = 'idle';
        }));
    }

    checkIfUsersConnected() {
        this.usersService.checkIfUsersConnected({
            user_id: this.authUser.id,
            channel_user_id: this.profileUser.id
        }).subscribe(dt => {
            this.usersConnection = dt;
            if (dt) {
                this.connections = dt.connection_users.filter(cu => cu.id !== this.authUser.id);
                this.usersConnectionStatus = dt.confirmed ? 'connected' : 'pending';
                // console.log(this.usersConnectionStatus)
                this.isBlocked = !!dt.is_blocked;
            }
        });
    }

    connectWithUser() {
        this.attemptedToConnect = true;
        this.usersConnectionStatus = 'pending';
        this.socketService.connectWithUser({
            from_user: this.authUser,
            to_user: this.profileUser,
            msg: `<strong>${this.authUser.first_name + ' ' + this.authUser.last_name}</strong>
                has sent a connection request to you`
        });
    }

    getConnectWithUser() {
        this.socketService.getConnectWithUser().subscribe((dt: any) => {
            this.usersConnection = dt.connection;
        });
    }

    cancelUsersConnecting(connection) {
        console.log(connection);
        this.socketService.cancelUsersConnecting({
            authUser: this.authUser,
            channelUser: this.profileUser,
            connection_id: connection.id
        });
    }

    cancelledUsersConnecting() {
        this.socketService.cancelledUsersConnecting().subscribe(dt => {
            console.log(dt, 'cancelled');
            this.usersConnectionStatus = 'idle';
        });
    }

    disconnectUser() {
        console.log(this.usersConnection);
        this.socketService.disconnectUsers({
            to_user: this.profileUser,
            from_user: this.authUser,
            connection_id: this.usersConnection.id,
            msg: `<strong>${this.authUser.first_name} ${this.authUser.last_name}</strong> has broken the connection between you two`,
        });
        this.usersConnectionStatus = 'idle';
    }

    getDisconnectUsers() {
        this.subscriptions.push(this.socketService.getDisconnectUsers().subscribe((dt: any) => {
            const {to_user, profile_user_contacts} = dt;
            console.log(to_user.users_connections);
            this.connectionsCount = profile_user_contacts.length;
            this.usersConnectionStatus = 'idle';
        }));
    }

    getBlockUnblockUser() {
        this.subscriptions.push(this.socketService.getBlockUnblockUser().subscribe((dt: any) => {
            console.log('get block/unblock', dt);
            this.isBlocked = true;
        }));
    }

    isMessageBtnShown() {
        return /connected|test/.test(this.usersConnectionStatus) && !this.isBlocked;
    }

    toggleBottomChatBox() {
        const foundUserMessages = this.usersConnectionsStore.usersMessages.find(um => um.id === this.profileUser.id);
        if (foundUserMessages) {
            this.usersConnectionsStore.showBottomChatBox = true;
            this.groupsMessagesStore.showBottomChatBox = false;
            this.usersConnectionsStore.changeUser(foundUserMessages);
        }
    }


    getProfileUserStocks() {
        this.stocksService.getUserStocks({user_id: this.profileUser.id}).subscribe(dt => {
            this.profileUserStocks = dt?.user_stocks;
        });
    }

    onOutletLoaded(component) {
        if (this.connections) {
            component.connections = this.connections;
            component.connectionRequests = this.connectionRequests;
            component.authUser = this.authUser;
            component.profileUser = this.profileUser;
            if (this.profileUserStocks) {
                component.profileUserStocks = this.profileUserStocks;
            }
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
