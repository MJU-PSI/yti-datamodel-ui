import { IPromise, ui } from 'angular';
import IModalService = ui.bootstrap.IModalService;
import { UsageService } from '../../services/usageService';
import { anyMatching } from 'yti-common-ui/utils/array';
import { isDefined } from 'yti-common-ui/utils/object';
import { LanguageContext } from '../../types/language';
import { EditableEntity } from '../../types/entity';
import { Model } from '../../entities/model';
import { Usage, Referrer } from '../../entities/usage';

export class DeleteConfirmationModal {
  /* @ngInject */
  constructor(private $uibModal: IModalService) {
  }

  open(entity: EditableEntity, context: LanguageContext, onlyInDefinedModel: Model|null = null): IPromise<void> {
    return this.$uibModal.open({
      template: require('./deleteConfirmationModal.html'),
      size: 'adapting',
      controllerAs: 'ctrl',
      controller: DeleteConfirmationModalController,
      resolve: {
        entity: () => entity,
        context: () => context,
        onlyInDefinedModel: () => onlyInDefinedModel
      }
    }).result;
  }
};

class DeleteConfirmationModalController {

  usage: Usage;
  hasReferrers: boolean;

  exclude = (referrer: Referrer) => {
    return isDefined(this.onlyInDefinedModel) && (referrer.isOfType('model')
       || !isDefined(referrer.definedBy) || referrer.definedBy.id.notEquals(this.onlyInDefinedModel.id));
  };

  /* @ngInject */
  constructor(public entity: EditableEntity, public context: LanguageContext, private onlyInDefinedModel: Model|null, usageService: UsageService) {
    usageService.getUsage(entity).then(usage => {
      this.usage = usage;
      this.hasReferrers = usage && anyMatching(usage.referrers, referrer => !this.exclude(referrer));
    });
  }
}
