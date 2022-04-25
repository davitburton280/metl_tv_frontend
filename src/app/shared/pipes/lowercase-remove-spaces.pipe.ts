import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lowercaseRemoveSpaces'
})
export class LowercaseRemoveSpacesPipe implements PipeTransform {

    transform(str: string, tab = null): string {
        if (str) {
            str = str.toLowerCase().replace(/ /g, '_').trim() || '';
            return str;
        } else {
            return '';
        }
    }

}
