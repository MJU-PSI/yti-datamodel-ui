// import { IScope } from 'angular';
// import { LanguageService } from '../../services/languageService';
// import { ColumnDescriptor, TableDescriptor } from '../../components/form/editableTable';
// import { AddEditNamespaceModal } from './addEditNamespaceModal';
// import { SearchNamespaceModal } from './searchNamespaceModal';
// import { combineExclusions } from '../../utils/exclusion';
// import { ImportedNamespace, NamespaceType } from '../../entities/model';
// import { LegacyComponent, modalCancelHandler } from '../../utils/angular';
// import { LanguageContext } from '../../types/language';
// import { EditableForm } from '../../components/form/editableEntityController';
// import { Uri } from '../../entities/uri';

// interface WithImportedNamespaces {
//   id: Uri | null;
//   importedNamespaces: ImportedNamespace[];

//   addImportedNamespace(namespace: ImportedNamespace): void;

//   removeImportedNamespace(namespace: ImportedNamespace): void;
// }

// @LegacyComponent({
//   bindings: {
//     value: '=',
//     context: '=',
//     allowProfiles: '=',
//     namespacesInUse: '=',
//     modelPrefix: '<',
//     modelNamespace: '<'
//   },
//   require: {
//     form: '?^form'
//   },
//   template: `
//       <h4>
//         <span translate>Imported namespaces</span>
//         <button id="add_imported_namespace_button" type="button" class="btn btn-link btn-xs pull-right" ng-click="$ctrl.importNamespace()" ng-show="$ctrl.isEditing()">
//           <span translate>Import namespace</span>
//         </button>
//       </h4>
//       <editable-table id="'importedNamespaces'" descriptor="$ctrl.descriptor" expanded="$ctrl.expanded"></editable-table>
//   `
// })
// export class ImportedNamespacesViewComponent {

//   value: WithImportedNamespaces;
//   allowProfiles: boolean;
//   context: LanguageContext;
//   namespacesInUse?: Set<string>;
//   modelPrefix: string;
//   modelNamespace: string;

//   descriptor: ImportedNamespaceTableDescriptor;
//   expanded = false;

//   form: EditableForm;

//   constructor(private $scope: IScope,
//               private searchNamespaceModal: SearchNamespaceModal,
//               private addEditNamespaceModal: AddEditNamespaceModal,
//               private languageService: LanguageService) {
//     'ngInject';
//   }

//   $onInit() {
//     this.$scope.$watch(() => this.value, value => {
//       this.descriptor = new ImportedNamespaceTableDescriptor(this.addEditNamespaceModal, value, () => this.modelPrefix,
//       () => this.modelNamespace, this.context, this.languageService, this.namespacesInUse);
//     });
//   }

//   isEditing() {
//     return this.form && this.form.editing;
//   }

//   importNamespace() {

//     const existsExclude = (ns: ImportedNamespace) => {
//       for (const existingNs of this.value.importedNamespaces) {
//         if (existingNs.namespaceType !== NamespaceType.IMPLICIT_TECHNICAL && (existingNs.prefix === ns.prefix || existingNs.url === ns.namespace)) {
//           return 'Already added';
//         }
//       }
//       return null;
//     };

//     const namespaceOfThisModel = this.value.id ? this.value.id.uri : '';

//     const profileExclude = (ns: ImportedNamespace) => (!this.allowProfiles && ns.isOfType('profile')) ? 'Cannot import profile' : null;
//     const thisModelExclude = (ns: ImportedNamespace) => (namespaceOfThisModel === ns.id.uri) ? 'Cannot import namespace of this model' : null;
//     const exclude = combineExclusions(existsExclude, profileExclude, thisModelExclude);

//     const reservedPrefixes: string[] = [this.modelPrefix, ...this.value.importedNamespaces.map(ns => ns.prefix)];
//     const usedNamespaces: string[] = [this.modelNamespace, ...this.value.importedNamespaces.map(namespace => namespace.namespace)];

//     this.searchNamespaceModal.open(this.context, reservedPrefixes, usedNamespaces, exclude)
//       .then((ns: ImportedNamespace) => {
//         this.value.addImportedNamespace(ns);
//         this.expanded = true;
//       }, modalCancelHandler);
//   }
// }

// class ImportedNamespaceTableDescriptor extends TableDescriptor<ImportedNamespace> {

//   constructor(private addEditNamespaceModal: AddEditNamespaceModal,
//               private value: WithImportedNamespaces,
//               private modelPrefix: () => string,
//               private modelNamespace: () => string,
//               private context: LanguageContext,
//               private languageService: LanguageService,
//               private namespacesInUse?: Set<string>) {
//     super();
//   }

//   columnDescriptors(): ColumnDescriptor<ImportedNamespace>[] {
//     return [
//       { headerName: 'Prefix', nameExtractor: ns => ns.prefix, cssClass: 'prefix' },
//       { headerName: 'Namespace label', nameExtractor: ns => this.languageService.translate(ns.label, this.context) },
//       { headerName: 'Namespace', nameExtractor: ns => ns.namespace }
//     ];
//   }

//   values(): ImportedNamespace[] {
//     return this.value && this.value.importedNamespaces;
//   }

//   orderBy(ns: ImportedNamespace) {
//     return ns.prefix;
//   }

//   edit(ns: ImportedNamespace) {
//     const reservedPrefixes: string[] = [this.modelPrefix(), ...this.value.importedNamespaces.map(namespace => namespace.prefix).filter(prefix => ns.prefix !== prefix)];
//     const usedNamespaces: string[] = [this.modelNamespace(), ...this.value.importedNamespaces.map(namespace => namespace.namespace).filter(namespace => ns.namespace !== namespace)];
//     this.addEditNamespaceModal.openEdit(this.context, ns, this.languageService.getModelLanguage(this.context), reservedPrefixes, usedNamespaces);
//   }

//   remove(ns: ImportedNamespace) {
//     this.value.removeImportedNamespace(ns);
//   }

//   canEdit(ns: ImportedNamespace): boolean {
//     return ns.namespaceModifiable || ns.prefixModifiable || ns.labelModifiable;
//   }

//   canRemove(ns: ImportedNamespace): boolean {
//     if (this.namespacesInUse) {
//       return !this.namespacesInUse.has(ns.id.uri);
//     }
//     return false;
//   }
// }

import { Component, Input, SimpleChanges } from '@angular/core';
import { LanguageService } from '../../services/languageService';
import { ColumnDescriptor, TableDescriptor } from '../../components/form/editableTable';
import { AddEditNamespaceModal } from './addEditNamespaceModal';
import { SearchNamespaceModal } from './searchNamespaceModal';
import { combineExclusions } from '../../utils/exclusion';
import { ImportedNamespace, NamespaceType } from '../../entities/model';
import { LanguageContext } from '../../types/language';
import { Uri } from '../../entities/uri';
import { NgForm } from '@angular/forms';
import { EditableService } from 'app/services/editable.service';

interface WithImportedNamespaces {
  id: Uri | null;
  importedNamespaces: ImportedNamespace[];
  addImportedNamespace(namespace: ImportedNamespace): void;
  removeImportedNamespace(namespace: ImportedNamespace): void;
}

@Component({
  selector: 'imported-namespaces-view',
  template: `
    <h4>
      <span translate>Imported namespaces</span>
      <button id="add_imported_namespace_button" type="button" class="btn btn-link btn-xs pull-right"
              (click)="importNamespace()" *ngIf="isEditing()">
        <span translate>Import namespace</span>
      </button>
    </h4>
    <editable-table id="importedNamespaces" [descriptor]="descriptor" [expanded]="expanded" ></editable-table>
  `,
})
export class ImportedNamespacesViewComponent {

  @Input() value: WithImportedNamespaces;
  @Input() allowProfiles: boolean;
  @Input() context: LanguageContext;
  @Input() namespacesInUse?: Set<string>;
  @Input() modelPrefix: string;
  @Input() modelNamespace: string;

  descriptor: ImportedNamespaceTableDescriptor;
  expanded: boolean;
  valueBefore: WithImportedNamespaces;

  constructor(
    private searchNamespaceModal: SearchNamespaceModal,
    private addEditNamespaceModal: AddEditNamespaceModal,
    private languageService: LanguageService,
    private editableService: EditableService
  ) {}

  ngOnInit(): void {
    this.descriptor = new ImportedNamespaceTableDescriptor(
      this.addEditNamespaceModal,
      this.value,
      () => this.modelPrefix,
      () => this.modelNamespace,
      this.context,
      this.languageService,
      this.namespacesInUse
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.value && !changes.value.firstChange) {
      const value = changes.value.currentValue;
      this.descriptor = new ImportedNamespaceTableDescriptor(
        this.addEditNamespaceModal,
        value,
        () => this.modelPrefix,
        () => this.modelNamespace,
        this.context,
        this.languageService,
        this.namespacesInUse
      );
    }
  }

  ngDoCheck() {
   if (JSON.stringify(this.value) !== JSON.stringify(this.valueBefore)) {
      this.valueBefore = { ...this.value };
      this.descriptor = new ImportedNamespaceTableDescriptor(
        this.addEditNamespaceModal,
        this.value,
        () => this.modelPrefix,
        () => this.modelNamespace,
        this.context,
        this.languageService,
        this.namespacesInUse
      );
    }
  }

  isEditing(): boolean {
    return this.editableService.editing;
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

    const namespaceOfThisModel = this.value.id ? this.value.id.uri : '';

    const profileExclude = (ns: ImportedNamespace) => (!this.allowProfiles && ns.isOfType('profile')) ? 'Cannot import profile' : null;
    const thisModelExclude = (ns: ImportedNamespace) => (namespaceOfThisModel === ns.id.uri) ? 'Cannot import namespace of this model' : null;
    const exclude = combineExclusions(existsExclude, profileExclude, thisModelExclude);

    const reservedPrefixes: string[] = [this.modelPrefix, ...this.value.importedNamespaces.map(ns => ns.prefix)];
    const usedNamespaces: string[] = [this.modelNamespace, ...this.value.importedNamespaces.map(namespace => namespace.namespace)];

    this.searchNamespaceModal.open(this.context, reservedPrefixes, usedNamespaces, exclude)
      .then((ns: ImportedNamespace) => {
        this.value.addImportedNamespace(ns);
        this.expanded = true;
      }, (err) => {console.log(err)});
  }
}

class ImportedNamespaceTableDescriptor extends TableDescriptor<ImportedNamespace> {

  constructor(private addEditNamespaceModal: AddEditNamespaceModal,
              private value: WithImportedNamespaces,
              private modelPrefix: () => string,
              private modelNamespace: () => string,
              private context: LanguageContext,
              private languageService: LanguageService,
              private namespacesInUse?: Set<string>) {
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

  orderBy(ns: ImportedNamespace, ns1: ImportedNamespace) {
    return ns.prefix.localeCompare(ns1.prefix);
  }

  edit(ns: ImportedNamespace) {
    const reservedPrefixes: string[] = [this.modelPrefix(), ...this.value.importedNamespaces.map(namespace => namespace.prefix).filter(prefix => ns.prefix !== prefix)];
    const usedNamespaces: string[] = [this.modelNamespace(), ...this.value.importedNamespaces.map(namespace => namespace.namespace).filter(namespace => ns.namespace !== namespace)];
    this.addEditNamespaceModal.openEdit(this.context, ns, this.languageService.getModelLanguage(this.context), reservedPrefixes, usedNamespaces);
  }

  remove(ns: ImportedNamespace) {
    this.value.removeImportedNamespace(ns);
  }

  canEdit(ns: ImportedNamespace): boolean {
    return ns.namespaceModifiable || ns.prefixModifiable || ns.labelModifiable;
  }

  canRemove(ns: ImportedNamespace): boolean {
    if (this.namespacesInUse) {
      return !this.namespacesInUse.has(ns.id.uri);
    }
    return false;
  }
}
