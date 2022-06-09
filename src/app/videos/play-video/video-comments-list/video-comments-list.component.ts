import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {SubjectService} from '@core/services/subject.service';
import {VideoService} from '@core/services/video.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmationDialogComponent} from '@core/components/modals/confirmation-dialog/confirmation-dialog.component';
import {Subscription} from 'rxjs';
import trackByElement from '@core/helpers/track-by-element';

@Component({
    selector: 'app-video-comments-list',
    templateUrl: './video-comments-list.component.html',
    styleUrls: ['./video-comments-list.component.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoCommentsListComponent implements OnInit, OnDestroy {

    authUser;
    selectedComment;
    subscriptions: Subscription[] = [];
    showReplyForm = false;
    showReplyToReplyForm = false;
    showReplies = false;
    editReply = false;
    selectedReply;
    trackByElement = trackByElement;

    @Input() videoData;
    @Input() videoComments = [];
    @Input() editComment = false;

    constructor(
        private subject: SubjectService,
        private videoService: VideoService,
        private getAuthUser: GetAuthUserPipe,
        private dialog: MatDialog
    ) {
        this.authUser = this.getAuthUser.transform();
    }

    ngOnInit(): void {
    }


    isAuthor(c) {
        return c.user.id === this.videoData.author_id;
    }

    isMyComment(c) {
        return c.user.id === this.authUser.id;
    }

    getUpdatedComments(e) {
        this.videoComments = e;
        this.editComment = false;
        this.editReply = false;
        this.selectedComment = e.find(cm => cm.id === this.selectedComment?.id);
        this.selectedReply = e.find(c => c.id === this.selectedReply?.id);
    }

    selectComment(c, replyBtnClicked = false, replyCommentSelected = false) {
        if (!replyBtnClicked && !replyCommentSelected) {
            this.editComment = !this.editComment;
            this.showReplyForm = !this.editComment;
            this.selectedComment = c;
        } else if (replyCommentSelected) {
            this.editReply = true;
            this.selectedReply = c;
        } else {
            this.showReplyForm = this.selectedComment !== c || !this.showReplyForm;
            this.selectedComment = c;
            this.selectedReply = c;
        }
    }

    replyToReply(c, r) {
        this.showReplyToReplyForm = this.selectedReply !== r || !this.showReplyToReplyForm;
        this.selectedComment = c;
        this.selectedReply = r;
    }


    removeComment(c) {
        this.subscriptions.push(this.dialog.open(ConfirmationDialogComponent).afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.videoService.removeVideoComment({
                    user_id: this.authUser.id,
                    id: c.id,
                    video_id: c.video_id
                }).subscribe(dt => {
                    this.videoComments = dt;
                    this.selectedComment = dt.find(cm => cm.id === this.selectedComment?.id);
                });
            }
        }));
    }

    commentAdded(e) {
        this.videoComments = e;
        this.showReplyForm = false;
        this.showReplyToReplyForm = false;
        this.showReplies = true;
        this.selectedComment = e.find(c => c.id === this.selectedComment.id);
    }

    toggleReplies(c) {
        this.showReplies = !this.showReplies;
        this.selectedComment = c;
    }

    likeDislikeComment(e) {
        const params = this.buildParams(e.c, e.liked);


        this.subscriptions.push(this.videoService.updateCommentLikes(params).subscribe(dt => {
            this.videoComments = dt;
            this.showReplies = true;
            this.selectedComment = this.videoComments.find(comm => comm.id === this.selectedComment?.id);
        }));
    }

    buildParams(c, liked) {
        const params = {
            video_id: c.video_id,
            comment_id: c.id,
            user_id: this.authUser.id,
            liked: 0,
            disliked: 0,
            likes: c.likes,
            dislikes: c.dislikes
        };
        const conn = this.checkUserCommentConnection(c);

        // Avoiding negative values here
        params.likes = Math.max(0, conn?.liked ? --c.likes : +c.likes);
        params.dislikes = Math.max(0, conn?.disliked ? --c.dislikes : +c.dislikes);


        if (liked) {
            params.liked = +!conn?.liked;
        } else {
            params.disliked = +!conn?.disliked;
        }

        return params;
    }

    getReactorsCount(reactors, reaction) {
        return reactors.filter(r => r?.users_comments[reaction]).length;
    }


    checkUserCommentConnection(comment) {
        const foundInReactors = comment.reactors?.find(r => r.id === this.authUser.id);
        return foundInReactors?.users_comments;
    }

    isCommentShown(c) {
        return (c.id !== this.selectedComment?.id && !this.showReplyForm) || this.showReplyForm || !this.editComment;
    }

    isReplyShown(c) {
        return this.showReplies && this.selectedComment === c;
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
