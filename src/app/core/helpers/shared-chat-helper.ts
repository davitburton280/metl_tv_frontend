import {Injectable} from '@angular/core';
import {GetElegantDatePipe} from '@shared/pipes/get-elegant-date.pipe';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';

@Injectable({
    providedIn: 'root'
})

export class SharedChatHelper {
    authUser;

    constructor(
        private getElegantDate: GetElegantDatePipe,
        private getAuthUser: GetAuthUserPipe
    ) {
        this.authUser = this.getAuthUser.transform();
    }

    getSeenTooltip(user, message) {

        const seenDate = this.getElegantDate.transform(message.seen_at);
        return `${user.first_name} ${user.last_name} at ${seenDate}`;
    }

    identifyDateKey(index, item) {
        return item.key;
    }

    scrollMsgsToBottom(messagesList) {
        try {
            messagesList.nativeElement.scrollTop = messagesList.nativeElement.scrollHeight;
        } catch (err) {
            console.log(err);
        }
    }

    getMessageClass(from_id) {
        return from_id === this.authUser.id ? 'my-message' : 'other-message';
    }

    isLastMsgOwn(messages) {
        if (messages) {

            const lastMessage = messages[messages.length - 1];
            const owned = lastMessage?.from_id === this.authUser.id;
            return {owned, lastMessage};
        } else {
            return {owned: false, lastMessage: null};
        }
    }
}
