import {ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {API_URL, CHANNEL_PAGE_TABS} from '@core/constants/global';
import {User} from '@shared/models/user';
import {VideoService} from '@core/services/video.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {ActivatedRoute, Router} from '@angular/router';
import {UsersService} from '@core/services/users.service';
import {Base64ToFilePipe} from '@shared/pipes/base64-to-file.pipe';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ChannelsService} from '@core/services/channels.service';
import {SubjectService} from '@core/services/subject.service';
import {MatDialog} from '@angular/material/dialog';
import {PlaylistsService} from '@core/services/playlists.service';
import {WatchlistTabComponent} from '@app/channels/show-channel/watchlist-tab/watchlist-tab.component';
import {VideosTabComponent} from '@app/channels/show-channel/videos-tab/videos-tab.component';
import {PlaylistsTabComponent} from '@app/channels/show-channel/playlists-tab/playlists-tab.component';
import {AuthService} from '@core/services/auth.service';
import {StocksListsModalComponent} from '@shared/components/stocks-lists-modal/stocks-lists-modal.component';
import {LoaderService} from '@core/services/loader.service';
import {UpdateUserStocksPipe} from '@shared/pipes/update-user-stocks.pipe';
import {StocksService} from '@core/services/stocks.service';
import {ToastrService} from 'ngx-toastr';
import trackByElement from '@core/helpers/track-by-element';
import {ChatService} from '@core/services/chat.service';
import {UsersMessagesSubjectService} from '@core/services/stores/users-messages-subject.service';

@Component({
    selector: 'app-show-channel',
    templateUrl: './show-channel.component.html',
    styleUrls: ['./show-channel.component.scss']
})
export class ShowChannelComponent implements OnInit, OnDestroy {

    authUser;

    activeTab;
    allTabs = CHANNEL_PAGE_TABS;

    apiUrl = API_URL;


    channelUser;
    passedUsername;
    passedTab;

    searchVideosForm: FormGroup;


    playlists = [];
    editMode = false;

    showFilters = false;
    filters = null;

    dataLoading = 'idle';

    userStocks = [];
    filteredStocks = [];
    subscriptions = [];
    trackByElement = trackByElement;

    showChatBox = false;


    @ViewChild(WatchlistTabComponent) watchListTab: WatchlistTabComponent;
    @ViewChild(VideosTabComponent) videosTab: VideosTabComponent;
    @ViewChild(PlaylistsTabComponent) playlistsTab: PlaylistsTabComponent;

    constructor(
        private videoService: VideoService,
        private getAuthUser: GetAuthUserPipe,
        public router: Router,
        private usersService: UsersService,
        private base64ToFile: Base64ToFilePipe,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private subjectService: SubjectService,
        private channelService: ChannelsService,
        private playlistsService: PlaylistsService,
        private subject: SubjectService,
        public auth: AuthService,
        private dialog: MatDialog,
        public loader: LoaderService,
        private updateStocks: UpdateUserStocksPipe,
        private stocksService: StocksService,
        public usersMessagesStore: UsersMessagesSubjectService,
        private toastr: ToastrService,
        private chatService: ChatService,
        private cdr: ChangeDetectorRef
    ) {
        this.authUser = this.getAuthUser.transform();
        // console.log(this.route.snapshot)
        this.passedUsername = this.route.snapshot.params.username;
        this.passedTab = this.route.snapshot.params.tab;
        // console.log(this.passedUsername)
        this.searchVideosForm = this.fb.group({search: ['', Validators.required]});
    }

    ngOnInit(): void {
        // localStorage.setItem('search', '');
        this.activeTab = CHANNEL_PAGE_TABS.filter(tabs => tabs.name.toLowerCase() === this.passedTab)?.[0] || CHANNEL_PAGE_TABS[0];
        this.getUserInfo();

        this.subject.currentUserStocks.subscribe((dt: any) => {
            this.userStocks = dt.stocks;
            this.filteredStocks = this.userStocks;
        });
    }

    toggleFilters() {
        this.showFilters = !this.showFilters;
        this.subject.setToggleFiltersData(this.showFilters);
    }

    getUserInfo() {
        this.loader.channelLoading.status = 'loading';
        const viewingOwnChannel = +(this.authUser.username === this.passedUsername);
        if (this.passedUsername) {
            this.usersService.getUserInfo({
                username: this.passedUsername,
                own_channel: viewingOwnChannel
            }).subscribe(dt => {
                console.log(dt);
                if (dt) {
                    this.channelUser = dt;
                }
                this.loader.channelLoading.status = 'finished';
            });
        }
    }


    async changeActiveTab(tab) {
        this.activeTab = tab;
        this.showFilters = false;
        await this.router.navigate([`/channels/show`], {
            queryParams: {
                tab: tab.name.toLowerCase(),
                username: this.passedUsername
            }
        });
        this.subject.setToggleFiltersData(this.showFilters);
        if (this.activeTab.name === 'Videos') {
            this.getUserInfo();
        }
    }

    searchInUserStocks(e) {
        localStorage.setItem('searchStock', e.search);
        this.subjectService.setStocksSearch(e.search);
    }

    searchVideos(e?) {
        localStorage.setItem('search', e.search);
        this.showFilters = false;
        this.subject.setToggleFiltersData(this.showFilters);
        this.subject.setVideosSearch(e.search);
    }

    async getVideosByTag(name) {
        await this.router.navigate(['videos'], {queryParams: {tag: name}});
    }

    openModal() {
        this.dialog.open(StocksListsModalComponent, {
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100%',
            width: '100%',
            panelClass: 'stocks-lists-modal'
        }).afterClosed().subscribe(dt => {
        });
    }

    isStockFollowed(stock) {
        return !!this.userStocks.find(s => s.name === stock.name);
    }

    updateFollowedStocksList(stock) {
        const result = this.updateStocks.transform(this.userStocks, stock, this.isStockFollowed(stock));
        if (result) {
            this.loader.stocksLoading.status = 'loading';
            this.subscriptions.push(this.stocksService.updateFollowedStocks(
                {user_id: this.authUser.id, ...{stocks: result}})
                .subscribe(dt => {
                    this.userStocks = dt?.user_stocks || [];
                    this.loader.stocksLoading.status = 'finished';
                    this.subject.changeUserStocks({stocks: this.userStocks, empty: this.userStocks.length === 0});
                }));
        }

    }

    onOutletLoaded(component, routerOutlet) {
        this.passedTab = routerOutlet.activatedRoute.snapshot.routeConfig.path;
        this.activeTab = CHANNEL_PAGE_TABS.filter(tabs => tabs.name.toLowerCase() === this.passedTab)?.[0] || CHANNEL_PAGE_TABS[0];
        component.authUser = this.authUser;
        component.channelUser = this.channelUser;
        this.cdr.detectChanges();
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }


}
