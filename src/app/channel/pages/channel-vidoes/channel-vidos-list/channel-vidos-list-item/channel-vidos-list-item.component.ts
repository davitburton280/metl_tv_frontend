import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ChannelVidosDataListInterface } from '@core/interfaces/channel-vidos.interface';
import { ConfirmDialogComponent } from '@app/channel/dialogs/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ChannelsService } from '@core/services/channels.service';
import { UserInfoService } from '@core/services/user-info.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CurrentUserData } from '@core/interfaces';

@Component({
    selector: 'app-channel-videos-list-item',
    templateUrl: 'channel-vidos-list-item.component.html',
    styleUrls: ['channel-vidos-list-item.component.scss']
})

export class ChannelVidosListItemComponent implements OnInit, OnDestroy {
    @Input() videosItem: ChannelVidosDataListInterface | undefined;
    private _unsubscribe$ = new Subject<void>();
    private _authUser: CurrentUserData;
    public menuShow = false;

    constructor(
        private _dialog: MatDialog,
        private _channelsService: ChannelsService,
        private _userInfoService: UserInfoService
    ) {
        this._getAuthInfo();
    }

    ngOnInit() {
        console.log(this.videosItem, 'videosList');
    }

    private _getAuthInfo() {
        this._userInfoService._userInfo
            .pipe(
                takeUntil(this._unsubscribe$)
            )
            .subscribe((data) => {
                this._authUser = data;
            });
    }

    public show() {
        this.menuShow = !this.menuShow;
    }

    public openConfirmDialogPrivicy() {
        const obj = {
            privacy: this.videosItem.privacy_id === 2 ? 1 : 2,
            video_id: this.videosItem.id
        };
        this._dialog.open(ConfirmDialogComponent, {
            height: 'auto',
            width: 'auto',
            data: {
                confirm: 'Privicy',
                func: this._channelsService.updatePrivacy(this.videosItem.id, obj),
                video_id: this.videosItem.id
            }
        });
    }

    public openConfirmDialogRemuve() {
        const obj = {
            id: this.videosItem.id,
            filename: this.videosItem.filename,
            username: this._authUser.username
        };
        this._dialog.open(ConfirmDialogComponent, {
            height: 'auto',
            width: 'auto',
            data: {
                confirm: 'remove',
                ids: this.videosItem.id,
                func: this._channelsService.deleteChannelVideo(obj)
            }
        });
    }


    ngOnDestroy() {
    }
}
