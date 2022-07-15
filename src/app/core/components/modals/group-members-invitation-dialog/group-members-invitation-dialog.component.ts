import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {User} from '@shared/models/user';
import {Subscription} from 'rxjs';
import {UsersService} from '@core/services/users.service';
import {SocketIoService} from '@core/services/socket-io.service';
import {GetTwoArrayOfObjectsDifferencePipe} from '@shared/pipes/get-two-array-of-objects-difference.pipe';
import {UsersMessagesSubjectService} from '@core/services/stores/users-messages-subject.service';
import {AbstractControl, FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {GroupsStoreService} from '@core/services/stores/groups-store.service';
import {GroupsService} from '@core/services/groups.service';

@Component({
    selector: 'app-group-members-invitation-dialog',
    templateUrl: './group-members-invitation-dialog.component.html',
    styleUrls: ['./group-members-invitation-dialog.component.scss']
})
export class GroupMembersInvitationDialogComponent implements OnInit, OnDestroy {
    selectedGroup;
    userContacts: User[] = [];
    selectedContacts: User[] = [];

    subscriptions: Subscription[] = [];

    contactsInviteForm: FormGroup;

    constructor(
        @Inject(MAT_DIALOG_DATA) public authUser: User,
        private groupsStore: GroupsStoreService,
        private usersMessagesStore: UsersMessagesSubjectService,
        private usersService: UsersService,
        private socketService: SocketIoService,
        private groupsService: GroupsService,
        private dialog: MatDialogRef<GroupMembersInvitationDialogComponent>,
        private getArraysDifference: GetTwoArrayOfObjectsDifferencePipe,
        private fb: FormBuilder
    ) {

    }

    ngOnInit(): void {
        this.selectedGroup = this.groupsStore.selectedGroup;
        this.initForm();
    }


    initForm() {
        this.contactsInviteForm = this.fb.group({
            contacts: this.fb.array(this.getContactsFormGroup()),
        });
    }

    getContactsFormGroup() {
        const formArray = [];
        this.usersMessagesStore.usersMessages.map((c, index) => {
            const foundInSelected = this.selectedContacts.find(sc => sc.id === c.id);
            const foundInGroup = this.selectedGroup.group_members.find(m => m.id === c.id);
            let connectionWithGroup = 'not joined';

            if (foundInGroup) {
                const connectionContainer = foundInGroup.groups_members;

                if (foundInGroup) {
                    connectionWithGroup = !!connectionContainer.confirmed ? 'joined' : 'invited';
                    if (connectionContainer.accepted && !connectionContainer.confirmed) {
                        connectionWithGroup = 'accepted';
                    }
                }
            }


            formArray.push(this.fb.group({
                name: 'contact_' + index,
                checked: !!foundInSelected,
                status: connectionWithGroup,
                ...c
            }));
        });
        return formArray;
    }

    selectContact(event: Event, control: AbstractControl) {
        const isChecked = (event.target as HTMLInputElement).checked;
        if (isChecked) {
            this.selectedContacts.push(control.value);
        } else {
            this.selectedContacts = this.selectedContacts.filter(c => c.id !== control.value.id);
        }
    }

    removeContactFromSelected(control: AbstractControl) {
        const foundControl = this.contactCtrls.controls.find(c => c.value.id === control.value.id);
        this.selectedContacts = this.selectedContacts.filter(c => c.id !== control.value.id);
        foundControl.patchValue({checked: false});
    }

    sendInvitationsToContacts() {
        this.subscriptions.push(this.groupsService.addGroupMembers({
            group_id: this.selectedGroup.id,
            member_ids: this.selectedContacts.map(c => c.id)
        }).subscribe(dt => {
            this.socketService.inviteToNewPageGroup({
                invited_members: this.selectedContacts,
                from_user: this.authUser,
                group: this.selectedGroup,
                msg: `<strong>${this.authUser.first_name + ' ' + this.authUser.last_name}</strong>
                    has sent an invitation to join the <strong>${this.selectedGroup.name}</strong> group`,
            });
            this.groupsStore.changeGroup(dt);
            this.closeDialog();
        }));
    }

    isProcessedContact(status) {
        return ['invited', 'joined', 'accepted'].indexOf(status) !== -1;
    }

    get contactCtrls() {
        return this.contactsInviteForm.controls.contacts as FormArray;
    }

    get checkedContactCtrls() {
        return this.contactCtrls.controls.filter(c => c.value.checked);
    }

    getCheckBoxControl(control) {
        return control.controls.checked;
    }

    closeDialog() {
        this.dialog.close();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
