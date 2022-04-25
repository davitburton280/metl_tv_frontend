import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {Router} from '@angular/router';

@Component({
    selector: 'app-single-comment',
    templateUrl: './single-comment.component.html',
    styleUrls: ['./single-comment.component.scss']
})
export class SingleCommentComponent implements OnInit {

    @Input() comment;
    @Input() videoData;
    @Input() showReplyForm;
    @Input() selectedComment;
    @Input() selectedReply;
    @Input() showReplies;
    @Input() reply;
    @Input() reply2Reply;

    @Output() toggleReplies = new EventEmitter();
    @Output() commentAdded = new EventEmitter();
    @Output() selectComment = new EventEmitter();
    @Output() likeDislikeComment = new EventEmitter();

    authUser;

    constructor(
        private getAuthUser: GetAuthUserPipe,
        public router: Router
    ) {
        this.authUser = this.getAuthUser.transform();
    }

    ngOnInit(): void {
    }

    isAuthor(c) {
        return c.user.id === this.videoData.author_id;
    }

    getRepliesTogglerText(c) {
        const len = c.replies.length;
        return `View ${len + (len > 1 ? ' replies' : ' reply')}`;
    }

    selectCommentFn(c) {
        this.selectComment.emit(c);
    }

    commentAddedFn(e) {
        this.commentAdded.emit(e);
    }

    toggleRepliesFn(c) {
        this.toggleReplies.emit(c);
    }

    likeDislikeCommentFn(c, liked = true) {
        this.likeDislikeComment.emit({c, liked});
    }

    checkUserCommentConnection(c) {
        const foundInReactors = c.reactors.find(r => r.id === this.authUser.id);
        return foundInReactors?.users_comments;
    }

    getReactorsCount(reactors, reaction) {
        return reactors.filter(r => r?.users_comments[reaction]).length;
    }

    getFullName(data) {
        return data.first_name + ' ' + data.last_name;
    }

    async openChannelPage(username) {
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(async () =>
            await this.router.navigate(['channels/' + username])
        );
    }
}
