import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Moment } from 'moment';

@Pipe({
  name: 'localizedDate'
})
export class LocalizedDatePipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(moment: Moment): string {
    if (moment) {
      return moment.format(this.translate.instant('date format'));
    } else {
      return "";
    }
  }
}
