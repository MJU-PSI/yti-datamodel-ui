import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
    name: 'filterFn',
    pure: false
})
export class FilterFnPipe implements PipeTransform {
    transform(values: any[], callback: (value: any) => boolean): any {
        if (!Array.isArray(values) || !callback) {
            return values;
        }
        return values.filter(value => callback(value));
    }
}
