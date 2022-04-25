import {Pipe, PipeTransform} from '@angular/core';
import {COIN_WORTH} from '@core/constants/global';

@Pipe({
    name: 'convertToCurrency'
})
export class ConvertToCurrencyPipe implements PipeTransform {

    transform(value: number, currency = 'dollars') {
        if (currency === 'dollars') {
            return COIN_WORTH * value;
        }
    }

}
