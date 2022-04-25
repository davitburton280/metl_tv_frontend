import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {ActivationEnd, NavigationEnd, Router} from '@angular/router';
import {ChannelsService} from '@core/services/channels.service';
import {API_URL, MAIN_SECTIONS} from '@core/constants/global';
import {moveItemInArray} from '@core/helpers/move-item-in-array';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {SubjectService} from '@core/services/subject.service';
import {AuthService} from '@core/services/auth.service';
import {environment} from '@env';
import {StocksService} from '@core/services/stocks.service';
import IsResponsive from '@core/helpers/is-responsive';

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
        private getAuthUser: GetAuthUserPipe,
        public auth: AuthService,
        private subject: SubjectService,
    ) {
        this.envName = environment.envName;
        this.authUser = this.getAuthUser.transform();
    }

    ngOnInit(): void {
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
}
