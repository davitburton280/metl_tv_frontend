import {Pipe, PipeTransform} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {Stock} from '@shared/models/stock';

@Pipe({
    name: 'updateUserStocks'
})
export class UpdateUserStocksPipe implements PipeTransform {

    constructor(
        private toastr: ToastrService
    ) {
    }

    transform(userStocks: Stock[], stock: Stock, isRemoval: boolean): Stock[] | null {


        if (!isRemoval) {

            if (userStocks.length === 25) {
                this.toastr.error('We support not more than 25 stocks per user');
                return null;
            } else {
                userStocks.push({
                    name: stock.name,
                    symbol: stock.symbol,
                    change: stock.change,
                    changesPercentage: stock.changesPercentage,
                    price: stock.price,
                    type_id: stock.type_id
                });
            }


        } else {
            userStocks = userStocks.filter(f => f.name !== stock.name);
        }
        return userStocks;
    }

}
