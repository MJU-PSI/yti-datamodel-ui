// import { IRepeatScope, IScope, ITimeoutService } from 'angular';
// import { arrowDown, arrowUp, enter, pageDown, pageUp } from '@mju-psi/yti-common-ui';
// import { LegacyDirective, scrollToElement } from 'app/utils/angular';

// @LegacyDirective({
//   restrict: 'A'
// })
// export class KeyControlDirective {

//   itemCount = 0;
//   selectionIndex = -1;

//   private keyEventHandlers: {[key: number]: () => void} = {
//     [arrowDown]: () => this.moveSelection(1),
//     [arrowUp]: () => this.moveSelection(-1),
//     [pageDown]: () => this.moveSelection(10),
//     [pageUp]: () => this.moveSelection(-10),
//     [enter]: () => this.selectSelection()
//   };

//   constructor(private $scope: IScope,
//               private $element: JQuery) {
//     'ngInject';
//   }

//   $postLink() {
//     this.$element.on('keydown', event => this.keyPressed(event));
//     this.$scope.$watch(this.$element.attr('key-control') + '.length', (items: number) => this.onItemsChange(items || 0));
//   }

//   onItemsChange(itemCount: number) {
//     this.itemCount = itemCount;
//     this.setSelection(-1);
//   }

//   keyPressed(event: JQueryEventObject) {
//     const handler = this.keyEventHandlers[event.keyCode];
//     if (handler) {
//       event.preventDefault();
//       handler();
//     }
//   }

//   private moveSelection(offset: number) {
//     this.setSelection(Math.max(Math.min(this.selectionIndex + offset, this.itemCount - 1), -1));
//   }

//   private setSelection(index: number) {
//     this.selectionIndex = index;
//     this.$scope.$parent.$broadcast('selectionMoved', this.selectionIndex);
//   }

//   private selectSelection() {
//     this.$scope.$parent.$broadcast('selectionSelected', this.selectionIndex);
//   }
// }

// const selectionClass = 'active';


// @LegacyDirective({
//   restrict: 'A'
// })
// export class KeyControlSelectionDirective {

//   constructor(private $scope: IRepeatScope,
//               private $element: JQuery,
//               private $timeout: ITimeoutService) {
//     'ngInject';
//   }

//   $postLink() {

//     this.$scope.$on('selectionMoved', (_event, selectionIndex) => this.update(selectionIndex));
//     this.$scope.$on('selectionSelected', (_event, selectionIndex) => {
//       if (selectionIndex === this.$scope.$index) {
//         // do outside of digest cycle
//         this.$timeout(() => this.$element.click());
//       }
//     });
//   }

//   update(selectionIndex: number) {
//     if (this.$scope.$index === selectionIndex) {
//       this.$element.addClass(selectionClass);
//       scrollToElement(this.$element, this.findParent());
//     } else {
//       this.$element.removeClass(selectionClass);
//     }
//   }

//   findParent() {
//     const parent = this.$element.parent();
//     if (parent.is('search-results')) {
//       return parent.parent();
//     } else {
//       return parent;
//     }
//   }
// }

import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';
import { fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { arrowDown, arrowUp, enter, pageDown, pageUp } from '@mju-psi/yti-common-ui';
import { scrollToElement } from 'app/utils/angular';

const selectionClass = 'active';

@Directive({
  selector: '[keyControl]'
})
export class KeyControlDirective {

  private itemCount = 0;
  private selectionIndex = -1;

  private readonly keyEventHandlers: {[key: number]: () => void; [key: string]: any} = {
    [arrowDown]: () => this.moveSelection(1),
    [arrowUp]: () => this.moveSelection(-1),
    [pageDown]: () => this.moveSelection(10),
    [pageUp]: () => this.moveSelection(-10),
    [enter]: () => this.selectSelection()
  };

  constructor(private elementRef: ElementRef) { }

  @Input('keyControl')
  set itemCountValue(value: number) {
    this.itemCount = value;
    this.setSelection(-1);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const handler = this.keyEventHandlers[event.keyCode];
    if (handler) {
      event.preventDefault();
      handler();
    }
  }

  private moveSelection(offset: number) {
    this.setSelection(Math.max(Math.min(this.selectionIndex + offset, this.itemCount - 1), -1));
  }

  private setSelection(index: number) {
    this.selectionIndex = index;
    this.elementRef.nativeElement.dispatchEvent(new CustomEvent('selectionMoved', { detail: this.selectionIndex }));
  }

  private selectSelection() {
    this.elementRef.nativeElement.dispatchEvent(new CustomEvent('selectionSelected', { detail: this.selectionIndex }));
  }
}

@Directive({
  selector: '[keyControlSelection]'
})
export class KeyControlSelectionDirective {

  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

  ngAfterViewInit() {
    fromEvent<CustomEvent>(this.elementRef.nativeElement, 'selectionMoved')
      .pipe(takeUntil(fromEvent<CustomEvent>(this.elementRef.nativeElement, 'selectionSelected')))
      .subscribe((event) => {
        this.update(event.detail);
      });

    fromEvent<CustomEvent>(this.elementRef.nativeElement, 'selectionSelected')
      .pipe(takeUntil(fromEvent<CustomEvent>(this.elementRef.nativeElement, 'selectionMoved')))
      .subscribe((event) => {
        if (event.detail === this.index) {
          this.elementRef.nativeElement.click();
        }
      });
  }

  get index() {
    return this.elementRef.nativeElement.getAttribute('index');
  }

  private update(selectionIndex: number) {
    if (Number(this.index) === selectionIndex) {
      this.elementRef.nativeElement.classList.add(selectionClass);
      scrollToElement(this.renderer, this.elementRef, this.findParent());
    } else {
      this.elementRef.nativeElement.classList.remove(selectionClass);
    }
  }

  private findParent() {
    const parent = this.elementRef.nativeElement.parentElement;
    if (parent.nodeName.toLowerCase() === 'search-results') {
      return parent.parentElement;
    } else {
      return parent;
    }
  }
}
