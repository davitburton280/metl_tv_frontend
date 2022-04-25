import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {ToastrService} from 'ngx-toastr';
import {API_URL, TAG_CHARACTERS_LIMIT} from '@core/constants/global';
import {DROPZONE_CONFIG} from 'ngx-dropzone-wrapper';

@Component({
    selector: 'app-video-details-form',
    templateUrl: './video-details-form.component.html',
    styleUrls: ['./video-details-form.component.scss']
})
export class VideoDetailsFormComponent implements OnInit {
    @Input('videoData') videoData;
    @Output('formReady') formReady = new EventEmitter();
    videoDetailsForm: FormGroup;

    isSubmitted = false;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    apiUrl = API_URL;

    thumbnailFile;

    dropzoneConfig = DROPZONE_CONFIG;

    constructor(
        private fb: FormBuilder,
        private toastr: ToastrService
    ) {
        this.videoDetailsForm = this.fb.group({
            name: ['', [Validators.required, Validators.maxLength(TAG_CHARACTERS_LIMIT)]],
            tags: [[], Validators.required],
            thumbnail: [''],
            video_id: []
        });
    }

    ngOnInit(): void {
        this.videoDetailsForm.patchValue({
            video_id: this.videoData.id,
            ...this.videoData
        });
    }

    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        if ((value || '').trim()) {
            if (this.videoData.tags.length === 3) {
                this.toastr.error('We don\'t support more than 3 tags per video');
            } else {
                this.videoData.tags.push({name: value.trim()});
                this.videoDetailsForm.patchValue({tags: this.videoData.tags});
            }

            // this.saveTags();
        }

        // Reset the input value
        if (input) {
            input.value = '';
        }
    }

    remove(tag): void {
        const index = this.videoData.tags.indexOf(tag);

        if (index >= 0) {
            this.videoData.tags.splice(index, 1);
            this.videoDetailsForm.patchValue({tags: this.videoData.tags});
        }
    }

    removeThumbnail() {
        this.videoDetailsForm.patchValue({thumbnail: ''});
        this.videoData.thumbnail = '';
    }

    changeThumbnail(e) {
        this.thumbnailFile = e.target.files[0];
        this.videoDetailsForm.patchValue({thumbnail: this.thumbnailFile.name});
    }

    saveDetails() {
        this.videoDetailsForm.patchValue({tags: this.videoData.tags});
        this.isSubmitted = true;
        if (this.videoDetailsForm.valid) {
            const formData = new FormData();
            for (const field in this.videoDetailsForm.value) {
                if (field !== 'tags') {
                    formData.append(field, this.videoDetailsForm.value[field]);
                } else {
                    formData.append(field, JSON.stringify(this.videoDetailsForm.value[field]));
                }
            }
            if (this.thumbnailFile) {
                formData.append('video_thumbnail_file', this.thumbnailFile, this.thumbnailFile.name);
            }
            this.formReady.emit(formData);
        }
    }

    removeImage() {

    }

    onAddedFile(e) {
        this.thumbnailFile = e[0];
        this.videoDetailsForm.patchValue({thumbnail: this.thumbnailFile.name});
    }

}
