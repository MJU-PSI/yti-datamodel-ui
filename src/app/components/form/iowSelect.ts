// import { IAttributes, IDirectiveFactory, IDocumentService, IParseService, IQService, IScope, ITranscludeFunction } from 'angular';
// import { isDefined, arrowDown, arrowUp, enter, esc, pageDown, pageUp, tab } from '@mju-psi/yti-common-ui';
// import { InputWithPopupController } from './inputPopup';
// import { LegacyComponent } from 'app/utils/angular';

// function parse(exp: string) {
//   const match = exp.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)$/);

//   if (!match) {
//     throw new Error(`Expected expression in form of '_item_ in _collection_' but got '${exp}'.`);
//   }

//   if (!match[1].match(/^(?:(\s*[$\w]+))$/)) {
//     throw new Error(`'_item_' in '_item_ in _collection_' should be an identifier expression, but got '${match[1]}'.`);
//   }

//   return {
//     itemName: match[1],
//     collection: match[2]
//   };
// }

// interface SelectionScope extends IScope {
//   $ctrl: IowSelectComponent<any>;
// }

// // TODO: similarities with autocomplete
// @LegacyComponent({
//   bindings: {
//     ngModel: '=',
//     options: '@',
//     idPrefix: '<'
//   },
//   transclude: true,
//   template: `
//       <div>
//         <div id="{{$ctrl.idPrefix}}_item_select" class="btn btn-dropdown dropdown-toggle" tabindex="0" iow-select-input>
//           <iow-selection-transclude></iow-selection-transclude>
//         </div>
//         <input-popup id-prefix="$ctrl.idPrefix" ctrl="$ctrl"><iow-selectable-item-transclude></iow-selectable-item-transclude></input-popup>
//       </div>
//   `
// })
// export class IowSelectComponent<T> implements InputWithPopupController<T> {

//   options: string;
//   ngModel: T;

//   popupItemName: string;
//   popupItems: T[];

//   show: boolean;
//   selectedSelectionIndex = -1;

//   element: JQuery;

//   private keyEventHandlers: {[key: number]: () => void|boolean} = {
//     [arrowDown]: () => this.openIfNotShown(() => this.moveSelection(1)),
//     [arrowUp]: () => this.openIfNotShown(() => this.moveSelection(-1)),
//     [pageDown]: () => this.openIfNotShown(() => this.moveSelection(10)),
//     [pageUp]: () => this.openIfNotShown(() => this.moveSelection(-10)),
//     [enter]: () => this.openIfNotShown(() => this.selectSelection()),
//     [tab]: () => this.selectSelection(),
//     [esc]: () => this.close()
//   };

//   constructor(private $q: IQService,
//               private $scope: SelectionScope,
//               private $parse: IParseService) {
//     'ngInject';
//   }

//   $onInit() {
//     this.$scope.$watch(() => this.options, optionsExp => {
//       const result = parse(optionsExp);

//       this.popupItemName = result.itemName;
//       this.$q.when(this.$parse(result.collection)(this.$scope.$parent)).then(items => this.popupItems = items);
//     });
//   }

//   private openIfNotShown(action: () => void) {
//     if (!this.show) {
//       this.open();
//     } else {
//       action();
//     }
//   }

//   keyPressed(event: JQueryEventObject) {
//     const handler = this.keyEventHandlers[event.keyCode];
//     if (handler) {
//       const preventDefault = handler();
//       if (!isDefined(preventDefault) || preventDefault === true) {
//         event.preventDefault();
//       }
//     }
//   }

//   private moveSelection(offset: number) {
//     this.setSelection(Math.max(Math.min(this.selectedSelectionIndex + offset, this.popupItems.length - 1), -1));
//   }

//   setSelection(index: number) {
//     this.selectedSelectionIndex = index;
//   }

//   isSelected(index: number) {
//     return index === this.selectedSelectionIndex;
//   }

//   toggleOpen() {
//     if (this.show) {
//       this.close();
//     } else {
//       this.open();
//     }
//   }

//   open() {
//     this.show = true;
//     this.selectedSelectionIndex = this.findSelectionIndex();
//   }

//   close() {
//     this.show = false;
//     this.selectedSelectionIndex = -1;
//   }

//   selectSelection(): boolean {

//     if (this.selectedSelectionIndex >= 0) {
//       this.ngModel = this.popupItems[this.selectedSelectionIndex];
//     }

//     this.close();

//     return this.selectedSelectionIndex >= 0;
//   }

//   private findSelectionIndex() {
//     for (let i = 0; i < this.popupItems.length; i++) {
//       const item = this.popupItems[i];

//       if (item === this.ngModel) {
//         return i;
//       }
//     }

//     return -1;
//   }
// }

// export const IowSelectInputDirective: IDirectiveFactory = ($document: IDocumentService) => {
//   'ngInject';
//   return {
//     restrict: 'A',
//     require: '^iowSelect',
//     link($scope: SelectionScope, element: JQuery, _attributes: IAttributes, controller: IowSelectComponent<any>) {

//       const iowSelectElement = element.closest('iow-select');

//       const keyDownHandler = (event: JQueryEventObject) => $scope.$apply(() => controller.keyPressed(event));
//       const clickHandler = () => $scope.$apply(() => controller.toggleOpen());
//       const blurClickHandler = (event: JQueryEventObject) => {

//         const eventIowSelectElement = jQuery(event.target).closest('iow-select');

//         if (eventIowSelectElement[0] !== iowSelectElement[0]) {
//           $scope.$apply(() => controller.close());
//           $document.off('click', blurClickHandler);
//         }
//       };
//       const focusHandler = () => $document.on('click', blurClickHandler);

//       element.on('click', clickHandler);
//       element.on('keydown', keyDownHandler);
//       element.on('focus', focusHandler);

//       $scope.$on('$destroy', () => {
//         element.off('click', clickHandler);
//         element.off('keydown', keyDownHandler);
//         element.off('focus', focusHandler);
//       });

//       controller.element = element;
//     }
//   };
// };

// export const IowSelectSelectionTranscludeDirective: IDirectiveFactory = () => {
//   return {
//     link($scope: SelectionScope, element: JQuery, _attribute: IAttributes, _controller: any, transclude: ITranscludeFunction) {

//       let childScope: IScope;

//       $scope.$watch(() => $scope.$ctrl.ngModel, item => {
//         if (!childScope) {
//           transclude((clone, transclusionScope) => {
//             childScope = transclusionScope!;
//             (transclusionScope as any)[$scope.$ctrl.popupItemName] = item;
//             element.append(clone!);
//           });
//         } else {
//           (childScope as any)[$scope.$ctrl.popupItemName] = item;
//         }
//       });
//     }
//   };
// };

// export const IowSelectSelectableItemTranscludeDirective: IDirectiveFactory = () => {
//   return {
//     link($scope: SelectionScope, element: JQuery, _attribute: IAttributes, _controller: any, transclude: ITranscludeFunction) {
//       transclude((clone, transclusionScope) => {
//         (transclusionScope as any)[$scope.$ctrl.popupItemName] = ($scope as any)[$scope.$ctrl.popupItemName];
//         element.append(clone!);
//       });
//     }
//   };
// };


import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Placement as NgbPlacement } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

type Placement = NgbPlacement;

@Component({
  selector: 'iow-select',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => IowSelectComponent),
    multi: true
  }],
  template: `
    <div ngbDropdown  [placement]="placement">
      <button [id]="id + '_item_select'" class="btn btn-dropdown" ngbDropdownToggle>
        <span>{{translateOption(selection)}}</span>
      </button>

      <div ngbDropdownMenu>
        <button *ngFor="let option of options"
                [id]="option + '_' + id"
                (click)="select(option)"
                class="dropdown-item"
                [class.active]="isSelected(option)">
          {{translateOption(option)}}
        </button>
      </div>
    </div>
  `,
})
export class IowSelectComponent<T> implements ControlValueAccessor {
  @Input() ngModel: T;
  @Input() options: T[];
  @Input() id: string;
  @Input() placement: Placement = 'bottom-left';
  @Input() displayNameFormatter: (value: string, translateService: TranslateService) => string;

  selection: T;

  private propagateChange: (fn: any) => void = () => {};
  private propagateTouched: (fn: any) => void = () => {};

  constructor(private translateService: TranslateService) {}

  isSelected(option: T) {
    return this.selection === option;
  }

  select(option: T) {
    this.selection = option;
    this.propagateChange(option);
  }

  writeValue(obj: any): void {
    this.selection = obj;
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.propagateTouched = fn;
  }

  translateOption(value: string) {
    if(!value) {
      return;
    }
    if (this.displayNameFormatter) {
      return this.displayNameFormatter(value, this.translateService);
    } else {
      return this.translateService.instant(value);
    }
  }
}
