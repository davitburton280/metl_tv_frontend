import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'filterDevices'
})
export class FilterDevicesPipe implements PipeTransform {

    transform(items: any[], filter: any): any {
        if (!items || !filter) {
            return items;
        }

        const filterKey = Object.keys(filter) || [];

        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        return items.filter(item => item[filterKey[0]].indexOf(filter[filterKey[0]]) !== -1);
    }

}
