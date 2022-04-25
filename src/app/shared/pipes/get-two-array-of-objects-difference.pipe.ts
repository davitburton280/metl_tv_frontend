import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'getArraysDifference'
})
export class GetTwoArrayOfObjectsDifferencePipe implements PipeTransform {

    transform(arrayOne: any[], arrayTwo: any[]): any[] {
        return arrayOne.filter(({id: id1, ...restOne}) => {
            return !arrayTwo.some(({id: id2, ...restTwo}) => {
                return id2 === id1;
            });
        });
    }

}
