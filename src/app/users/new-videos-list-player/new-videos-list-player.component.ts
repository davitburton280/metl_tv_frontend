import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { NewVideoStateInitial, NewVidosItemInterface } from '@core/interfaces/new-vidos.interface';
import { NewVideosService } from '@core/services/new-videos.service';
import { MatDialog } from '@angular/material/dialog';
import { AddVideoPlaylistComponent } from '@app/users/new-videos-list-player/add-video-playlist';

@Component({
    selector: 'app-new-videos-list-player',
    templateUrl: 'new-videos-list-player.component.html',
    styleUrls: ['new-videos-list-player.component.scss']
})

export class NewVideosListPlayerComponent implements OnInit, OnDestroy {
    @ViewChild('videoPlayer') videoplayer: any;
    public isAuth = false;
    public newVideoDataSource$: Observable<NewVideoStateInitial> | undefined;
    public videoPath: any;
    public videosType: string;
    public show = false;
    public paymentModeStatus;
    private sort = {
        key: 'created_at',
        value: ''
    };

    constructor(
        private _router: ActivatedRoute,
        private _newVideosService: NewVideosService,
        private dialog: MatDialog
    ) {
        this.isAuth = Boolean(localStorage.getItem('token'));
        this._getType();
        if (this.videosType === 'new') {
            this.newVideoDataSource$ = this._newVideosService.newVideosState$.state$;
        } else {
            this.newVideoDataSource$ = this._newVideosService.tradingVideosState$.state$;
        }

    }

    ngOnInit() {
        this.setVideosState();

    }


    private _getType() {
        this._router.params.subscribe((params: Params) => {
            this.videosType = params.id;
            console.log(params.id, this.videosType);
        });
    }


    private setVideosState() {
        switch (this.videosType) {
            case 'new':
                this.sort.value = 'created_at';
                this._newVideosService.getNewVideosApi(this.sort);
                break;
            case 'views':
                this.sort.value = 'views';
                this._newVideosService.getTradingVideosApi(this.sort);
                break;
        }
    }

    public getPLayVideoData(e: any) {
        console.log(e);
        this.videoPath = e;
    }

    public pauseVideo(videoplayer) {
        videoplayer.nativeElement.play();
        // this.startedPlay = true;
        // if(this.startedPlay == true)
        // {
        setTimeout(() => {
            videoplayer.nativeElement.pause();
            if (videoplayer.nativeElement.paused) {
                this.show = !this.show;
            }
        }, 5000);
        // }
    }

    public openCreatePlayListDialog(first: NewVidosItemInterface, current: any) {
        console.log(first, current);
        const dialogRef = this.dialog.open(AddVideoPlaylistComponent, {
            height: 'auto',
            width: '350px',
            panelClass: 'custom-dialog-container',
            data: {
                id: current ? current.id : first.id
            }
        });
    }


    ngOnDestroy() {
    }
}
