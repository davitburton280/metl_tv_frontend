import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'groupBy'
})
export class GroupByPipe implements PipeTransform {
    transform(collection: any[], property: string): any[] {
        // prevents the application from breaking if the array of objects doesn't exist yet
        if (!collection) {
            return null;
        }

        const groupedCollection = collection.reduce((previous, current) => {
            let key = current[property];
            if (property === 'created_at') {
                key = moment(current[property]).format('dddd, MMMM Do');
            }
            if (!previous[key]) {
                previous[key] = [current];
            } else {
                previous[key].push(current);
            }

            return previous;
        }, {});

        // this will return an array of objects, each object containing a group of objects
        return Object.keys(groupedCollection).map(key => ({key, value: groupedCollection[key]}));
    }
}
