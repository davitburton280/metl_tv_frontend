import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'getFileBaseName'
})
export class GetFileBaseNamePipe implements PipeTransform {

    transform(fullPath: string): string {
        return fullPath.replace(/^.*[\\\/]/, '');
    }

}
