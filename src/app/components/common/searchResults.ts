// import { IAttributes, ICompiledExpression, IDirectiveFactory, IScope, ITranscludeFunction } from 'angular';
// import { gettextCatalog as GettextCatalog } from 'angular-gettext';
// import { ConfirmationModal } from './confirmationModal';
// import { Uri } from 'app/entities/uri';
// import { Exclusion } from 'app/utils/exclusion';
// import { WithId } from 'app/types/entity';
// import { LegacyComponent, modalCancelHandler } from 'app/utils/angular';
// import { labelNameToResourceIdIdentifier } from '@mju-psi/yti-common-ui';

// export abstract class AddNew {

//   id = Uri.randomUUID();

//   constructor(public label: string, public show: () => boolean, public glyphiconClass?: (string|{})[]) {
//   }

//   unwrap() {
//     return this;
//   }

//   isAddNew() {
//     return true;
//   }
// }

// class SearchResult<T extends WithId> {

//   disabled: boolean;

//   constructor(public item: T, public disabledReason: string|null) {
//     this.disabled = !!disabledReason;
//   }

//   get id() {
//     return this.item.id;
//   }

//   unwrap() {
//     return this.item;
//   }

//   isAddNew() {
//     return false;
//   }
// }

// @LegacyComponent({
//   bindings: {
//     items: '=',
//     selected: '=',
//     exclude: '=',
//     onSelect: '&',
//     editInProgress: '='
//   },
//   transclude: true,
//   template: require('./searchResults.html')
// })
// export class SearchResultsComponent<T extends WithId> {

//   items: (T|AddNew)[];
//   exclude: Exclusion<T>;
//   searchResults: (SearchResult<T>|AddNew)[];
//   selected: T|AddNew;
//   onSelect: ICompiledExpression;
//   editInProgress: () => boolean;

//   constructor(private $scope: IScope,
//               private $element: JQuery,
//               private gettextCatalog: GettextCatalog,
//               private confirmationModal: ConfirmationModal) {
//     'ngInject';
//   }

//   $onInit() {

//     this.$scope.$watchCollection(() => this.items, items => {

//       this.$element.parents('.search-results').animate({ scrollTop: 0 }, 0);

//       this.searchResults = (items || []).map(item => {
//         if (item instanceof AddNew) {
//           return item;
//         } else {
//           const disabledReason = this.exclude && this.exclude(item);
//           return new SearchResult(item, disabledReason);
//         }
//       });
//     });
//   }

//   isVisible(item: SearchResult<T>|AddNew) {
//     if (item instanceof AddNew) {
//       return item.show();
//     } else {
//       return true;
//     }
//   }

//   isSelected(item: SearchResult<T>|AddNew) {
//     return this.selected === item.unwrap();
//   }

//   selectItem(item: SearchResult<T>|AddNew) {
//     const doSelection = () => {
//       this.selected = item.unwrap();
//       this.onSelect({item: this.selected});
//     };

//     if (this.editInProgress && this.editInProgress()) {
//       this.confirmationModal.openEditInProgress().then(doSelection, modalCancelHandler);
//     } else {
//       doSelection();
//     }
//   }

//   title(item: SearchResult<T>|AddNew) {
//     if (item instanceof SearchResult && item.disabled) {
//       return this.gettextCatalog.getString(item.disabledReason!);
//     } else {
//       return null;
//     }
//   }

//   generateSearchResultID(item: SearchResult<T>|AddNew): string {
//     return item.isAddNew() ? `${'create_new_'}${labelNameToResourceIdIdentifier((item as AddNew).label)}${'_link'}`
//                            : `${item.id.toString()}${'_search_result_link'}`;
//   }
// }

// interface SearchResultScope extends IScope {
//   searchResult: SearchResult<any>;
// }

// export const SearchResultTranscludeDirective: IDirectiveFactory = () => {
//   return {
//     link($scope: SearchResultScope, element: JQuery, _attribute: IAttributes, _ctrl: any, transclude: ITranscludeFunction) {
//       transclude((clone, transclusionScope) => {
//         (transclusionScope as SearchResultScope).searchResult = $scope.searchResult.item;
//         element.append(clone!);
//       });
//     }
//   };
// };

import { Component, Input, Output, EventEmitter, Directive, TemplateRef, ViewContainerRef, ContentChild } from '@angular/core';
import { ConfirmationModal } from './confirmationModal';
import { Uri } from 'app/entities/uri';
import { Exclusion } from 'app/utils/exclusion';
import { WithId } from 'app/types/entity';
import { modalCancelHandler } from 'app/utils/angular';
import { labelNameToResourceIdIdentifier } from '@mju-psi/yti-common-ui';
import { TranslateService } from '@ngx-translate/core';

@Directive({
  selector: '[searchResultContent]'
})
export class SearchResultContentDirective<T extends WithId> {

  // @Input('searchResultContent')
  // set searchResult(value: SearchResult<T>) {
  //   this.viewRef.clear();
  //   this.viewRef.createEmbeddedView(this.templateRef, {
  //     searchResult: value,
  //   });
  // }
  // constructor(public templateRef: TemplateRef<any>, private viewRef: ViewContainerRef) {}
  constructor(public templateRef: TemplateRef<any>) {}
}


export abstract class AddNew {

  id = Uri.randomUUID();

  constructor(public label: string, public show: () => boolean, public glyphiconClass?: (string | {})[]) {
  }

  unwrap() {
    return this;
  }

  isAddNew() {
    return true;
  }
}

class SearchResult<T extends WithId> {

  disabled: boolean;

  constructor(public item: T, public disabledReason: string | null) {
    this.disabled = !!disabledReason;
  }

  get id() {
    return this.item.id;
  }

  unwrap() {
    return this.item;
  }

  isAddNew() {
    return false;
  }
}

@Component({
  selector: 'search-results',
  templateUrl: './searchResults.html'
})
export class SearchResultsComponent<T extends WithId> {
  @Input() items!: (T | AddNew)[];
  @Input() exclude!: Exclusion<T>;
  @Input() selected!: T | AddNew;
  @Input() editInProgress!: () => boolean;
  // @Output() onSelect = new EventEmitter<{item: T | AddNew}>();
  @Output() onSelect = new EventEmitter<T | AddNew>();

  @ContentChild(SearchResultContentDirective) content!: SearchResultContentDirective<T>;

  searchResults: (SearchResult<T> | AddNew)[];
  id = Uri.randomUUID();

  constructor(private translateService: TranslateService, private confirmationModal: ConfirmationModal) { }

  ngOnInit() {
    this.generateSearchResults();
  }

  ngOnChanges() {
    this.generateSearchResults();
  }

  generateSearchResults() {
    this.searchResults = (this.items || []).map(item => {
      if (item instanceof AddNew) {
        return item;
      } else {
        const disabledReason = this.exclude && this.exclude(item);
        const a = new SearchResult(item, disabledReason);
        return a;
      }
    });
  }

  isVisible(item: SearchResult<T> | AddNew) {
    if (item instanceof AddNew) {
      return item.show();
    } else {
      return true;
    }
  }

  isSelected(item: SearchResult<T> | AddNew) {
    return this.selected === item.unwrap();
  }

  selectItem(item: SearchResult<T> | AddNew) {
    const doSelection = () => {
      this.selected = item.unwrap();
      // this.onSelect.emit({ item: this.selected });
      this.onSelect.emit( this.selected);
    };

    if (this.editInProgress && this.editInProgress()) {
      this.confirmationModal.openEditInProgress().then(doSelection, modalCancelHandler);
    } else {
      doSelection();
    }
  }

  title(item: SearchResult<T> | AddNew) {
    if (item instanceof SearchResult && item.disabled) {
      return this.translateService.instant(item.disabledReason!);
    } else {
      return null;
    }
  }

  generateSearchResultID(item: SearchResult<T> | AddNew): string {
    return item.isAddNew() ? `${ 'create_new_' }${ labelNameToResourceIdIdentifier((item as AddNew).label) }${ '_link' }`
    : `${ item.id.toString() }${ '_search_result_link' }`;
  }
}


// @Directive({
//   selector: '[appSearchResultTransclude]'
// })
// export class SearchResultTranscludeDirective<T> {
//   @Input('appSearchResultTransclude') searchResult: SearchResult<T>;

//   constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef) {}

//   ngOnChanges() {
//     this.viewContainer.clear();
//     const viewRef = this.viewContainer.createEmbeddedView(this.templateRef, {
//       $implicit: this.searchResult.item
//     });
//     viewRef.detectChanges();
//   }
// }


interface SearchResultScope<T extends WithId> {
  searchResult: SearchResult<T>;
}

@Directive({
  selector: '[searchResultTransclude]'
})
export class SearchResultTranscludeDirective<T extends WithId> {
  @Input('searchResultTransclude') set searchResult(value: SearchResult<T>) {
    this.viewRef.clear();
    this.viewRef.createEmbeddedView(this.templateRef, {
      searchResult: value,
    });
  }

  constructor(private templateRef: TemplateRef<SearchResultScope<T>>, private viewRef: ViewContainerRef) { }
}



