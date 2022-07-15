import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {VideoService} from '@core/services/video.service';
import {SubjectService} from '@core/services/subject.service';
import {FixTextLineBreaksPipe} from '@shared/pipes/fix-text-line-breaks.pipe';
import {CurrentUserData} from '@core/interfaces';
import {UserInfoService} from '@core/services/user-info.service';

@Component({
    selector: 'app-video-comments-form',
    templateUrl: './video-comments-form.component.html',
    styleUrls: ['./video-comments-form.component.scss']
})
export class VideoCommentsFormComponent implements OnInit, AfterViewInit {
    @Input() videoData;
    videoCommentsForm: FormGroup;
    inputFocused = false;
    authUser: CurrentUserData;
    isSubmitted = false;
    replyUsername;
    originalFormattedComment = '';


    @Input() editComment = false;
    @Input() selectedComment = null;
    @Input() selectedReply = null;
    @Input() reply = false;
    @Input() isReplyComment = false;
    @Input() reply2Reply = false;
    @Input() parentComment = null;
    @ViewChild('cEditable') cEditable;
    @Output('added') commentAdded = new EventEmitter();
    @Output('updated') commentUpdated = new EventEmitter();
    @Output('cancelled') cancelled = new EventEmitter();

    placeholderText;

    constructor(
        private fb: FormBuilder,
        private videoService: VideoService,
        private _userInfoService: UserInfoService,
        // private getAuthUser: GetAuthUserPipe,
        private subject: SubjectService,
        private cdr: ChangeDetectorRef,
        private fixLineBreaks: FixTextLineBreaksPipe
    ) {
        this._getAuthInfo();
    }


    ngOnInit(): void {
        // this.authUser = this.getAuthUser.transform();
        this.placeholderText = this.getPlaceholderText();

        this.videoCommentsForm = this.fb.group({
            id: [''],
            from_id: [this.authUser.id],
            comment: ['', Validators.required],
            video_id: [this.videoData.id],
            to_user_id: [0],
            to_comment_id: [0],
            to_reply_id: [0],
            is_reply: [0]
        });

        if (this.reply2Reply) {
            if (this.authUser.id !== this.selectedReply.from_id) {
                this.replyUsername = '@' + this.selectedReply?.user.username + ' ';
                this.videoCommentsForm.patchValue({comment: this.replyUsername});
            }
        }
    }

    private _getAuthInfo() {
        this._userInfoService._userInfo.subscribe((data) => {
            this.authUser = data;
            console.log(this.authUser, 'Vido-comments-form  AUTHUSER DATA');
        });
    }

    saveComment() {
        this.isSubmitted = true;
        if (this.videoCommentsForm.valid) {
            // Reply add
            if (this.reply) {
                this.videoCommentsForm.patchValue({
                    to_comment_id: this.selectedComment.id,
                    to_user_id: this.selectedComment.user.id,
                    is_reply: 1
                });
                // Reply edit
            } else if (this.isReplyComment) {
                this.videoCommentsForm.patchValue({
                    to_comment_id: this.parentComment.id,
                    to_user_id: this.parentComment.user.id,
                    is_reply: 1
                });
            } else if (this.reply2Reply) {
                const updatedUsername = '<strong class="reply-username">' + this.replyUsername + '</strong>';
                const reply2Reply = this.commentCtrl.value.replace(this.replyUsername, updatedUsername);
                this.videoCommentsForm.patchValue({
                    to_comment_id: this.selectedComment.id,
                    to_reply_id: this.selectedReply.id,
                    to_user_id: this.selectedComment.user.id,
                    comment: reply2Reply,
                    is_reply: 1
                });
            }

            // Comment & reply actions
            if (this.editComment) {

                if (this.parentComment) {
                    const updatedUsername = '<strong class="reply-username">' + this.replyUsername + '</strong>';
                    const reply2Reply = this.commentCtrl.value.replace(this.replyUsername, updatedUsername);
                    this.videoCommentsForm.patchValue({comment: reply2Reply});
                }


                this.videoService.updateVideoComment(this.videoCommentsForm.value).subscribe(dt => {
                    this.commentUpdated.emit(dt);
                    this.videoCommentsForm.get('comment').reset();
                });
            } else {

                this.videoService.addVideoComment(this.videoCommentsForm.value).subscribe(dt => {
                    this.inputFocused = false;
                    this.commentAdded.emit(dt);
                    this.videoCommentsForm.get('comment').reset();
                });
            }
        }
    }

    onCancel() {
        this.inputFocused = false;
        this.videoCommentsForm.get('comment').reset();
        if (this.editComment || this.reply || this.reply2Reply) {
            this.cancelled.emit();
        }
    }


    getPlaceholderText() {
        return 'Add a public ' + (this.reply ? 'reply' : 'comment') + '...';
    }

    get commentCtrl() {
        return this.videoCommentsForm.get('comment');
    }

    ngAfterViewInit() {
        if (this.editComment) {
            const comment = this.selectedComment.comment;
            if (this.parentComment) {
                this.replyUsername = comment.substring(
                    comment.lastIndexOf('@'),
                    comment.lastIndexOf(' ')
                );
            }
            this.videoCommentsForm.patchValue({
                comment: this.fixLineBreaks.transform(comment.replace(/<[^>]*>?/gm, '')),
                id: this.selectedComment.id
            });
            this.inputFocused = true;
            this.cdr.detectChanges();
        }
    }

}
