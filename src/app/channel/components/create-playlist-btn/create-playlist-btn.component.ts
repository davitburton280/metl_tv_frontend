import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreatePlaylistDialogComponent } from '@app/channel/dialogs';

@Component({
    selector: 'app-create-playlist-btn',
    templateUrl: 'create-playlist-btn.component.html',
    styleUrls: ['create-playlist-btn.component.scss']
})

export class CreatePlaylistBtnComponent implements OnInit, OnDestroy {

    constructor(
        private dialog: MatDialog
    ) {
    }

    ngOnInit() {
    }


    public openCreatePlayListDialog() {
        const dialogRef = this.dialog.open(CreatePlaylistDialogComponent, {
            height: 'auto',
            width: '350px',
            panelClass: 'custom-dialog-container'
        });
    }




    ngOnDestroy() {
    }
}
