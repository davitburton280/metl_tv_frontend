import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import {environment} from '@env';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {Subscription} from 'rxjs';
import {UsersMessagesSubjectService} from '@core/services/stores/users-messages-subject.service';
import {FixTextLineBreaksPipe} from '@shared/pipes/fix-text-line-breaks.pipe';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { VideoService } from '@core/services/video.service';
import { ToastrService } from 'ngx-toastr';

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

    inputDisabled = true;

    selectedUser = null;
    selectedGroup = null;
    @Input() embed = false;
    @Input() chatType = 'direct';
    @Output() sent = new EventEmitter();
    @Output() typing = new EventEmitter();
    @Output() seen = new EventEmitter();
    @ViewChild('input') input;

    files = [];
    mode: ProgressSpinnerMode = 'determinate';
    value = [];

    constructor(
        private fb: FormBuilder,
        private getAuthUser: GetAuthUserPipe,
        private usersMessagesStore: UsersMessagesSubjectService,
        private groupMessagesStore: GroupsMessagesSubjectService,
        private fixLineBreaks: FixTextLineBreaksPipe,
        private uploadFile: VideoService,
        private renderer: Renderer2,
        private toaster: ToastrService
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
        this.usersMessagesStore.selectedUserMessages$.subscribe((dt) => {
            this.inputDisabled = !dt;
        });
        this.initForm();

        if (this.chatType === 'direct') {
            this.getSelectedUserChanges();
        } else {
            this.getSelectedGroupChanges();
        }

    }

    chatFile(event) {
        const fl = event.target.files;
        console.log(fl);
        if (fl.length > 10) {
            this.toaster.error('select max 10 file');
            this.input.nativeElement.value = '';
            return;
        } else {
            let size = 0;
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < fl.length; i++) {
                size += fl[i].size;
            }
            if ((size / 1024) / 1024 > 100) {
                this.toaster.error('maximum file size 100 MB');
                this.input.nativeElement.value = '';
                return;
            }
        }
        console.log(this.input.nativeElement.value);
        for (let i = 0; i < fl.length; i++) {
            this.files.push({ file: fl[i], progress: false, progressValue: 0 });
            this.fileProgressBarr(fl[i], i);
        }
        this.input.nativeElement.value = '';
    }

    fileProgressBarr(file, i) {
        this.files[i].progress = true;
        const reader = new FileReader();
        reader.onprogress = (e) => {
            const loaded = e.loaded;
            const total = e.total;
            this.files[i].progressValue = Number(((loaded / total) * 100).toFixed());
            if (this.files[i].progressValue === 100) {
                this.files[i].progress = false;
            }
        };
        reader.readAsDataURL(file);
    }

    removeMessageFile(file) {
        console.log(file);
        if (this.files.length > 0) {
            this.files.forEach((elem, index) => {
                if (elem.file.name === file.name
                    && elem.file.size === file.size
                    && elem.file.type === file.type
                    && elem.file.lastModified === file.lastModified) {
                    this.files.splice(index, 1);
                }
            });
        }
        console.log(this.files);
        console.log(this.chatForm.value);
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
        console.log(this.inputDisabled);

        const mainFields = {
            from_username: [this.authUser.username],
            from_id: [this.authUser.id],

            // to_user: [null],
            message: [ {value: '', disabled: this.inputDisabled}],
            files: [[]],
            // message: ['', Validators.required],

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
        console.log('send');
        if (this.chatForm.valid) {
            if (this.files.length > 0) {
                const fd = new FormData();
                this.files.forEach(elem => {
                    fd.append('message_files', elem.file);
                });
                this.uploadFile.uploadFile(fd, 'message_files').subscribe(dt => {
                    console.log(dt);
                    console.log(this.files);
                    if (dt) {
                        this.toaster.success(dt.message);
                        const files = [];
                        dt.path.forEach((elem) => {
                            const obj = {
                                name: elem.path,
                                originName: elem.name,
                                type: elem.type
                            };
                            files.push(obj);
                        });
                        this.chatForm.patchValue({ files });
                        this.sent.emit({
                            ...this.chatForm.value,
                        });
                        this.chatForm.patchValue({message: ''});
                        this.chatForm.patchValue({files: []});
                        this.files = [];
                    }
                });
            }
            if (this.files.length === 0) {
                this.sent.emit({
                    ...this.chatForm.value,
                });
                this.chatForm.patchValue({message: ''});
                this.chatForm.patchValue({files: []});
                this.files = [];
                console.log(this.chatForm.value);
            }
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
