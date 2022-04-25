import {Pipe, PipeTransform} from '@angular/core';
import {ALLOWED_IMG_MIME_TYPES} from '@core/constants/global';

@Pipe({
    name: 'base64ToFile'
})
export class Base64ToFilePipe implements PipeTransform {

    allowedImgMimeTypes = ALLOWED_IMG_MIME_TYPES;


    transform(base64, ...args: unknown[]) {

        const mime = ALLOWED_IMG_MIME_TYPES.find(t => base64.indexOf(t) !== -1);
        console.log(mime);

        const cleanedBase64 = base64.replace(`data:${mime};base64,`, '');


        const bs = atob(cleanedBase64);
        const buffer = new ArrayBuffer(bs.length);
        const ba = new Uint8Array(buffer);
        for (let i = 0; i < bs.length; i++) {
            ba[i] = bs.charCodeAt(i);
        }
        return new Blob([ba], {type: 'image/jpg'});

    }

}
