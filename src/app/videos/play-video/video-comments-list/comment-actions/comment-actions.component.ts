import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';

@Component({
    selector: 'app-comment-actions',
    templateUrl: './comment-actions.component.html',
    styleUrls: ['./comment-actions.component.scss']
})
export class CommentActionsComponent implements OnInit {
    authUser;

    @Input() comment;
    @Output() commentSelected = new EventEmitter();
    @Output() remove = new EventEmitter();


    constructor(
        private getAuthUser: GetAuthUserPipe
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
    }



    selectComment(c) {
        this.commentSelected.emit(c);
    }

    removeComment(c) {
        this.remove.emit(c);
    }


}
