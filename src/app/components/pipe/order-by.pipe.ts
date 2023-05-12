import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

  transform(values: any[], property: string): any[] {
    return values.sort((a, b) => a[property] > b[property] ? 1 : -1);
  }

}
