import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import {environment} from '@env';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {Subscription} from 'rxjs';
import {UsersMessagesSubjectService} from '@core/services/stores/users-messages-subject.service';
import {FixTextLineBreaksPipe} from '@shared/pipes/fix-text-line-breaks.pipe';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';

@Component({
    selector: 'app-chat-form',
    templateUrl: './chat-form.component.html',
    styleUrls: ['./chat-form.component.scss']
})
export class ChatFormComponent implements OnInit, OnDestroy {
    isProduction = environment.production;
    subscriptions: Subscription [] = [];
    chatForm: FormGroup;
    authUser;

    selectedUser = null;
    selectedGroup = null;
    @Input() embed = false;
    @Input() chatType = 'direct';
    @Output() sent = new EventEmitter();
    @Output() typing = new EventEmitter();
    @Output() seen = new EventEmitter();

    constructor(
        private fb: FormBuilder,
        private getAuthUser: GetAuthUserPipe,
        private usersMessagesStore: UsersMessagesSubjectService,
        private groupMessagesStore: GroupsMessagesSubjectService,
        private fixLineBreaks: FixTextLineBreaksPipe,
        private renderer: Renderer2
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
        this.initForm();

        if (this.chatType === 'direct') {
            this.getSelectedUserChanges();
        } else {
            this.getSelectedGroupChanges();
        }

    }

    getSelectedUserChanges() {
        this.subscriptions.push(this.usersMessagesStore.selectedUserMessages$.subscribe((dt: any) => {
            if (dt) {
                this.chatForm.patchValue({message: ''});
                this.setTyping();

                this.selectedUser = dt;

                this.chatForm.patchValue({
                    connection_id: this.selectedUser?.users_connections[0]?.id,
                    to_id: this.selectedUser?.id,
                    to_username: this.selectedUser?.username,
                });
            }

        }));
    }


    getSelectedGroupChanges() {
        this.subscriptions.push(this.groupMessagesStore.selectedGroupsMessages$.subscribe((dt: any) => {
            this.selectedGroup = dt;
            if (this.selectedGroup) {
                this.chatForm.patchValue({
                    group_id: this.selectedGroup.id,
                    group_name: this.selectedGroup.name
                });
            }
        }));
    }


    initForm() {

        const mainFields = {
            from_username: [this.authUser.username],
            from_id: [this.authUser.id],

            // to_user: [null],
            message: ['', Validators.required],

        };

        const directChatFields = {
            connection_id: [''],
            from_user: [this.authUser],
            to_id: [''],
            to_username: [null],
            avatar: [this.authUser?.avatar],
            personal: [1],
            seen: false,
            seen_at: ''
        };

        const groupChatFields = {
            group_id: [''],
            group_name: [''],
            from_first_name: [this.authUser.first_name],
            from_last_name: [this.authUser.last_name],
            from_avatar: [this.authUser?.avatar]
        };

        const mergedFields = this.chatType === 'direct' ?
            {...mainFields, ...directChatFields} : {...mainFields, ...groupChatFields};


        this.chatForm = this.fb.group(mergedFields);
    }

    setSeen() {
        this.seen.emit({
            ...this.chatForm.value
        });
    }

    setTyping() {

        this.typing.emit({
            ...this.chatForm.value,
            from_first_name: this.authUser.first_name
        });
    }

    sendMessageOnEnter(e) {

        const message = this.fixLineBreaks.transform(this.chatForm.value.message, e.target);
        if (e.key === 'Enter' && !e.shiftKey) {

            this.chatForm.patchValue({message});
            this.sendMessage();
        }
    }

    sendMessage() {
        if (this.chatForm.valid && this.chatForm.value.message.trim() !== '') {
            this.sent.emit({
                ...this.chatForm.value,
            });
            this.chatForm.patchValue({message: ''});
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
