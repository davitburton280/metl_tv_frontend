import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UsersMessagesSubjectService {

    protected usersMessagesSource = new BehaviorSubject([]);
    protected selectedUserMessagesSource = new BehaviorSubject({});

    usersMessages$ = this.usersMessagesSource.asObservable();
    selectedUserMessages$ = this.selectedUserMessagesSource.asObservable();

    showBottomChatBox = false;
    showResponsiveChatBox = false;

    constructor() {
    }

    setUserMessages(messages: any) {
        this.usersMessagesSource.next([...messages]);
    }

    changeUser(userMessages: any) {
        this.selectedUserMessagesSource.next(userMessages);
    }

    get usersMessages() {
        return this.usersMessagesSource.getValue();
    }

    get selectedUserMessages() {
        return this.selectedUserMessagesSource.getValue() as any;
    }

    changeUserMessages(userMessages) {
        const allUsersMessages = [...this.usersMessages];
        const selectedUserIndex = allUsersMessages.findIndex(gm => gm.id === userMessages.id);


        allUsersMessages[selectedUserIndex] = userMessages;
        this.setUserMessages(allUsersMessages);
        // console.log(userMessages.id, this.selectedUserMessages.id)
        if (userMessages.id === this.selectedUserMessages.id) {
            this.changeUser(userMessages);
            // console.log(this.selectedUserMessages)
            // console.log(this.userMessages)
        }
    }

    changeOneUserMessages(id, messages) {
        // console.log(id, messages)
        // console.log(this.userMessages)
        const userMessages = this.usersMessages.find(um => um.id === id);
        // console.log(userMessages)
        if (userMessages && id && messages) {
            userMessages.direct_messages = messages;
            // this.changeUser(userMessages);
        }
    }
}
