import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {sortTableData} from '@core/helpers/sort-table-data-by-column';

@Injectable({
    providedIn: 'root'
})
export class NotificationsSubjectStoreService {
    protected allNotificationsSource = new BehaviorSubject([]);
    protected unreadNotificationsSource = new BehaviorSubject([]);

    allNotifications$ = this.allNotificationsSource.asObservable();
    unreadNotifications$ = this.unreadNotificationsSource.asObservable();

    constructor() {
    }

    setInitialNotifications(notifications: any) {
        const sortedNotifications = sortTableData(notifications, 'created_at', 'desc');
        this.allNotificationsSource.next([...sortedNotifications]);
    }

    setAllNotifications(notifications) {
        this.allNotificationsSource.next([...notifications]);
    }

    updateNotifications(notification) {

        let allNotifications = [...this.allNotifications];
        // const selectedGroupIndex = allNotifications.findIndex(gm => gm.id === notification.id);
        // console.log(allNotifications, selectedGroupIndex)
        //
        // allNotifications[selectedGroupIndex] = notification;
        // console.log(allNotifications)

        allNotifications.unshift(notification);
        allNotifications = sortTableData(allNotifications, 'created_at', 'desc');
        this.allNotificationsSource.next([...allNotifications]);
    }

    get allNotifications() {
        return this.allNotificationsSource.getValue();
    }

    setUnreadNotifications(messages: any) {
        this.allNotificationsSource.next([...messages]);
    }

    get unreadNotifications() {
        return this.unreadNotificationsSource.getValue();
    }
}
