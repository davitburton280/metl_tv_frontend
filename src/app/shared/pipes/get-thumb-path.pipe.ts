import {Pipe, PipeTransform} from '@angular/core';
import {
    API_URL, GROUP_DEFAULT_AVATARS_PATH, USER_DEFAULT_AVATARS_PATH,
    VIDEO_DEFAULT_AVATARS_PATH,
    VIDEO_DEFAULT_COVERS_PATH,
    VIDEO_DEFAULT_THUMBNAILS_PATH
} from '@core/constants/global';
import {DomSanitizer, SafeStyle} from '@angular/platform-browser';

@Pipe({
    name: 'getImgPath'
})
export class GetThumbPathPipe implements PipeTransform {

    constructor(
        private sanitizer: DomSanitizer,
    ) {

    }

    transform(img, folder = 'thumbnails', extra = null): string | SafeStyle {

        const url = img ? `${API_URL}uploads/${folder}/${img}` : this.getDefaultPaths(folder);

        if (extra === 'background') {
            // let url = 'url("' + UPLOADS_FOLDER + folder + '/' + name + '")';
            return this.sanitizer.bypassSecurityTrustStyle(`url("${url}"`);
        } else if (extra === 'url') {
            return this.sanitizer.bypassSecurityTrustUrl(url);
        }

        return img ? `${API_URL}uploads/${folder}/${img}` : this.getDefaultPaths(folder);
    }

    getDefaultPaths(folder) {
        let p = '';
        switch (folder) {
            case 'thumbnails':
                p = VIDEO_DEFAULT_THUMBNAILS_PATH;
                break;
            case 'avatars':
                p = VIDEO_DEFAULT_AVATARS_PATH;
                break;
            case 'user_avatars':
                p = USER_DEFAULT_AVATARS_PATH;
                break;
            case 'group_avatars':
                p = GROUP_DEFAULT_AVATARS_PATH;
                break;
            case 'covers':
            case 'group_covers':
            case 'post_covers':
                p = VIDEO_DEFAULT_COVERS_PATH;
        }

        return p;

    }

}
