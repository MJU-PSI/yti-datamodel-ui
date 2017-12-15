import { IScope, IPromise, ui } from 'angular';
import IModalService = ui.bootstrap.IModalService;
import IModalServiceInstance = ui.bootstrap.IModalServiceInstance;
import { ModelService } from 'app/services/modelService';
import { Language } from 'app/types/language';
import { isDefined } from 'yti-common-ui/utils/object';
import { Model, ImportedNamespace, NamespaceType } from 'app/entities/model';

export class AddEditNamespaceModal {
  /* @ngInject */
  constructor(private $uibModal: IModalService) {
  }

  private open(model: Model, language: Language, namespaceToEdit: ImportedNamespace|null): IPromise<ImportedNamespace> {
    return this.$uibModal.open({
      template: require('./addEditNamespaceModal.html'),
      size: 'small',
      controller: AddEditNamespaceController,
      controllerAs: 'ctrl',
      backdrop: true,
      resolve: {
        model: () => model,
        language: () => language,
        namespaceToEdit: () => namespaceToEdit
      }
    }).result;
  }

  openAdd(model: Model, language: Language): IPromise<ImportedNamespace> {
    return this.open(model, language, null);
  }

  openEdit(require: ImportedNamespace, model: Model, language: Language): IPromise<ImportedNamespace> {
    return this.open(model, language, require);
  }
}

class AddEditNamespaceController {

  namespace: string;
  prefix: string;
  label: string;

  submitError: string;
  edit: boolean;

  namespaceBeforeForced: string|null = null;
  prefixBeforeForced: string|null = null;

  /* @ngInject */
  constructor(private $uibModalInstance: IModalServiceInstance,
              $scope: IScope,
              public model: Model,
              private language: Language,
              private namespaceToEdit: ImportedNamespace|null,
              private modelService: ModelService) {

    this.edit = !!namespaceToEdit;

    if (namespaceToEdit) {
      this.namespace = namespaceToEdit.namespace;
      this.prefix = namespaceToEdit.prefix;
      this.label = namespaceToEdit.label[language];
    }

    if (!this.edit) {

      $scope.$watch(() => this.prefix, () => {
        if (this.prefixModifiable()) {

          const namespaceOverrideWasOn = isDefined(this.namespaceBeforeForced);
          let namespaceOverrideSwitchedOn = false;

          for (const [prefix, ns] of Object.entries(model.getNamespacesOfType(NamespaceType.IMPLICIT_TECHNICAL))) {
            if (prefix === this.prefix) {
              namespaceOverrideSwitchedOn = true;
              this.namespaceBeforeForced = this.namespace || '';
              this.namespace = ns;
            }
          }

          if (namespaceOverrideWasOn && !namespaceOverrideSwitchedOn) {
            this.namespace = this.namespaceBeforeForced!;
            this.namespaceBeforeForced = null;
          }
        }
      });

      $scope.$watch(() => this.namespace, () => {
        if (this.namespaceModifiable()) {

          const prefixOverrideWasOn = isDefined(this.prefixBeforeForced);
          let prefixOverrideSwitchedOn = false;

          for (const [prefix, ns] of Object.entries(model.getNamespacesOfType(NamespaceType.IMPLICIT_TECHNICAL))) {
            if (ns === this.namespace) {
              prefixOverrideSwitchedOn = true;
              this.prefixBeforeForced = this.prefix || '';
              this.prefix = prefix;
            }
          }

          if (prefixOverrideWasOn && !prefixOverrideSwitchedOn) {
            this.prefix = this.prefixBeforeForced!;
            this.prefixBeforeForced = null;
          }
        }
      });
    }
  }

  get confirmLabel() {
    return this.edit ? 'Edit' : 'Create new';
  }

  get titleLabel() {
    return this.edit ? 'Edit namespace' : 'Import namespace';
  }

  labelModifiable() {
    return !this.edit || this.namespaceToEdit!.labelModifiable;
  }

  namespaceModifiable() {
    return (!this.edit || this.namespaceToEdit!.namespaceModifiable) && !isDefined(this.namespaceBeforeForced);
  }

  prefixModifiable() {
    return (!this.edit || this.namespaceToEdit!.prefixModifiable) && !isDefined(this.prefixBeforeForced);
  }

  create() {
    if (this.edit) {
      this.namespaceToEdit!.namespace = this.namespace;
      this.namespaceToEdit!.prefix = this.prefix;
      this.namespaceToEdit!.label[this.language] = this.label;

      this.$uibModalInstance.close(this.namespaceToEdit);
    } else {
      this.modelService.newNamespaceImport(this.namespace, this.prefix, this.label, this.language)
        .then(ns => {
          return this.$uibModalInstance.close(this.mangleAsTechnicalIfNecessary(ns));
        }, err => this.submitError = err.data.errorMessage);
    }
  }

  // XXX: API should return as technical and shouldn't need mangling
  private mangleAsTechnicalIfNecessary(ns: ImportedNamespace) {

    const isTechnical = isDefined(this.namespaceBeforeForced) || isDefined(this.prefixBeforeForced);

    if (isTechnical) {
      ns.convertAsTechnical();
    }

    return ns;
  }

  cancel() {
    this.$uibModalInstance.dismiss('cancel');
  }
}
