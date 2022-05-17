import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-social-share-dialog',
    templateUrl: './social-share-dialog.component.html',
    styleUrls: ['./social-share-dialog.component.scss']
})
export class SocialShareDialogComponent implements OnInit {
    shareUrl;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialog: MatDialog,
        private toastr: ToastrService,
    ) {
        this.shareUrl = data.shareUrl;
    }

    ngOnInit(): void {
    }

    getTweeterLink() {
        return 'https://twitter.com/intent/tweet?text=' + this.shareUrl;
    }

    getFacebookLink() {
        return 'https://www.facebook.com/sharer/sharer.php?href=' + encodeURIComponent(this.shareUrl);
    }

    copyInputMessage(inputElement){
        this.dialog.closeAll();
        inputElement.select();
        document.execCommand('copy');
        inputElement.setSelectionRange(0, 0);
        this.toastr.success('Captioned');
    }

}
