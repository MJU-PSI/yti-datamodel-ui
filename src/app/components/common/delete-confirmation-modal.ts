// import { IPromise } from 'angular';
// import { IModalService } from 'angular-ui-bootstrap';
// import { UsageService } from 'app/services/usageService';
// import { anyMatching, isDefined } from '@mju-psi/yti-common-ui';
// import { LanguageContext } from 'app/types/language';
// import { EditableEntity } from 'app/types/entity';
// import { Model } from 'app/entities/model';
// import { Usage, Referrer } from 'app/entities/usage';

// export class DeleteConfirmationModal {

//   constructor(private $uibModal: IModalService) {
//     'ngInject';
//   }

//   open(entity: EditableEntity, context: LanguageContext, onlyInDefinedModel: Model|null = null): IPromise<void> {
//     return this.$uibModal.open({
//       template: require('./deleteConfirmationModal.html'),
//       size: 'adapting',
//       controllerAs: '$ctrl',
//       controller: DeleteConfirmationModalController,
//       resolve: {
//         entity: () => entity,
//         context: () => context,
//         onlyInDefinedModel: () => onlyInDefinedModel
//       }
//     }).result;
//   }
// };

// class DeleteConfirmationModalController {

//   usage: Usage;
//   hasReferrers: boolean;

//   exclude = (referrer: Referrer) => {
//     return isDefined(this.onlyInDefinedModel) && (referrer.isOfType('model')
//        || !isDefined(referrer.definedBy) || referrer.definedBy.id.notEquals(this.onlyInDefinedModel.id));
//   };

//   constructor(public entity: EditableEntity, public context: LanguageContext, private onlyInDefinedModel: Model|null, usageService: UsageService) {
//     'ngInject';
//     usageService.getUsage(entity).then(usage => {
//       this.usage = usage;
//       this.hasReferrers = usage && anyMatching(usage.referrers, referrer => !this.exclude(referrer));
//     });
//   }
// }

import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Component, Inject, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UsageService } from 'app/services/usageService';
import { anyMatching, isDefined } from '@mju-psi/yti-common-ui';
import { LanguageContext } from 'app/types/language';
import { EditableEntity } from 'app/types/entity';
import { Model } from 'app/entities/model';
import { Usage, Referrer } from 'app/entities/usage';


@Injectable({
  providedIn: 'root'
})
export class DeleteConfirmationModal {

  constructor(private modalService: NgbModal) {}

  open(entity: EditableEntity, context: LanguageContext, onlyInDefinedModel: Model|null = null): Promise<void> {
    return this.modalService.open(DeleteConfirmationModalComponent, {
      size: 'adapting',
      centered: true,
      windowClass: 'confirm-modal',
      backdrop: 'static',
      keyboard: false
    }).componentInstance.open(entity, context, onlyInDefinedModel);
  }
}

@Component({
  selector: 'delete-confirmation-modal',
  templateUrl: './delete-confirmation-modal.html',
})
export class DeleteConfirmationModalComponent implements OnInit {

  entity: EditableEntity;
  context: LanguageContext;
  onlyInDefinedModel: Model | null;
  usage: Usage;
  hasReferrers = false;

  constructor(
    public activeModal: NgbActiveModal,
    private usageService: UsageService,
    @Inject('entity') entity: EditableEntity,
    @Inject('context') context: LanguageContext,
    @Inject('onlyInDefinedModel') onlyInDefinedModel: Model | null
  ) {
    this.entity = entity;
    this.context = context;
    this.onlyInDefinedModel = onlyInDefinedModel;
  }

  ngOnInit() {
    this.usageService.getUsage(this.entity).then((usage) => {
      this.usage = usage;
      this.hasReferrers =
        usage &&
        anyMatching(usage.referrers, (referrer) => !this.exclude(referrer));
    });
  }

  exclude = (referrer: Referrer) => {
    return (
      isDefined(this.onlyInDefinedModel) &&
      (referrer.isOfType('model') ||
        !isDefined(referrer.definedBy) ||
        referrer.definedBy.id.notEquals(this.onlyInDefinedModel.id))
    );
  };

  close() {
    this.activeModal.close();
  }

  dismiss() {
    this.activeModal.dismiss('cancel');
  }
}

