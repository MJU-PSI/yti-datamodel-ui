// import { IScope } from 'angular';
// import { ReferenceDataService } from 'app/services/referenceDataService';
// import { ViewReferenceDataModal } from './viewReferenceDataModal';
// import { ReferenceData, ReferenceDataCode } from 'app/entities/referenceData';
// import { LanguageContext } from 'app/types/language';
// import { LegacyComponent } from 'app/utils/angular';
// import { UserService } from 'app/services/userService';

// @LegacyComponent({
//   bindings: {
//     referenceData: '=',
//     context: '=',
//     title: '@',
//     showCodes: '='
//   },
//   template: require('./referenceDataView.html')
// })
// export class ReferenceDataViewComponent {

//   referenceData: ReferenceData;
//   context: LanguageContext;
//   title: string;
//   showCodes: boolean;
//   codes: ReferenceDataCode[] | null;
//   isLoggedIn: boolean;

//   constructor(private $scope: IScope,
//               private referenceDataService: ReferenceDataService,
//               private viewReferenceDataModal: ViewReferenceDataModal,
//               private userService: UserService) {
//     'ngInject';

//     this.isLoggedIn = userService.isLoggedIn();
//   }

//   $onInit() {
//     this.$scope.$watch(() => this.referenceData, referenceData => {
//       if (referenceData && !referenceData.isExternal()) {
//         this.referenceDataService.getReferenceDataCodes(referenceData)
//           .then(values => this.codes = values);
//       } else {
//         this.codes = [];
//       }
//     });
//   }

//   update() {
//     if (this.referenceData && !this.referenceData.isExternal()) {
//       this.codes = null;
//       this.referenceDataService.getReferenceDataCodes(this.referenceData, true)
//         .then(values => this.codes = values);
//     }
//   }

//   browse() {
//     if (this.referenceData.isExternal()) {
//       window.open(this.referenceData.id.uri, '_blank');
//     } else {
//       this.viewReferenceDataModal.open(this.referenceData, this.context);
//     }
//   }
// }

import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ReferenceDataService } from 'app/services/referenceDataService';
import { ViewReferenceDataModal } from './viewReferenceDataModal';
import { ReferenceData, ReferenceDataCode } from 'app/entities/referenceData';
import { LanguageContext } from 'app/types/language';
import { UserService } from '@mju-psi/yti-common-ui';

@Component({
  selector: 'reference-data-view',
  templateUrl: './referenceDataView.html'
})
export class ReferenceDataViewComponent implements OnInit {
  @Input() referenceData: ReferenceData;
  @Input() context: LanguageContext;
  @Input() title: string;
  @Input() showCodes: boolean;

  codes: ReferenceDataCode[] | null;
  isLoggedIn: boolean;

  constructor(
    private referenceDataService: ReferenceDataService,
    private viewReferenceDataModal: ViewReferenceDataModal,
    private userService: UserService
  ) {
    this.isLoggedIn = this.userService.isLoggedIn();
  }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges){
    if(changes.referenceData.currentValue) {
      const referenceData = changes.referenceData.currentValue;
      if (!referenceData.isExternal()) {
        this.referenceDataService
          .getReferenceDataCodes(referenceData)
          .then(values => (this.codes = values));
      } else {
        this.codes = [];
      }
    }

  }

  update() {
    if (this.referenceData && !this.referenceData.isExternal()) {
      this.codes = null;
      this.referenceDataService
        .getReferenceDataCodes(this.referenceData, true)
        .then(values => (this.codes = values));
    }
  }

  browse() {
    if (this.referenceData.isExternal()) {
      window.open(this.referenceData.id.uri, '_blank');
    } else {
      this.viewReferenceDataModal.open(this.referenceData, this.context);
    }
  }
}
