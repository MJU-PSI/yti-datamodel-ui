// import { IPromise } from 'angular';
// import { IModalService } from 'angular-ui-bootstrap';
// import { Class } from '../../entities/class';
// import { Model } from '../../entities/model';
// import { ExternalEntity } from '../../entities/externalEntity';

// export class ShowClassInfoModal {

//   constructor(private $uibModal: IModalService) {
//     'ngInject';
//   }

//   open(model: Model, selection: Class | ExternalEntity): IPromise<void> {
//     return this.$uibModal.open({
//       template: require('./showClassInfoModal.html'),
//       size: 'lg',
//       controllerAs: '$ctrl',
//       controller: ShowClassInfoModalController,
//       backdrop: true,
//       resolve: {
//         model: () => model,
//         selection: () => selection
//       }
//     }).result;
//   }
// };

// class ShowClassInfoModalController {

//   constructor(public model: Model,
//               public selection: Class | ExternalEntity) {
//     'ngInject';
//   }
// }


import { Injectable  } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ShowClassInfoModal  {

}
