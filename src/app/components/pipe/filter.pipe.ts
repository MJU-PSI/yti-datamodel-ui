import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(values: any[], filterFn: (value: any) => boolean): any[] {
    if (!Array.isArray(values) || !filterFn) {
      return values;
    }

    return values.filter(filterFn);
  }
}
