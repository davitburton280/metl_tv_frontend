import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'applyDiscount'
})
export class ApplyDiscountToPricePipe implements PipeTransform {

    transform(value: number, discount: number): number {
        return discount ? value - (discount / 100 * value) : value;
    }

}
