import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SubjectService} from '@core/services/subject.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {API_URL} from '@core/constants/global';
import {ChatService} from '@core/services/chat.service';
import {FixTextLineBreaksPipe} from '@shared/pipes/fix-text-line-breaks.pipe';
import {VideoChatService} from '@core/services/video-chat.service';

@Component({
    selector: 'app-chat-box',
    templateUrl: './chat-box.component.html',
    styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent implements OnInit {
    chatForm: FormGroup;
    messageSent = false;

    authUser;
    selectedUsersToReply = [];
    userSelected = false;
    apiUrl = API_URL;
    loadingMessages = false;
    showChatBox = true;

    customEmojis = [
        {
            name: 'Octocat',
            shortNames: ['octocat'],
            text: '',
            emoticons: [],
            keywords: ['github'],
            imageUrl: 'https://github.githubassets.com/images/icons/emoji/octocat.png',
        }
    ];

    @Input() messages = [];
    @Input() openViduToken = null;
    @Input() session = null;
    @Input() videoId;
    @Input() videoRecordingState = null;
    @Output('sendMessage') sendMsg = new EventEmitter();

    constructor(
        private fb: FormBuilder,
        private subject: SubjectService,
        private getAuthUser: GetAuthUserPipe,
        private chatService: ChatService,
        private videoChatService: VideoChatService,
        private fixLineBreaks: FixTextLineBreaksPipe
    ) {
        this.authUser = this.getAuthUser.transform();
        if (!this.videoRecordingState) {
            this.videoRecordingState = 'idle';
        }
    }

    ngOnInit(): void {

        this.initForm();
        this.getChatMessagesFromParentComponents();
        this.getVideoRecordingState();
        this.loadVideoPreviousMessages();
        console.log(this.messages, this.authUser)
    }

    initForm() {
        this.chatForm = this.fb.group({
            token: [this.openViduToken],
            from: [this.authUser.username],
            from_id: [this.authUser.id],
            from_user: [this.authUser],
            from_channel: [this.authUser.channel],
            to_id: [''],
            avatar: [this.authUser.avatar],
            message: ['', Validators.required]
        });
    }

    loadVideoPreviousMessages() {
        if (this.videoId) {
            this.loadingMessages = true;
            this.videoChatService.getChatMessages({video_id: this.videoId}).subscribe(dt => {
                this.messages = dt;
                this.loadingMessages = false;
            });
        }
    }

    // Getting messages from publisher or subscriber component
    getChatMessagesFromParentComponents() {
        this.subject.getMsgData().subscribe((data) => {
            const msgData = {from_user: null, from: '', avatar: '', message: ''};
            if (data?.from?.includes('clientData')) {
                const from = JSON.parse(data.from.replace(/}%\/%{/g, ','));
                console.log(data)
                console.log(from)
                msgData.from = from.clientData.myUserName;
                msgData.from_user = from.from_user;
                msgData.avatar = from.avatar;
                msgData.message = data.message;
            } else {
                const from_user = JSON.parse(data.from_user.replace(/}%\/%{/g, ','));
                msgData.from_user = from_user.from_user;
                console.log('OK!!!', from_user)
                msgData.avatar = from_user.avatar;
                msgData.message = data.message;
            }

            // if (msgData.from_user.username !== this.authUser.username) {

            this.messages.push(msgData);
            // }
        });
    }

    getVideoRecordingState() {
        this.subject.getVideoRecordingState().subscribe(data => {
            this.videoRecordingState = data.recording ? 'started' : 'finished';
            // console.log('VIDEO RECORDING STATE:' + this.videoRecordingState + '!!!!');
        });
    }

    selectUserToReply(m) {

        if (m.from_user.username !== this.authUser.username) {
            this.userSelected = true;
            if (!this.selectedUsersToReply.includes(m.from_user.username)) {
                this.selectedUsersToReply.push(m.from_user.username);
                this.chatForm.patchValue({message: '@' + m.from_user.username + ''});
            } else {
                this.selectedUsersToReply = this.selectedUsersToReply.filter(f => f !== m.from_user.username);
                this.chatForm.patchValue({message: ''});
            }

            console.log(this.selectedUsersToReply)
        }
    }

    sendMessage(e) {
        // Getting video id for publisher and subscriber differently
        if (this.videoId && this.chatForm.valid) {
            const message = this.fixLineBreaks.transform(this.chatForm.value.message, null, e.target);
            this.chatForm.patchValue({message});
            const data = {video_id: this.videoId, ...this.chatForm.value};
            console.log(data)
            // this.messages.push(data);
            this.sendMsg.emit(data);
            this.chatForm.patchValue({message: ''});
        } else {
            console.log('video id is not set');
        }
    }

    addEmoji(e) {
        console.log(e)
        const message = this.chatForm.value.message;
        this.chatForm.patchValue({message: message + (e.emoji.native ? e.emoji.native : e.emoji.imageUrl)});
    }

}
