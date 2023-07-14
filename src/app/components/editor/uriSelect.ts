// import { ICompiledExpression, IPromise, IQService, IScope } from 'angular';
// import { SearchPredicateModal } from './searchPredicateModal';
// import { SearchClassModal } from './searchClassModal';
// import { EditableForm } from 'app/components/form/editableEntityController';
// import { Uri } from 'app/entities/uri';
// import { DataSource } from 'app/components/form/dataSource';
// import { ClassService } from 'app/services/classService';
// import { PredicateService } from 'app/services/predicateService';
// import { idExclusion, itemExclusion } from 'app/utils/exclusion';
// import { ClassListItem } from 'app/entities/class';
// import { PredicateListItem } from 'app/entities/predicate';
// import { ClassType, KnownPredicateType } from 'app/types/entity';
// import { Model } from 'app/entities/model';
// import { LegacyComponent, modalCancelHandler } from 'app/utils/angular';


// type DataType = ClassListItem|PredicateListItem;

// @LegacyComponent({
//   bindings: {
//     uri: '=',
//     type: '@',
//     model: '=',
//     id: '@',
//     afterSelected: '&',
//     mandatory: '=',
//     excludeId: '=?',
//     excludeItem: '=?',
//     defaultToCurrentModel: '='
//   },
//   require: {
//     form: '?^form'
//   },
//   template: `
//       <autocomplete datasource="$ctrl.datasource" value-extractor="$ctrl.valueExtractor" exclude-provider="$ctrl.createItemExclusion">
//         <input id="{{$ctrl.id}}"
//                type="text"
//                class="form-control"
//                uri-input
//                exclude-validator="$ctrl.createIdExclusion"
//                ng-required="$ctrl.mandatory"
//                model="$ctrl.model"
//                ng-model="$ctrl.uri"
//                ng-blur="$ctrl.handleChange()"
//                autocomplete="off" />
//       </autocomplete>

//       <button id="{{$ctrl.id + '_choose_' + $ctrl.type + '_uri_select_button'}}"
//               ng-if="$ctrl.isEditing()"
//               type="button"
//               class="btn btn-action btn-sm"
//               ng-click="$ctrl.selectUri()">
//         {{('Choose ' + $ctrl.type) | translate}}
//       </button>
//   `
// })
// export class UriSelectComponent {

//   uri: Uri;
//   type: ClassType|KnownPredicateType;
//   model: Model;
//   id: string;
//   afterSelected: ICompiledExpression;
//   mandatory: boolean;
//   duplicate: (uri: Uri) => boolean;
//   defaultToCurrentModel: boolean;
//   datasource: DataSource<DataType>;
//   private change: Uri|null = null;

//   excludeId: (id: Uri) => string;
//   excludeItem: (item: DataType) => string;
//   valueExtractor = (item: DataType) => item.id;

//   createIdExclusion = () => idExclusion(this.excludeId, this.excludeItem, this.datasource, this.$q);
//   createItemExclusion = () => itemExclusion(this.excludeId, this.excludeItem);

//   form: EditableForm;

//   constructor(private $scope: IScope,
//               private $q: IQService,
//               private searchPredicateModal: SearchPredicateModal,
//               private searchClassModal: SearchClassModal,
//               private classService: ClassService,
//               private predicateService: PredicateService) {
//     'ngInject';
//   }

//   $onInit() {

//     const modelProvider = () => this.model;
//     this.datasource = this.type === 'class' || this.type === 'shape' ? this.classService.getClassesForModelDataSource(modelProvider)
//                                                                      : this.predicateService.getPredicatesForModelDataSource(modelProvider);

//     this.$scope.$watch(() => this.uri, (current, previous) => {
//       if (!current || !current.equals(previous)) {
//         this.change = current;
//       }
//     });
//   }

//   isEditing() {
//     return this.form && this.form.editing;
//   }

//   handleChange() {
//     if (this.change) {
//       this.afterSelected({id: this.change});
//       this.change = null;
//     }
//   }

//   selectUri() {
//     const promise: IPromise<DataType> = this.type === 'class' || this.type === 'shape'
//       ? this.searchClassModal.openWithOnlySelection(this.model, this.defaultToCurrentModel || false, this.createItemExclusion())
//       : this.searchPredicateModal.openWithOnlySelection(this.model, this.type, this.createItemExclusion());

//     promise.then(result => {
//       this.uri = result.id;
//       this.afterSelected({id: result.id});
//     }, modalCancelHandler);
//   }
// }


import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Uri } from 'app/entities/uri';
import { DataSource } from 'app/components/form/dataSource';
import { DefaultClassService } from 'app/services/classService';
import { DefaultPredicateService } from 'app/services/predicateService';
import { idExclusion, itemExclusion } from 'app/utils/exclusion';
import { ClassListItem } from 'app/entities/class';
import { PredicateListItem } from 'app/entities/predicate';
import { ClassType, KnownPredicateType } from 'app/types/entity';
import { Model } from 'app/entities/model';
import { SearchPredicateModal } from './searchPredicateModal';
import { SearchClassModal } from './searchClassModal';
import { ControlContainer, NgForm, NgModel } from '@angular/forms';
import { modalCancelHandler } from 'app/utils/angular';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction, Subject, from, merge, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { EditableService } from 'app/services/editable.service';

type DataType = ClassListItem | PredicateListItem;

@Component({
  selector: 'uri-select',
  template: `
      <!-- TODO ALES -->
      <!-- [excludeValidator]="createIdExclusion" -->

      <input [id]="id"
      type="text"
      class="form-control"
      uriInput
      [model]="model"
      [required]="mandatory"
      [ngModel]="uri"
      (ngModelChange)="onModelChange($event)"
      [ngModelOptions]="{ standalone: true }"
      autocomplete="off"
      [ngbTypeahead]="search"
      [resultFormatter]="resultFormatter"
      [inputFormatter]="inputFormatter"
      (focus)="focus$.next($any($event).target.value)"
      (click)="click$.next($any($event).target.value)"
      (selectItem)="onSelect($event)"
      #instance="ngbTypeahead"
      #editableInput
      />

    <button [id]="id + '_choose_' + type + '_uri_select_button'"
            *ngIf="isEditing()"
            type="button"
            class="btn btn-action btn-sm"
            (click)="selectUri()">
      {{ 'Choose ' + type | translate }}
    </button>`
})
export class UriSelectComponent implements OnInit {
  @Input() uri: Uri;
  @Input() type: ClassType | KnownPredicateType;
  @Input() model: Model;
  @Input() id: string;
  @Input() mandatory: boolean;
  @Input() duplicate: (uri: Uri) => boolean;
  @Input() defaultToCurrentModel: boolean;
  @Input() excludeId: (id: Uri) => string;
  @Input() excludeItem: (item: DataType) => string;

  @Output() afterSelected = new EventEmitter<Uri>();
  @Output() uriChange = new EventEmitter<Uri>();

  @ViewChild('editableInput',  { read: NgModel, static: true }) inputNgModelCtrl!: NgModel;
  @ViewChild('editableInput', { read: ElementRef }) inputElementRef!: ElementRef<HTMLInputElement>;

  dataSource: DataSource<DataType>;

  valueExtractor = (item: DataType) => item.id;
  createIdExclusion = () => idExclusion(this.excludeId, this.excludeItem, this.dataSource);
  createItemExclusion = () => itemExclusion(this.excludeId, this.excludeItem);

  constructor(
    private searchPredicateModal: SearchPredicateModal,
    private searchClassModal: SearchClassModal,
    private classService: DefaultClassService,
    private predicateService: DefaultPredicateService,
    private editableService: EditableService
  ) { }

  @ViewChild('instance', { static: true }) instance: NgbTypeahead;
	focus$ = new Subject<string>();
	click$ = new Subject<string>();

  search: OperatorFunction<string, readonly Uri[]>  = (text$: Observable<string>) => {
		const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
		const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
		const inputFocus$ = this.focus$;

		return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
			switchMap((searchText: string) => {
        return from(this.dataSource(searchText)).pipe(
          catchError(() => of([])),
          map((results: DataType[]) => {
            const exclude = this.createItemExclusion();
            const included = results.filter((item: DataType) => !exclude || !exclude(item));

            const uris: Uri[] = included.map((result: DataType) => result.id);

            return uris.filter((uri: Uri) => {
              return uri && uri.compact.includes(searchText);
            });
          })
        );
      }),
		);
	};

  resultFormatter(result: Uri): string {
    return result.compact;
  }

  inputFormatter(result: Uri): string {
    return result.compact;
  }

  onSelect(item: any): void {
    this.uriChange.emit(item.item);
  }

  ngOnInit() {
    const modelProvider = () => this.model;
    this.dataSource = this.type === 'class' || this.type === 'shape'
      ? this.classService.getClassesForModelDataSource(modelProvider)
      : this.predicateService.getPredicatesForModelDataSource(modelProvider);
  }

  isEditing(): boolean {
    return this.editableService.editing;
  }

  onModelChange(value: Uri): void {
    if (value && this.inputNgModelCtrl.control.valid) {
      this.uriChange.emit(value);
      this.afterSelected.emit(value);
    }
  }

  selectUri(): void {
    const promise: Promise<DataType> = this.type === 'class' || this.type === 'shape'
      ? this.searchClassModal.openWithOnlySelection(this.model, this.defaultToCurrentModel || false, this.createItemExclusion())
      : this.searchPredicateModal.openWithOnlySelection(this.model, this.type, this.createItemExclusion());

    promise.then(result => {

        this.uriChange.emit(result.id);
        this.afterSelected.emit(result.id);
      }, modalCancelHandler);

  }
}
