import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'getDateText'
})
export class GetDateTextForMessagesPipe implements PipeTransform {

  transform(dateCreated: any, ...args: unknown[]): any {
        const today = moment();
        const yesterday = moment().subtract(1, 'day');
        const passedDate = moment(dateCreated, 'dddd, MMMM Do');

        if (passedDate.isSame(today, 'day')) {
            return 'Today';
        } else if (passedDate.isSame(yesterday, 'day')) {
            return 'Yesterday';
        }

        return dateCreated;
    }

}
