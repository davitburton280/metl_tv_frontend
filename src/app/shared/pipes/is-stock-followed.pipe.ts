import {Pipe, PipeTransform} from '@angular/core';
import {Stock} from '@shared/models/stock';

@Pipe({
    name: 'isStockFollowed'
})
export class IsStockFollowedPipe implements PipeTransform {

    transform(passedStocks: Stock[], stock: Stock): boolean {
        return !!passedStocks.find(s => s.name === stock.name);
    }

}
