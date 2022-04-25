import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'countTotals'
})
export class CountPurchasedTransferredTotalsPipe implements PipeTransform {

    transform(dt: any) {
        const totals = {purchases: {coins: 0, dollars: 0}, transfers: {coins: 0, dollars: 0}};
        const keys = ['purchases', 'transfers'];
        keys.map(key => {
            dt.filter(t => t.transfer_group === key).map(d => {
                if (d.status === 'succeeded') {
                    totals[key].coins += (d.amount / (100 * 0.0199));
                    totals[key].dollars += d.amount / 100;
                }
            });
        });
        return totals;
    }

}
