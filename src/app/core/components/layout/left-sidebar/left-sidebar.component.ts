import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ActivationEnd, NavigationEnd, Router} from '@angular/router';
import {ChannelsService} from '@core/services/channels.service';
import {API_URL} from '@core/constants/global';
import {SubjectService} from '@core/services/subject.service';
import {AuthService} from '@core/services/auth.service';
import {environment} from '@env';
import IsResponsive from '@core/helpers/is-responsive';
import {UserInfoService} from '@core/services/user-info.service';

@Component({
    selector: 'app-left-sidebar',
    templateUrl: './left-sidebar.component.html',
    styleUrls: ['./left-sidebar.component.scss']
})
export class LeftSidebarComponent implements OnInit {

    apiUrl = API_URL;
    authUser;
    routerUrl;
    envName;
    isSmallScreen = IsResponsive.isSmallScreen();


    @Output('closeSidenav') closeSidenav = new EventEmitter();

    constructor(
        public router: Router,
        private channelsService: ChannelsService,
        public auth: AuthService,
        private subject: SubjectService,
        private _userInfoService: UserInfoService
    ) {
        this.envName = environment.envName;
        this._getUserInfo();
    }

    ngOnInit(): void {
        // this._getUserInfo();
        this.router.events.subscribe(ev => {
            if (ev instanceof NavigationEnd) {
                this.routerUrl = ev.url;
            } else if (ev instanceof ActivationEnd) {

            }
        });


    }

    changePage(route, params = {}) {
        this.closeSidenav.emit(true);
        this.router.navigateByUrl('/test', {skipLocationChange: true}).then(async () =>
            await this.router.navigate([route], {queryParams: params})
        );
    }

    private _getUserInfo() {
        this._userInfoService._userInfo.subscribe((data) => {
            this.authUser = data;
            console.log(this.authUser);
        });
    }
}
