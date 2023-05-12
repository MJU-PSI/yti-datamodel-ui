import { IScope } from 'angular';
import { Url } from 'app/entities/uri';
import { labelNameToResourceIdIdentifier } from '@mju-psi/yti-common-ui';
import { EditableForm } from './editableEntityController';
import { LegacyComponent } from 'app/utils/angular';
import { isExternalLink } from 'app/components/form/href';

export abstract class TableDescriptor<T> {

  abstract columnDescriptors(): ColumnDescriptor<T>[];
  abstract canEdit(value: T): boolean;
  abstract canRemove(value: T): boolean;
  abstract values(): T[];

  hasOrder(): boolean {
    return false;
  }

  edit(_value: T): any {
  }

  remove(_value: T): any {
  }

  filter(_value: T): boolean {
    return true;
  }

  orderBy(_value: T): any {
    return undefined;
  }
}

export interface ColumnDescriptor<T> {
  headerName: string;
  nameExtractor: (value: T, isEditing: boolean) => string;
  hrefExtractor?: (value: T) => Url;
  onClick?: (value: T) => any;
  cssClass?: string;
}

const nonExpandedLimit = 2;

// @LegacyComponent({
//   bindings: {
//     id: '=',
//     descriptor: '=',
//     expanded: '='
//   },
//   require: {
//     form: '^form'
//   },
//   template: `
//     <p ng-if="$ctrl.visibleValues === 0" translate>None added</p>
//       <table ng-if="$ctrl.visibleValues > 0" class="table table-hover table-sm editable-table" drag-sortable="$ctrl.values" drag-disabled="!$ctrl.canSort()">
//         <thead>
//           <tr>
//             <th ng-class="property.cssClass" ng-repeat="property in $ctrl.properties">{{property.headerName | translate}}</th>
//             <th class="action"></th>
//             <th class="action"></th>
//           </tr>
//         </thead>
//         <tbody>
//           <tr id="{{$ctrl.id + '_' + $ctrl.normalizeValueForId($ctrl.properties[0].nameExtractor(value)) + '_drag_sortable_item'}}"
//               ng-repeat="value in $ctrl.values | filter: $ctrl.filter | orderBy: $ctrl.orderBy"
//               ng-class="['expandable-table', {collapsed: $ctrl.limit && $index >= $ctrl.limit}]"
//               ng-init="valueIndex = $index"
//               drag-sortable-item>
//             <td ng-class="property.cssClass" ng-repeat="property in $ctrl.properties">
//               <span ng-if="!property.hrefExtractor && !property.onClick">{{property.nameExtractor(value, $ctrl.isEditing())}}</span>
//               <a id="{{$ctrl.id + '_' + property.hrefExtractor(value) + '_href_editable_link'}}"
//                  ng-if="property.hrefExtractor"
//                  target="_blank"
//                  rel="noopener noreferrer"
//                  ng-href="{{property.hrefExtractor(value)}}">
//                 {{property.nameExtractor(value)}}
//                 <i ng-if="$ctrl.isExternalLink(property.hrefExtractor(value))" class="fas fa-external-link-alt x-small-item"></i>
//               </a>
//               <a id="{{$ctrl.id + '_' + $ctrl.normalizeValueForId(property.nameExtractor(value)) + '_on_click_editable_link'}}"
//                  ng-if="property.onClick"
//                  ng-click="property.onClick(value)">
//                 {{property.nameExtractor(value)}}
//               </a>
//             </td>
//             <td id="{{$ctrl.id + '_' + $ctrl.normalizeValueForId($ctrl.properties[0].nameExtractor(value)) + '_remove_editable_button'}}"
//                 ng-class="[ 'action', 'remove', { editable: $ctrl.canRemove(value) } ]"
//                 ng-click="$ctrl.remove(value, valueIndex)">
//               <i class="fas fa-trash-alt" uib-tooltip="{{'Remove' | translate}}"></i>
//             </td>
//             <td id="{{$ctrl.id + '_' + $ctrl.normalizeValueForId($ctrl.properties[0].nameExtractor(value)) + '_edit_editable_button'}}"
//                 ng-class="[ 'action', 'edit', { editable: $ctrl.canEdit(value) } ]"
//                 ng-click="$ctrl.edit(value, valueIndex)">
//               <i class="fas fa-pencil-alt" uib-tooltip="{{'Edit' | translate}}"></i>
//             </td>
//           </tr>
//         </tbody>
//         <tfoot class="expander" ng-if="$ctrl.canExpand()">
//           <tr>
//             <td id="{{$ctrl.id + '_toggle_expand_editable_button'}}" colspan="{{$ctrl.numberOfColumns}}" ng-click="$ctrl.toggleExpand()"><i ng-class="$ctrl.expanderClasses"></i></td>
//           </tr>
//         </tfoot>
//       </table>
//     `
// })
// export class EditableTableComponent<T> {

//   values: T[];
//   expanded: boolean;

//   properties: ColumnDescriptor<T>[];
//   descriptor: TableDescriptor<T>;
//   visibleValues: number;

//   filter = (value: T) => this.descriptor.filter(value);
//   orderBy = (value: T) => this.descriptor.orderBy(value);

//   form: EditableForm;

//   constructor(private $scope: IScope) {
//     'ngInject';
//   }

//   $onInit() {
//     this.$scope.$watchCollection(() => this.descriptor ? this.descriptor.values() : [], values => {
//       this.values = values;

//       if (values && this.descriptor) {
//         this.properties = this.descriptor.columnDescriptors();
//         this.visibleValues = values ? values.filter(this.filter).length : 0;
//       }
//     });
//   }

//   isEditing() {
//     return this.form && this.form.editing;
//   }

//   canSort() {
//     return this.descriptor && this.descriptor.hasOrder() && this.isEditing();
//   }

//   remove(value: T) {
//     if (this.canRemove(value)) {
//       this.descriptor.remove(value);
//     }
//   }

//   edit(value: T) {
//     if (this.canEdit(value)) {
//       this.descriptor.edit(value);
//     }
//   }

//   canEdit(value: T) {
//     return this.isEditing() && this.descriptor.canEdit(value);
//   }

//   canRemove(value: T) {
//     return this.isEditing() && this.descriptor.canRemove(value);
//   }

//   get numberOfColumns() {
//     return this.properties.length + 2;
//   }

//   get limit() {
//     return this.expanded ? null : nonExpandedLimit;
//   }

//   canExpand() {
//     return this.visibleValues > nonExpandedLimit;
//   }

//   toggleExpand() {
//     this.expanded = !this.expanded;
//   }

//   get expanderClasses() {
//     return [
//       'fas',
//       {
//         'fa-angle-double-down': !this.expanded,
//         'fa-angle-double-up': this.expanded
//       }
//     ];
//   }

//   normalizeValueForId(value: string): string {
//     return labelNameToResourceIdIdentifier(value);
//   }

//   isExternalLink(link: string): boolean {
//     return isExternalLink(link);
//   }
// }

import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { NgForm } from '@angular/forms';

// TODO ALES - drag-sortable ???
@Component({
  selector: 'editable-table',
  template: `
    <p *ngIf="visibleValues === 0" translate>None added</p>
      <table *ngIf="visibleValues > 0" class="table table-hover table-sm editable-table">
        <thead>
          <tr>
            <th [ngClass]="property.cssClass" *ngFor="let property of properties">{{property.headerName | translate}}</th>
            <th class="action"></th>
            <th class="action"></th>
          </tr>
        </thead>
        <tbody>
          <tr [id]="id + '_' + normalizeValueForId(properties[0].nameExtractor(value)) + '_drag_sortable_item'"
              *ngFor="let value of values | filter: filter |  orderBy: orderBy; let i = index"
              [ngClass]="{'expandable-table': true, 'collapsed': limit && i >= limit}">
            <td [ngClass]="property.cssClass" *ngFor="let property of properties">
              <span *ngIf="!property.hrefExtractor && !property.onClick">{{property.nameExtractor(value, isEditing())}}</span>
              <a id="{{id + '_' + property.hrefExtractor(value) + '_href_editable_link'}}"
                 *ngIf="property.hrefExtractor"
                 target="_blank"
                 rel="noopener noreferrer"
                 [href]="property.hrefExtractor(value)">
                {{property.nameExtractor(value)}}
                <i *ngIf="isExternalLink(property.hrefExtractor(value))" class="fas fa-external-link-alt x-small-item"></i>
              </a>
              <a id="{{id + '_' + normalizeValueForId(property.nameExtractor(value)) + '_on_click_editable_link'}}"
                 *ngIf="property.onClick"
                 (click)="property.onClick(value)">
                {{property.nameExtractor(value)}}
              </a>
            </td>
            <td id="{{id + '_' + normalizeValueForId(properties[0].nameExtractor(value)) + '_remove_editable_button'}}"
                [ngClass]="{'action': true, 'remove': true, 'editable': canRemove(value) }"
                (click)="remove(value, i)">
              <i class="fas fa-trash-alt" [ngbTooltip]="'Remove' | translate"></i>
            </td>
            <td id="{{id + '_' + normalizeValueForId(properties[0].nameExtractor(value)) + '_edit_editable_button'}}"
                [ngClass]="{'action': true, 'edit': true, 'editable': canEdit(value) }"
                (click)="edit(value, i)">
              <i class="fas fa-pencil-alt" [ngbTooltip]="'Edit' | translate"></i>
            </td>
          </tr>
        </tbody>
        <tfoot class="expander" *ngIf="canExpand()">
          <tr>
            <td id="{{id + '_toggle_expand_editable_button'}}" [attr.colspan]="numberOfColumns" (click)="toggleExpand()"><i [ngClass]="expanderClasses"></i></td>
          </tr>
        </tfoot>
      </table>
    `
})
export class EditableTableComponent<T> {

  @Input() id: string;
  @Input() descriptor: TableDescriptor<T>;
  @Input() expanded: boolean;
  @Input() form: NgForm;

  values: T[];

  properties: ColumnDescriptor<T>[];
  visibleValues: number;

  filter = (value: T) => this.descriptor.filter(value);
  orderBy = (value: T) => this.descriptor.orderBy(value);


  ngOnChanges(changes: SimpleChanges) {
    if (changes.descriptor) {
      const values = this.descriptor ? this.descriptor.values() : [];
      this.values = values;
      if (values && this.descriptor) {
        this.properties = this.descriptor.columnDescriptors();
        this.visibleValues = values ? values.filter(this.filter).length : 0;
      }
    }
  }

  isEditing() {
    return this.form && this.form.form.editing;
  }

  canSort() {
    return this.descriptor && this.descriptor.hasOrder() && this.isEditing();
  }

  remove(value: T) {
    if (this.canRemove(value)) {
      this.descriptor.remove(value);
    }
  }

  edit(value: T) {
    if (this.canEdit(value)) {
      this.descriptor.edit(value);
    }
  }

  canEdit(value: T) {
    return this.isEditing() && this.descriptor.canEdit(value);
  }

  canRemove(value: T) {
    return this.isEditing() && this.descriptor.canRemove(value);
  }

  get numberOfColumns() {
    return this.properties.length + 2;
  }

  get limit() {
    return this.expanded ? null : nonExpandedLimit;
  }

  canExpand() {
    return this.visibleValues > nonExpandedLimit;
  }

  toggleExpand() {
    this.expanded = !this.expanded;
  }

  get expanderClasses() {
    return {
      'fas': true,
      'fa-angle-double-down': !this.expanded,
      'fa-angle-double-up': this.expanded
    };
  }

  normalizeValueForId(value: string): string {
    return labelNameToResourceIdIdentifier(value);
  }

  isExternalLink(link: string): boolean {
    return isExternalLink(link);
  }
}

