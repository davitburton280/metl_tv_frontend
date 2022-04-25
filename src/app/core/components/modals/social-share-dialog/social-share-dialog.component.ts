import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
    selector: 'app-social-share-dialog',
    templateUrl: './social-share-dialog.component.html',
    styleUrls: ['./social-share-dialog.component.scss']
})
export class SocialShareDialogComponent implements OnInit {
    shareUrl;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
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
        inputElement.select();
        document.execCommand('copy');
        inputElement.setSelectionRange(0, 0);
    }

}
