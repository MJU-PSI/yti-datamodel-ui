import { IScope } from 'angular';
import { LanguageService } from 'app/services/languageService';
import { ColumnDescriptor, TableDescriptor } from 'app/components/form/editableTable';
import { AddEditNamespaceModal } from './addEditNamespaceModal';
import { SearchNamespaceModal } from './searchNamespaceModal';
import { combineExclusions } from 'app/utils/exclusion';
import { ImportedNamespace, NamespaceType } from 'app/entities/model';
import { ComponentDeclaration, modalCancelHandler } from 'app/utils/angular';
import { LanguageContext } from 'app/types/language';
import { forwardRef } from '@angular/core';
import { EditableForm } from 'app/components/form/editableEntityController';

interface WithImportedNamespaces {
  importedNamespaces: ImportedNamespace[];
  addImportedNamespace(namespace: ImportedNamespace): void;
  removeImportedNamespace(namespace: ImportedNamespace): void;
}

export const ImportedNamespacesViewComponent: ComponentDeclaration = {
  selector: 'importedNamespacesView',
  bindings: {
    value: '=',
    context: '=',
    allowProfiles: '=',
    namespacesInUse: '='
  },
  require: {
    form: '?^form'
  },
  template: `
      <h4>
        <span translate>Imported namespaces</span>
        <button id="add_imported_namespace_button" type="button" class="btn btn-link btn-xs pull-right" ng-click="$ctrl.importNamespace()" ng-show="$ctrl.isEditing()">
          <span translate>Import namespace</span>
        </button>
      </h4>
      <editable-table id="'importedNamespaces'" descriptor="$ctrl.descriptor" expanded="$ctrl.expanded"></editable-table>
  `,
  controller: forwardRef(() => ImportedNamespacesViewController)
};

class ImportedNamespacesViewController {

  value: WithImportedNamespaces;
  allowProfiles: boolean;
  context: LanguageContext;
  namespacesInUse: Set<string>;

  descriptor: ImportedNamespaceTableDescriptor;
  expanded = false;

  form: EditableForm;

  /* @ngInject */
  constructor(private $scope: IScope,
              private searchNamespaceModal: SearchNamespaceModal,
              private addEditNamespaceModal: AddEditNamespaceModal,
              private languageService: LanguageService) {
  }

  $onInit() {
    this.$scope.$watch(() => this.value, value => {
      this.descriptor = new ImportedNamespaceTableDescriptor(this.addEditNamespaceModal, value, this.context, this.languageService, this.namespacesInUse);
    });
  }

  isEditing() {
    return this.form && this.form.editing;
  }

  importNamespace() {

    const existsExclude = (ns: ImportedNamespace) => {
      for (const existingNs of this.value.importedNamespaces) {
        if (existingNs.namespaceType !== NamespaceType.IMPLICIT_TECHNICAL && (existingNs.prefix === ns.prefix || existingNs.url === ns.namespace)) {
          return 'Already added';
        }
      }
      return null;
    };

    const profileExclude = (ns: ImportedNamespace) => (!this.allowProfiles && ns.isOfType('profile')) ? 'Cannot import profile' : null;
    const exclude = combineExclusions(existsExclude, profileExclude);

    this.searchNamespaceModal.open(this.context, exclude)
      .then((ns: ImportedNamespace) => {
        this.value.addImportedNamespace(ns);
        this.expanded = true;
      }, modalCancelHandler);
  }
}

class ImportedNamespaceTableDescriptor extends TableDescriptor<ImportedNamespace> {

  constructor(private addEditNamespaceModal: AddEditNamespaceModal,
              private value: WithImportedNamespaces,
              private context: LanguageContext,
              private languageService: LanguageService,
              private namespacesInUse: Set<string>) {
    super();
  }

  columnDescriptors(): ColumnDescriptor<ImportedNamespace>[] {
    return [
      { headerName: 'Prefix', nameExtractor: ns => ns.prefix, cssClass: 'prefix' },
      { headerName: 'Namespace label', nameExtractor: ns => this.languageService.translate(ns.label, this.context) },
      { headerName: 'Namespace', nameExtractor: ns => ns.namespace }
    ];
  }

  values(): ImportedNamespace[] {
    return this.value && this.value.importedNamespaces;
  }

  orderBy(ns: ImportedNamespace) {
    return ns.prefix;
  }

  edit(ns: ImportedNamespace) {
    this.addEditNamespaceModal.openEdit(this.context, ns, this.languageService.getModelLanguage(this.context));
  }

  remove(ns: ImportedNamespace) {
    this.value.removeImportedNamespace(ns);
  }

  canEdit(ns: ImportedNamespace): boolean {
    return ns.namespaceModifiable || ns.prefixModifiable || ns.labelModifiable;
  }

  canRemove(ns: ImportedNamespace): boolean {
    return !this.namespacesInUse.has(ns.id.uri);
  }
}
