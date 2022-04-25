import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'dateFromNow'
})
export class DateFromNowPipe implements PipeTransform {

    transform(datetime): unknown {
        let fromNow = moment(datetime).fromNow();
        // console.log(moment().format('HH:mm:ss'), datetime + '=>' + moment(datetime).format('HH:mm:ss'), fromNow)
        if (fromNow === 'a day ago') {
            fromNow = '1 day ago';
        } else if (fromNow === 'a month ago') {
            fromNow = '1 month ago';
        } else if (fromNow === 'a year ago') {
            fromNow = '1 year ago';
        }

        return fromNow;
    }

}
