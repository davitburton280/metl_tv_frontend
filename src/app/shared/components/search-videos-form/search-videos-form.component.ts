import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivationEnd, NavigationEnd, Router} from '@angular/router';

@Component({
    selector: 'app-search-videos-form',
    templateUrl: './search-videos-form.component.html',
    styleUrls: ['./search-videos-form.component.scss']
})
export class SearchVideosFormComponent implements OnInit {
    searchVideosForm: FormGroup;
    passedSearch;
    @Output('search') search = new EventEmitter();

    constructor(
        private fb: FormBuilder,
        public router: Router
    ) {


    }

    ngOnInit(): void {
        this.searchVideosForm = this.fb.group({search: ['', Validators.required]});
        this.router.events.subscribe((val) => {
            if (val instanceof ActivationEnd) {
                this.passedSearch = val.snapshot.queryParams?.search || localStorage.getItem('search');
                this.searchVideosForm.patchValue({search: this.passedSearch});
            }

        });

    }


    searchVideos() {
        // this.subject.setVideosSearch(this.searchVideosForm.value);
        this.search.emit(this.searchVideosForm.value);
    }

}
