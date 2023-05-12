import { Pipe, PipeTransform } from '@angular/core';
import { upperCaseFirst } from 'change-case';


@Pipe({
  name: 'capitalize'
})
export class CapitalizePipe implements PipeTransform {
  transform(input: string): string {
    return upperCaseFirst(input);
  }
}
