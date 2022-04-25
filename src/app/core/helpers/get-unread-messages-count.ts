import {UsersMessagesSubjectService} from '@core/services/stores/users-messages-subject.service';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})

export class UnreadMessagesCounter {
    constructor(
        private usersMessagesStore: UsersMessagesSubjectService,
        private groupsMessagesStore: GroupsMessagesSubjectService,
    ) {

    }

    getUnreadMessagesCount(authUser) {
        let directMessages = 0;
        let groupMessages = 0;
        if (authUser) {
            directMessages = this.usersMessagesStore.usersMessages
                ?.filter(m => m.direct_messages
                    ?.filter(d => !d.seen && d.from_id !== authUser.id).length > 0).length;

            groupMessages = this.groupsMessagesStore.groupsMessages
                ?.filter(m => {
                    return m.group_messages
                        ?.find(message => {
                            let found = false;
                            if (message.from_id !== authUser.id) {
                                found = !message.seen.find(sb => sb.seen_by.id === authUser.id);
                            }
                            return found;
                        });
                }).length;
        }

        return directMessages + groupMessages;
    }
}
