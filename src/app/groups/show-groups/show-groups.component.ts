import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserStoreService} from '@core/services/stores/user-store.service';
import {Observable, Subject} from 'rxjs';
import {CreateNewGroupDialogComponent} from '@core/components/modals/create-new-group-dialog/create-new-group-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {ChatService} from '@core/services/chat.service';
import {SocketIoService} from '@core/services/socket-io.service';
import {Router} from '@angular/router';
import {GroupsStoreService} from '@core/services/stores/groups-store.service';
import {CurrentUserData} from '@core/interfaces';
import {UserInfoService} from '@core/services/user-info.service';
import {takeUntil} from 'rxjs/operators';
import {FormBuilder, FormGroup} from '@angular/forms';
import {GroupsService} from '@core/services/groups.service';
import {GroupInitialStateInterface} from '@core/interfaces/group.interface';

@Component({
    selector: 'app-show-groups',
    templateUrl: './show-groups.component.html',
    styleUrls: ['./show-groups.component.scss']
})
export class ShowGroupsComponent implements OnInit, OnDestroy {
    public filterGroup: FormGroup | undefined;
    public dataSource$: Observable<GroupInitialStateInterface>;
    public authUser: CurrentUserData;
    private _unsubscribe$ = new Subject<void>();
    private groups = [];
    private searchKeyValue = '';
    public isPrivate = false;

    constructor(
        public groupsStore: GroupsStoreService,
        private _groupsService: GroupsService,
        private chatService: ChatService,
        private userStore: UserStoreService,
        private socketService: SocketIoService,
        public router: Router,
        private dialog: MatDialog,
        private _fb: FormBuilder,
        private _userInfoService: UserInfoService,
    ) {
        this._getAuthInfo();
        this.dataSource$ = this._groupsService.groupsState$.state$;
    }

    ngOnInit(): void {
        this.trackGroups();
        this._formBuilder();
        this._getGroupList(this.searchKeyValue, this.filterGroup.get('radioButton').value, this.isPrivate);
    }

    private _formBuilder(): void {
        this.filterGroup = this._fb.group({
            searchKey: [''],
            radioButton: [''],
            checkboxButton: [false],
        });
    }

    public handleChange(e): void {
        this.isPrivate = e.checked;
        this._getGroupList(this.searchKeyValue, this.filterGroup.get('radioButton').value, this.isPrivate);
    }

    public myGroupFilter(e): void {
        this._getGroupList(this.searchKeyValue, this.filterGroup.get('radioButton').value, this.isPrivate);
    }

    public _filterSearchKey(eventTarget): any {
        this.searchKeyValue = eventTarget.value;
        this._getGroupList(this.searchKeyValue, this.filterGroup.get('radioButton').value, this.isPrivate);
    }

    private _getGroupList(filterData, group_type, isPrivate): any {
        const params = {
            search: filterData,
            onlyMy: group_type,
            isPrivate: isPrivate ? 1 : 0
        };
        this._groupsService.getGroupList(params);
    }

    private trackGroups() {
        this.groupsStore.groups$
            .pipe(
                takeUntil(this._unsubscribe$),
            )
            .subscribe(dt => {
                this.groups = dt;
            });
    }

    private _getAuthInfo() {
        this._userInfoService._userInfo
            .pipe(
                takeUntil(this._unsubscribe$),
            )
            .subscribe((data) => {
                this.authUser = data;
            });
    }

    public filterGroups(type) {
        return this.groups.filter(g => {
            return type === 'managed' ?
                g.creator_id === this.authUser?.id :
                g.creator_id !== this.authUser?.id;
        });
    }

    public openModal() {
        this.dialog.open(CreateNewGroupDialogComponent, {
            width: '700px',
            height: 'auto',
            data: this.authUser
        }).afterClosed()
            .pipe(
                takeUntil(this._unsubscribe$),
            )
            .subscribe(async (selectedGroup) => {
                if (selectedGroup) {
                    await this.router.navigateByUrl('/groups');
                }
            });
    }

    ngOnDestroy(): void {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }
}
