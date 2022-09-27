import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ChannelsService } from '@core/services/channels.service';

@Component({
    selector: 'app-confirm-dialog',
    templateUrl: 'confirm-dialog.component.html',
    styleUrls: ['confirm-dialog.component.scss']
})

export class ConfirmDialogComponent implements OnInit, OnDestroy {
    private _unsubscribe$ = new Subject<void>();

    constructor(
        private dialogRef: MatDialogRef<ConfirmDialogComponent>,
        private _channelService: ChannelsService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    }

    ngOnInit(): void {
    }


    public closeDialogConfirm() {
        this.dialogRef.close();
    }

    public confirm() {
        console.log('remove');
        switch (this.data.confirm) {
            case 'remove':
                this.data.func.pipe(
                    takeUntil(this._unsubscribe$)
                )
                    .subscribe((data: any) => {
                        this._channelService.channelVideoState$.deleteVideo(this.data.ids);
                        this._channelService.channelVideoState$.setLoading(false);
                        this.dialogRef.close();
                    });
                break;
            case 'Privicy':
                this.data.func.pipe(
                    takeUntil(this._unsubscribe$)
                )
                    .subscribe((data: any) => {
                        this._channelService.channelVideoState$.updatePrivate(this.data.video_id, data.data);
                        this._channelService.channelVideoState$.setLoading(false);
                        this.dialogRef.close();
                    });
                break;
        }
    }

    ngOnDestroy(): void {
    }
}
