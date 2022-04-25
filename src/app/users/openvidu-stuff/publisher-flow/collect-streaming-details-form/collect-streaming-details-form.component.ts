import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {API_URL, DESCRIPTION_CHARACTERS_LIMIT} from '@core/constants/global';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {VideoService} from '@core/services/video.service';
import {ToastrService} from 'ngx-toastr';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {MatChipInputEvent, MatChipList} from '@angular/material/chips';
import {LoaderService} from '@core/services/loader.service';
import {Observable} from 'rxjs';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';

@Component({
    selector: 'app-stream-details-form',
    templateUrl: './collect-streaming-details-form.component.html',
    styleUrls: ['./collect-streaming-details-form.component.scss']
})
export class CollectStreamingDetailsFormComponent implements OnInit {

    startStreamingForm: FormGroup;
    isSubmitted = false;
    thumbnailFile;
    thumbnailUploading = false;
    thumbnailUploaded = false;
    apiUrl = API_URL;
    tags = [];
    videoCategories;
    authUser;

    sessionName = 'SessionA';
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    privacyTypes = [{name: 'Public', icon: 'public'}, {name: 'Private', icon: 'lock'}];
    selectedPrivacy;

    savedTags = [];

    @ViewChild('chipsInput') chipsInput: ElementRef<HTMLInputElement>;
    @ViewChild('tagList') tagList: MatChipList;
    @Output('formReady') formReady = new EventEmitter();

    constructor(
        private videoService: VideoService,
        private toastr: ToastrService,
        private fb: FormBuilder,
        private getAuthUser: GetAuthUserPipe,
        public loader: LoaderService
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
        this.selectedPrivacy = this.privacyTypes[0];
        this.initForm();
        this.getVideoCategories();
        // this.getVideoTags();

        // this.startStreamingForm.get('tags').statusChanges.subscribe(
        //     status => this.tagList.errorState = this.tags.length > 3
        // );
    }

    initForm(): void {
        this.startStreamingForm = this.fb.group({
            name: ['', Validators.required],
            description: ['', [Validators.required, Validators.maxLength(DESCRIPTION_CHARACTERS_LIMIT)]],
            category_id: ['', Validators.required],
            tags: [[], Validators.required],
            sessionName: [this.sessionName],
            myUserName: [this.authUser.username],
            thumbnail: ['', Validators.required],
            privacy: ['Public'],
            status: ['live']
        });
    }

    getVideoCategories() {
        this.videoService.getVideoCategories().subscribe(dt => {
            this.videoCategories = dt;
        });
    }

    getVideoTags() {
        this.videoService.getVideoTags().subscribe(dt => {
            this.savedTags = dt;
        });
    }

    changedPrivacy(e) {
        this.selectedPrivacy = this.privacyTypes.find(t => t.name === e.value);
    }

    autocompleteSelect(e) {
        console.log(e)
    }

    add(event: MatChipInputEvent): void {
        console.log('add')
        const input = event.input;
        const value = event.value;

        if ((value || '').trim()) {
            this.tags.push({name: value.trim()});
            this.startStreamingForm.patchValue({tags: this.tags});
            // console.log(this.tags)
            // console.log(this.startStreamingForm.value)
        }

        // Reset the input value
        if (input) {
            input.value = '';
        }
    }

    remove(fruit): void {
        const index = this.tags.indexOf(fruit);

        if (index >= 0) {
            this.tags.splice(index, 1);
            this.startStreamingForm.patchValue({tags: this.tags});
        }
    }

    getThumbnailFile(e) {
        this.thumbnailFile = e.target.files[0];
        const fd = new FormData();
        fd.append('video_thumbnail_file', this.thumbnailFile);
        this.startStreamingForm.patchValue({thumbnail: this.thumbnailFile.name});
        this.thumbnailUploading = true;
        this.loader.fileProcessing = true;

        this.videoService.saveVideoThumbnail(fd).subscribe(filename => {
            this.toastr.success('The thumbnail has been uploaded successfully');
            this.thumbnailUploading = false;
            this.thumbnailUploaded = true;
            this.loader.fileProcessing = false;
        });
    }

    removeUploadedThumbnail(filename) {
        // this.videoService.removeVideoThumbnail(filename).subscribe(dt => {
        this.thumbnailFile = [];
        this.toastr.success('The thumbnail has been removed successfully');
        this.thumbnailUploaded = false;
        this.startStreamingForm.patchValue({thumbnail: ''});
        // });
    }

    submit() {
        this.isSubmitted = true;
        if (this.startStreamingForm.valid && this.tags.length <= 3) {
            this.formReady.emit({
                categoryName: this.videoCategories.find(c => c.id === +this.startStreamingForm.value.category_id)?.name,
                ...this.startStreamingForm.value
            });
        }
    }


    get streamName(): AbstractControl {
        return this.startStreamingForm.get('name');
    }


    get streamDesc(): AbstractControl {
        return this.startStreamingForm.get('description');
    }

    get streamCategory(): AbstractControl {
        return this.startStreamingForm.get('category_id');
    }

    get streamTags(): AbstractControl {
        return this.startStreamingForm.get('tags');
    }

    autoCompleteTagsSelected(event: MatAutocompleteSelectedEvent): void {
        this.tags.push({name: event.option.viewValue});
        this.startStreamingForm.patchValue({tags: this.tags});
    }
}
