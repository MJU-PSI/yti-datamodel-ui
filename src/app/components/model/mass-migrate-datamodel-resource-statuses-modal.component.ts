import { Component, OnInit, Injectable } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Model } from 'app/entities/model';
import {  } from '@goraresult/yti-common-ui';
import {
  UserService,
  Status,
  selectableStatuses,
  changeToRestrictedStatus,
  allowedTargetStatuses,
  FilterOptions,
  AlertModalService,
  ModalService,
  ErrorModalService,
  ignoreModalClose
} from '@goraresult/yti-common-ui';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ModelService } from 'app/services/modelService';
import { ModelServiceWrapper } from 'app/ajs-upgraded-providers';
import { DatamodelConfirmationModalService } from 'app/services/confirmation-modal.service';

@Component({
  selector: 'app-mass-migrate-datamodel-resource-statuses-modal',
  templateUrl: './mass-migrate-datamodel-resource-statuses-modal.component.html'
})
export class MassMigrateDatamodelResourceStatusesModalComponent implements OnInit {

  fromOptions: FilterOptions<Status>;
  toOptions: FilterOptions<Status>;
  fromStatus$ = new BehaviorSubject<Status | null>(null);
  toStatus$ = new BehaviorSubject<Status | null>(null);
  fromStatusResourcesTotal = 0;
  loadingResourcesTotal = false;
  uploading = false;
  model: Model;
  private modelService: ModelService;

  fromStatuses = ['INCOMPLETE', 'DRAFT', 'VALID', 'SUPERSEDED', 'RETIRED', 'INVALID'] as Status[];
  toStatuses = ['INCOMPLETE', 'DRAFT', 'VALID', 'SUPERSEDED', 'RETIRED', 'INVALID'] as Status[];

  enforceTransitionRulesForSuperUserToo = false;

  constructor(private modal: NgbActiveModal,
              private userService: UserService,
              private translateService: TranslateService,
              private alertModalService: AlertModalService,
              private errorModalService: ErrorModalService,
              private confirmationModal: DatamodelConfirmationModalService,
              modelServiceWrapper: ModelServiceWrapper) {
    this.modelService = modelServiceWrapper.modelService;
  }

  ngOnInit() {
    this.reset();

    this.fromStatus$.subscribe(status => {
      this.loadingResourcesTotal = true;

      if (status) {
        this.modelService.getModelResourcesTotalCountByStatus(this.model, status).then(resourcesTotal => {
          this.fromStatusResourcesTotal = resourcesTotal;
          this.loadingResourcesTotal = false;
        });

      } else {
        this.fromStatusResourcesTotal = 0;
        this.loadingResourcesTotal = false;
      }
    });
  }

  get isSuperUser() {
    return this.userService.user.superuser;
  }

  get loading(): boolean {
    return this.uploading;
  }

  close() {
    this.modal.dismiss('cancel');
  }

  canSave() {
    return this.fromStatusResourcesTotal > 0 && this.toStatus$.value != null && (this.fromStatus$.value !== this.toStatus$.value);
  }

  saveChanges() {
    const save = () => {
      const modalRef = this.alertModalService.open('UPDATING_STATUSES_MESSAGE');

      this.modelService.changeStatuses(this.model, this.fromStatus$.value!, this.toStatus$.value!).then(result => {

        if (this.fromStatusResourcesTotal === 1) {
          modalRef.message = this.translateService.instant('Status changed to one resource.');
        } else {
          const messagePart1 = this.translateService.instant('Status changed to ');
          const messagePart2 = this.translateService.instant(' resources.');

          modalRef.message = messagePart1 + this.fromStatusResourcesTotal + messagePart2;
        }

        modalRef.showOkButton = true;
        this.modal.close(false);
      }, error => {
        this.uploading = false;
        this.errorModalService.openSubmitError(error);
        modalRef.cancel();
      });
    };

    if (changeToRestrictedStatus(this.fromStatus$.value!, this.toStatus$.value!)) {
      this.confirmationModal.openChangeToRestrictedStatus().then(() => save(), ignoreModalClose);
    } else {
      save();
    }
  }

  toggleEnforceTransitionRulesForSuperUserToo() {
    this.enforceTransitionRulesForSuperUserToo = !this.enforceTransitionRulesForSuperUserToo;
    this.reset();
  }

  reset() {
    this.toStatus$.next(null);
    this.fromStatus$.next(null);

    if (this.isSuperUser && !this.enforceTransitionRulesForSuperUserToo) {
      this.fromOptions = [null, ...selectableStatuses].map(status => ({
        value: status,
        name: () => this.translateService.instant(status ? status : 'Choose starting status'),
        idIdentifier: () => status ? status : 'all_selected'
      }));
      this.toOptions = [null, ...selectableStatuses].map(stat => ({
        value: stat,
        name: () => this.translateService.instant(stat ? stat : 'Choose target status'),
        idIdentifier: () => stat ? stat : 'all_selected'
      }));
    } else if ((this.isSuperUser && this.enforceTransitionRulesForSuperUserToo) || !this.isSuperUser) {
      this.fromOptions = [null, ...this.fromStatuses].map(status => ({
        value: status,
        name: () => this.translateService.instant(status ? status : 'Choose starting status'),
        idIdentifier: () => status ? status : 'all_selected'
      }));
      this.toOptions = [null, ...this.toStatuses].map(stat => ({
        value: stat,
        name: () => this.translateService.instant(stat ? stat : 'Choose target status'),
        idIdentifier: () => stat ? stat : 'all_selected'
      }));
    }

    combineLatest(this.fromStatus$, this.toStatus$).subscribe(
      ([fromStatus, toStatus]) => {
        const chosenFromStatus: Status | null = fromStatus;
        const allowedToStatuses = chosenFromStatus ? allowedTargetStatuses(chosenFromStatus, false) : this.toStatuses;

        if (!this.isSuperUser || (this.isSuperUser && this.enforceTransitionRulesForSuperUserToo)) {
          this.toOptions = [null, ...allowedToStatuses].map(stat => ({
            value: stat,
            name: () => this.translateService.instant(stat ? stat : 'Choose target status'),
            idIdentifier: () => stat ? stat : 'all_selected'
          }));
        }
      }
    );
  }

  showFromStatusResourcesTotal(): boolean {
    return this.fromStatus$.value !== null && !this.loadingResourcesTotal;
  }

}

@Injectable()
export class MassMigrateDatamodelResourceStatusesModalService {

  constructor(private modalService: ModalService) {
  }

  public open(model: Model): Promise<Model> {
    const modalRef = this.modalService.open(MassMigrateDatamodelResourceStatusesModalComponent, { size: 'sm', backdrop: 'static', keyboard: false });
    const instance = modalRef.componentInstance as MassMigrateDatamodelResourceStatusesModalComponent;
    instance.model = model;
    return modalRef.result;
  }
}
