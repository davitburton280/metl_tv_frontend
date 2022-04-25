import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
    selector: 'app-add-video',
    templateUrl: './add-video.component.html',
    styleUrls: ['./add-video.component.scss']
})
export class AddVideoComponent implements OnInit {
    url;
    safeUrl;
    isValidUrl = false;

    constructor(
        private sanitizer: DomSanitizer
    ) {
    }

    ngOnInit(): void {
    }

    getUrl(e: ClipboardEvent) {
        const clipboardData = e.clipboardData;
        const pastedText = clipboardData.getData('text');
        this.url = pastedText;
        this.constructSafeUrl(pastedText);
        console.log(pastedText);

    }

    checkUrl(e) {
        let text = e.target.value;
        this.url = text;
        console.log(this.isTikTokVideo(text))
        if (this.isYoutubeVideo(text)) {
            text = this.transformUrlForYoutube(text);
            this.constructSafeUrl(text);
        } else {
            // this.isValidUrl = false;
            this.constructSafeUrl(text);
        }
    }

    isYoutubeVideo(url) {
        const p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
        if (url.match(p)) {
            return url.match(p)[1];
        }
        return false;
    }

    isTikTokVideo(url) {
        // const p = /^(https?:\/\/(?:(?:www|m)\.(?:tiktok.com)\/(?:v|embed|trending)(?:\/)?(?:\?shareId=)?)(?<id>[\da-z]+))?$/;
        const p = /https?:\/\/(?:(?:www|m)\.(?:tiktok.com)\/(?:v|embed|trending)(?:\/)?(?:\?shareId=)?)(?<id>[\da-z]+)/;

        console.log('aaa', url, url.match(p)[1])
        if (url.match(p)) {
            return !!url.match(p)[1];
        }
        return false;
    }

    transformUrlForYoutube(url) {
        const youTubeIdFromLink = (u) => u.match(/(?:https?:\/\/)?(?:www\.|m\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\/?\?v=|\/embed\/|\/)([^\s&\?\/\#]+)/)[1];
        const youTubeId = youTubeIdFromLink(url);
        return url.split('&')[0].replace('/watch?v=', '/embed/');
    }

    constructSafeUrl(text) {
        if (this.isYoutubeVideo(text)) {
            this.isValidUrl = true;
            text = this.transformUrlForYoutube(text);
        }
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(text);
    }

}
