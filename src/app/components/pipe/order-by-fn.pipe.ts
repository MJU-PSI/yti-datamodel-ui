import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
    name: 'orderByFn',
    pure: false
})
export class OrderByFnPipe implements PipeTransform {
    transform(values: any[], callback: (value: any, value1: any) => number): any {
        if (!values || !callback) {
            return values;
        }
        return values.sort((value, value1) => callback(value, value1));
    }
}
