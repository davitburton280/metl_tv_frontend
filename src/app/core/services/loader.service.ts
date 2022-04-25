import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoaderService {
    formProcessing = false;
    dataLoading = false;
    fileProcessing = false;
    isLoading = new Subject<boolean>();
    stocksLoading = {status: 'idle', text: ''};
    channelLoading = {status: 'idle'};

    private loaderSource = new BehaviorSubject(false);
    currentLoaderState = this.loaderSource.asObservable();

    constructor() {
    }

    show() {

        this.loaderSource.next(true);
    }

    hide() {

        this.loaderSource.next(false);
    }

}
