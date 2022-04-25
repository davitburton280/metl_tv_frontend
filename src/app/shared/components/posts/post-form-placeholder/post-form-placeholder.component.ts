import {Component, Input, OnInit} from '@angular/core';
import {UserStoreService} from '@core/services/stores/user-store.service';

@Component({
    selector: 'app-post-form-placeholder',
    templateUrl: './post-form-placeholder.component.html',
    styleUrls: ['./post-form-placeholder.component.scss']
})
export class PostFormPlaceholderComponent implements OnInit {
    @Input() selectedGroup;

    constructor(
        public userStore: UserStoreService
    ) {
    }

    ngOnInit(): void {
    }

}
