import { Component, Injectable } from '@angular/core';
import { ModalService, AlertModalService, ErrorModalService } from '@mju-psi/yti-common-ui';
import { Model } from 'app/entities/model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModelServiceWrapper } from 'app/ajs-upgraded-providers';
import { ModelService } from 'app/services/modelService';
import { TranslateService } from '@ngx-translate/core';
// import { IInjectorService } from '@angular/upgrade/src/common/src/angular1';
import IInjectorService = angular.auto.IInjectorService;


export const rootScopeFactory = (i: IInjectorService) => i.get('$rootScope');

@Component({
  selector: 'app-new-datamodel-version-modal.component',
  templateUrl: './new-datamodel-version-modal.component.html',
  providers: [
    {
      provide: '$scope',
      useFactory: rootScopeFactory,
      deps: ['$injector']
    }
  ]
})
export class NewDatamodelVersionModalComponent {

  model: Model;
  uploading = false;

  private modelService: ModelService;

  constructor(private modal: NgbActiveModal,
              private alertModalService: AlertModalService,
              private errorModalService: ErrorModalService,
              private translateService: TranslateService,
              modelServiceWrapper: ModelServiceWrapper) {
    this.modelService = modelServiceWrapper.modelService;
  }

  get loading(): boolean {
    return this.uploading;
  }

  saveNewVersion(prefix: string) {
    const modalRef = this.alertModalService.open('CREATING_NEW_MODEL_VERSION_MESSAGE');

    this.modelService.createNewModelVersion(prefix, this.model.id.uri).then(newUri => {
      modalRef.message = this.translateService.instant('New version of datamodel is created') +  ': ';
      modalRef.link = newUri;
      modalRef.showOkButton = true;
      this.modal.close(false);
    }, error => {
      this.uploading = false;
      this.errorModalService.openSubmitError(error);
      modalRef.cancel();
    });
  };

  close() {
    this.modal.dismiss('cancel');
  }

}

@Injectable()
export class NewDatamodelVersionModalService {

  constructor(private modalService: ModalService) {
  }

  public open(model: Model): Promise<Model> {
    const modalRef = this.modalService.open(NewDatamodelVersionModalComponent, { size: 'sm', backdrop: 'static', keyboard: false });
    const instance = modalRef.componentInstance as NewDatamodelVersionModalComponent;
    instance.model = model;
    return modalRef.result;
  }
}
