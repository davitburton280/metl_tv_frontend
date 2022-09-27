import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-about-channel',
    templateUrl: 'about-channel.component.html',
    styleUrls: ['about-channel.component.scss']
})

export class AboutChannelComponent implements OnInit, OnDestroy {
    public updateDescGroup: FormGroup | undefined;
    public show = false;

    constructor(
        private _fb: FormBuilder
    ) {
    }

    ngOnInit() {
        this._formBuilder();
    }

    private _formBuilder() {
        this.updateDescGroup = this._fb.group({
            desc: [null, Validators.required]
        });
    }

    public showForm() {
        this.show = !this.show;
    }

    ngOnDestroy() {
    }
}
