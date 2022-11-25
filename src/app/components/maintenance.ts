import { ILogService } from 'angular';
import { identity } from '@vrk-yti/yti-common-ui';
import { modalCancelHandler } from 'app/utils/angular';
import { IModalService } from 'angular-ui-bootstrap';

export class MaintenanceModal {

  constructor(private $uibModal: IModalService, private $log: ILogService) {
    'ngInject';
  }

  open(err: any) {

    this.$log.debug(err);

    return this.$uibModal.open({
      template: require('./maintenance.html'),
      size: 'lg',
      backdrop: 'static'
    }).result.then(identity, modalCancelHandler);
  }
}
