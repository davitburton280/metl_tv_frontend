import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';

@Component({
    selector: 'app-group-form',
    templateUrl: './group-form.component.html',
    styleUrls: ['./group-form.component.scss']
})
export class GroupFormComponent implements OnInit {
    groupForm: FormGroup;
    showGroupChatForm = false;

    @Input() authUser;

    constructor(
        private fb: FormBuilder,
        private groupsMessagesStore: GroupsMessagesSubjectService
    ) {
    }

    ngOnInit(): void {
        this.initForm();
    }

    initForm() {
        this.groupForm = this.fb.group({
            creator_id: [this.authUser.id],
            name: ['', Validators.required],
            username: [this.authUser.username]
        });
    }

    addGroup() {
        if (this.groupForm.valid) {
            this.groupsMessagesStore.setAddGroupFormValue(this.groupForm.value);
            this.groupForm.patchValue({name: ''});
        }
    }

    toggleForm(shown: boolean) {
        this.showGroupChatForm = shown;
    }

}
