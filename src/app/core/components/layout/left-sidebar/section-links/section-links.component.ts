import {
    AfterViewChecked,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core';
import {MAIN_SECTIONS} from '@core/constants/global';
import {Router} from '@angular/router';
import {environment} from '@env';
import {AuthService} from '@core/services/auth.service';
import trackByElement from '@core/helpers/track-by-element';
import {SocketIoService} from '@core/services/socket-io.service';
import {ChatService} from '@core/services/chat.service';
import {SubjectService} from '@core/services/subject.service';
import {Subscription} from 'rxjs';
import {UsersMessagesSubjectService} from '@core/services/stores/users-messages-subject.service';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';
import {UnreadMessagesCounter} from '@core/helpers/get-unread-messages-count';

@Component({
    selector: 'app-section-links',
    templateUrl: './section-links.component.html',
    styleUrls: ['./section-links.component.scss']
})
export class SectionLinksComponent implements OnInit, OnDestroy, AfterViewChecked {
    mainSections = MAIN_SECTIONS;
    envName;
    newMessageSources = 0;
    usersMessages = [];
    subscriptions: Subscription[] = [];
    trackByElement = trackByElement;

    @Input() authUser;
    // tslint:disable-next-line:no-output-rename
    @Output('closeSidenav') closeSidenav = new EventEmitter();

    constructor(
        public router: Router,
        public auth: AuthService,
        private socketService: SocketIoService,
        private subject: SubjectService,
        private chatService: ChatService,
        private usersMessagesStore: UsersMessagesSubjectService,
        private groupsMessagesStore: GroupsMessagesSubjectService,
        private unreadMessagesHelper: UnreadMessagesCounter,
        private cdr: ChangeDetectorRef
    ) {
    }

    ngOnInit(): void {
        this.envName = environment.envName;
    }


    changePage(route, params = {}) {
        this.closeSidenav.emit(true);
        this.router.navigateByUrl('/test', {skipLocationChange: true}).then(async () =>
            await this.router.navigate([route], {queryParams: params})
        );
    }

    ngAfterViewChecked() {
        this.newMessageSources = this.unreadMessagesHelper.getUnreadMessagesCount(this.authUser);
        this.cdr.detectChanges();
    }


    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
