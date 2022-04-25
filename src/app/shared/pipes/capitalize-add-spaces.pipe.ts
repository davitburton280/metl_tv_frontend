import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'capitalizeAddSpaces'
})
export class CapitalizeAddSpacesPipe implements PipeTransform {

    transform(col: string, tab = null): string {
        if (col) {
            col = `${col?.[0]?.toUpperCase()}${col.slice(1)}`.replace(/([A-Z])/g, ' $1').trim() || '';
            return col.replace(/_/g, ' ');
        } else {
            return '';
        }
    }

}
