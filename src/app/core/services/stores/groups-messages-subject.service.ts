import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GroupsMessagesSubjectService {
    protected groupsMessagesSource = new BehaviorSubject([]);
    protected selectedGroupMessagesSource = new BehaviorSubject({});

    groupsMessages$ = this.groupsMessagesSource.asObservable();
    selectedGroupsMessages$ = this.selectedGroupMessagesSource.asObservable();

    private addGroupFormValue$ = new Subject<any>();

    showMembersForm = false;
    showBottomChatBox = false;
    showResponsiveChatBox = false;

    constructor() {
    }

    get groupsMessages() {
        return this.groupsMessagesSource.getValue();
    }

    setGroupsMessages(messages: any) {
        this.groupsMessagesSource.next([...messages]);
    }

    get selectedGroupMessages() {
        return this.selectedGroupMessagesSource.getValue() as any;
    }

    selectGroup(groupMessages: any) {
        // console.log('SELECT GROUP:', groupMessages)
        this.selectedGroupMessagesSource.next(groupMessages);
    }

    changeGroup(groupMessages: any) {
        const allGroupMessages = [...this.groupsMessages];
        let selectedGroupIndex = allGroupMessages.findIndex(gm => gm.id === groupMessages.id);

        console.log(allGroupMessages)
        // console.log(selectedGroupIndex)

        if (selectedGroupIndex === -1) {
            selectedGroupIndex = 0;
        }

        allGroupMessages[selectedGroupIndex] = groupMessages;
        this.setGroupsMessages(allGroupMessages);
        if (groupMessages.id === this.selectedGroupMessages.id) {
            this.selectGroup(groupMessages);
        }
        // console.log(this.groupsMessages)


    }

    changeGroupMessages(group_id, messages) {
        const groupMessages = this.groupsMessages.find(um => um.id === group_id);
        if (groupMessages) {
            groupMessages.group_messages = messages;
            this.changeGroup(groupMessages)
        }
    }


    setAddGroupFormValue(value) {
        this.addGroupFormValue$.next(value);
    }

    get addGroupFormValue() {
        return this.addGroupFormValue$.asObservable();
    }

}
