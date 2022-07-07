import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output, TemplateRef} from '@angular/core';
import {ActivatedRoute, ActivationEnd, NavigationEnd, Router} from '@angular/router';
import {AuthService} from '@core/services/auth.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {SubjectService} from '@core/services/subject.service';
import {NAVBAR_ADDITIONAL_LINKS} from '@core/constants/global';
import {environment} from '@env';
import {StocksService} from '@core/services/stocks.service';
import {MatDialog} from '@angular/material/dialog';
import IsResponsive from '@core/helpers/is-responsive';
import trackByElement from '@core/helpers/track-by-element';
import {from, Subscription, zip} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {Card} from '@shared/models/card';
import {CardsService} from '@core/services/cards.service';
import {CustomersService} from '@core/services/wallet/customers.service';
import {PaymentsService} from '@core/services/wallet/payments.service';
import {CountPurchasedTransferredTotalsPipe} from '@shared/pipes/count-purchased-transfered-totals.pipe';
import {SocketIoService} from '@core/services/socket-io.service';
import {NotificationsService} from '@core/services/notifications.service';
import {UsersMessagesSubjectService} from '@core/services/stores/users-messages-subject.service';
import {NotificationsSubjectStoreService} from '@core/services/stores/notifications-subject-store.service';
import {ChatService} from '@core/services/chat.service';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';
import {UnreadMessagesCounter} from '@core/helpers/get-unread-messages-count';
import {UserStoreService} from '@core/services/stores/user-store.service';
import {CheckForEmptyObjectPipe} from '@shared/pipes/check-for-empty-object.pipe';
import {GroupsStoreService} from '@core/services/stores/groups-store.service';
import {GroupsService} from '@core/services/groups.service';

import {Observable, forkJoin} from 'rxjs';
import {combineLatest} from 'rxjs/operators';
import {PostsService} from '@core/services/posts.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, AfterViewInit, OnDestroy {
    authUser;
    routerUrl;
    isSmallScreen = IsResponsive.isSmallScreen();
    trackByElement = trackByElement;

    envName = environment.envName;

    @Output() search = new EventEmitter();
    @Output() closeLeftSidenav = new EventEmitter();
    @Output() closeRightSidenav = new EventEmitter();
    additionalLinks = NAVBAR_ADDITIONAL_LINKS;
    notifications = [];

    passedUsername;

    stocks;
    subscriptions: Subscription[] = [];

    showPurchaseBits = false;
    showNavbarResponsiveRow = true;

    userCards = [];
    totals;

    chatGroups = [];
    pageGroups = [];

    constructor(
        private userStore: UserStoreService,
        public router: Router,
        public auth: AuthService,
        private getAuthUser: GetAuthUserPipe,
        private subject: SubjectService,
        private stocksService: StocksService,
        private paymentsService: PaymentsService,
        private socketService: SocketIoService,
        private route: ActivatedRoute,
        private dialog: MatDialog,
        private toastr: ToastrService,
        private cardsService: CardsService,
        private stripeCustomersService: CustomersService,
        private countTotals: CountPurchasedTransferredTotalsPipe,
        private notificationsService: NotificationsService,
        private usersMessagesStore: UsersMessagesSubjectService,
        private groupsMessagesStore: GroupsMessagesSubjectService,
        private groupsStore: GroupsStoreService,
        private groupsService: GroupsService,
        private postsService: PostsService,
        private notificationsStore: NotificationsSubjectStoreService,
        private chatService: ChatService,
        private unreadMessagesHelper: UnreadMessagesCounter
    ) {

    }

    ngOnInit(): void {
        this.getAuthenticatedUser();
        this.getRouterUrlParams();

        if (this.userStore.isAuthenticated()) {
            this.getUserCards();
            this.getDailyStocks();
            this.getMessagesFromSocket();
            this.getBlockUnblockUser();
            this.getUsersMessages();
            this.getUserPosts();
            this.getAllGroupsLoaded();
        }
    }

    getUsersMessages() {

        this.subscriptions.push(this.chatService.getDirectMessages({
            user_id: this.authUser.id,
            blocked: 0
        }).subscribe(dt => {
            this.usersMessagesStore.setUserMessages(dt);
        }));
    }

    getGroupsMessages() {
        return this.chatService.getGroupsMessages({
            user_id: this.authUser.id,
            blocked: 0
        });
    }

    getPageGroups() {
        return this.groupsService.get({
            user_id: this.authUser.id,
            blocked: 0
        });
    }

    getAllGroupsLoaded() {
        const chatGroups$ = this.getGroupsMessages();
        const pageGroups$ = this.getPageGroups();

        forkJoin(chatGroups$, pageGroups$, (chatGroups: any, pageGroups: any) => ({chatGroups, pageGroups}))
            .subscribe(pair => {
                this.addUserToSocket(pair);
                this.groupsStore.setGroups(pair.pageGroups);
                this.groupsMessagesStore.setGroupsMessages(pair.chatGroups);
            });

    }

    getUserPosts() {
        this.postsService.getAllPosts({user_id: this.authUser.id});
    }


    addUserToSocket(pair) {
        // console.log('add user to socket!!!!', pair);
        this.socketService.addNewUser({
            ...this.authUser,
            chat_groups: pair.chatGroups.map(cg => cg.name),
            page_groups: pair.pageGroups.map(pg => pg.name)
        });
    }

    getBlockUnblockUser() {
        this.subscriptions.push(this.socketService.getBlockUnblockUser().subscribe((dt: any) => {
            console.log('get block/unblock', dt)
            if (dt.from_user.id !== this.authUser.id) {
                this.notificationsStore.updateNotifications(dt);
            }
            this.usersMessagesStore.setUserMessages(dt.users_messages);
        }));
    }


    getAuthenticatedUser() {
        this.subscriptions.push(this.userStore.authUser$.subscribe(dt => {
            this.authUser = dt;
            // this.addUserToSocket([]);
        }));
    }

    getRouterUrlParams() {
        this.subscriptions.push(this.router.events.subscribe(ev => {
            if (ev instanceof NavigationEnd) {
                this.routerUrl = ev.url;
            } else if (ev instanceof ActivationEnd) {
                this.passedUsername = ev.snapshot.queryParams.username;
            }
        }));
    }

    getUserCards() {

        // Get user cards from saved storage in case of changes in the below components
        this.subscriptions.push(this.subject.currentUserCards.subscribe(dt => {
            this.userCards = dt;
            this.showPurchaseBits = false;
            // console.log(this.userCards)
        }));

        // Getting user cards from the server
        this.subscriptions.push(
            this.stripeCustomersService.getUserCards({user_id: this.authUser.id})
                .subscribe((dt: Card[]) => {
                    this.userCards = dt;
                    // console.log(this.userCards)
                    this.subject.changeUserCards(dt);
                    this.getAllPaymentsHistory();
                }));
    }

    getAllPaymentsHistory() {
        const params = {
            customer: this.userCards?.[0]?.stripe_customer_id,
            // email: this.authUser.email,
            user_id: this.authUser.id
        };
        if (params.customer) {
            this.subscriptions.push(this.paymentsService.getAllPaymentsHistory(params).subscribe(dt => {
                // console.log('navbar ', dt);
                this.totals = dt.user_coins;
                // this.subject.setAllPaymentsData(dt);
                this.subject.changePaymentsData(dt);
            }));
        }
    }

    async openProfilePage() {
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(async () =>
            await this.router.navigate(['users/' + this.authUser.username])
        );
    }


    logout() {
        this.subscriptions.push(this.auth.logout().subscribe(async () => {
            localStorage.removeItem('token');
            await this.router.navigate(['/']);
            this.socketService.disconnect({...this.authUser, leavingGroup: true});
        }));
    }

    searchVideos(e) {
        this.search.emit({...e, searchType: 'videos'});
    }

    searchStocks(e) {
        this.search.emit({...e, searchType: 'stocks'});
    }

    toggleMyProfileLink() {
        return !this.router.url.includes('users/profile');
    }

    toggleMyChannelLink() {
        return !this.router.url.includes('channels/show') || this.passedUsername !== this.authUser.username;
    }

    async changePage(l) {
        await this.router.navigate([l.link]);
    }

    getDailyStocks() {
        this.subscriptions.push(this.stocksService.getDailyStocks({}).subscribe(dt => {
            this.stocks = dt;
            this.subject.setStocksData(dt);
        }));
    }

    getPercentageValue(stock) {
        return stock.changesPercentage.replace(/[(%)]/g, '');
    }

    goToChannelPage() {
        this.router.navigateByUrl('/test', {skipLocationChange: true}).then(async () =>
            this.router.navigate([`channels/${this.authUser.username}`])
        );
    }

    checkIfUserHasCard() {
        if (this.userCards?.length > 0) {
            this.showPurchaseBits = !this.showPurchaseBits;
        } else {
            this.toastr.error('Please add at least one card first', 'No cards');
        }
    }

    notificationIconClicked() {
        this.closeRightSidenav.emit('notifications');
    }

    messagesClicked() {
        this.closeRightSidenav.emit('messages');
    }

    getUnreadNotificationsCount() {
        return this.notificationsStore.allNotifications.filter(n => !n?.read).length;
    }

    getMessagesFromSocket() {
        this.subscriptions.push(this.socketService.onNewMessage().subscribe((dt: any) => {
            const {from_id, to_id, direct_messages, group_id, group_messages} = dt;
            if (direct_messages) {
                if (from_id === this.authUser.id) {
                    this.usersMessagesStore.changeOneUserMessages(to_id, direct_messages);
                } else if (to_id === this.authUser.id) {
                    this.usersMessagesStore.changeOneUserMessages(from_id, direct_messages);
                }
            } else if (group_messages) {
                console.log('message received')
                this.groupsMessagesStore.changeGroupMessages(group_id, group_messages);
            }
        }));
    }

    getUnreadMessagesCount() {
        return this.unreadMessagesHelper.getUnreadMessagesCount(this.authUser);
    }

    isMessagesIconHidden() {
        return this.routerUrl === '/chat/messages' || !this.auth.loggedIn();
    }

    isWalletIconHidden() {
        return this.routerUrl === '/wallet/show' || !this.auth.loggedIn();
    }

    async openWalletPage() {
        await this.router.navigate(['wallet/show']);
    }

    ngAfterViewInit() {
        // console.log('after view init', this.chatGroupsLoaded, this.pageGroupsLoaded)
        // if (this.chatGroupsLoaded && this.pageGroupsLoaded) {
        //     this.addUserToSocket();
        // }
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
