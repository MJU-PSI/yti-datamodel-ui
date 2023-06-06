// import { IScope } from 'angular';
// import { InteractiveHelpService } from 'app/help/services/interactiveHelpService';
// import { NgZone } from '@angular/core';
// import { LegacyDirective } from 'app/utils/angular';

// @LegacyDirective({
//   restrict: 'A',
//   bindToController: {
//     float: '@',
//     snap: '@',
//     always: '@',
//     width: '@'
//   }
// })
// export class FloatDirective {

//   float: string;
//   snap: string;
//   always: string;
//   width: string;

//   placeholder: JQuery;

//   elementStaticPosition: {
//     left: number;
//     top: number;
//   };

//   floating = false;
//   enabled = true;

//   constructor(private $scope: IScope,
//               private $element: JQuery,
//               private interactiveHelpService: InteractiveHelpService,
//               private zone: NgZone) {
//     'ngInject';
//   }

//   $postLink() {

//     const placeholderClass = this.float;
//     this.elementStaticPosition = this.$element.offset();

//     this.placeholder =
//       jQuery(document.createElement('div'))
//         .hide()
//         .addClass(placeholderClass)
//         .insertBefore(this.$element);

//     let timeoutId: any = null;

//     const snap = (destination: number ) => {

//       const diff = destination - window.pageYOffset;

//       if (Math.abs(diff) < 3) {
//         scrollTo(window.pageXOffset, destination + 1);
//       } else if (diff < 80 && diff > 0) {
//         scrollTo(window.pageXOffset, window.pageYOffset + ((destination - window.pageYOffset) / 2));
//         setTimeout(snap, 20, destination);
//       }
//     };

//     const scrollHandler = () => {

//       if (this.shouldSnap()) {
//         if (timeoutId) {
//           clearTimeout(timeoutId);
//         }

//         timeoutId = setTimeout(snap, 200, this.elementStaticPosition.top);
//       }

//       if (!this.floating) {
//         const offset = this.$element.offset();

//         if (offset.top > 0) {
//           // re-refresh has to be done since location can change due to accordion etc
//           this.elementStaticPosition = this.$element.offset();
//         }
//       }

//       if (this.isInitialized()) {
//         if (this.floating) {
//           if (this.isStaticPosition()) {
//             this.setStatic();
//             this.$scope.$apply();
//           }
//         } else {
//           if (this.enabled && this.isFloatingPosition()) {
//             this.setFloating();
//             this.$scope.$apply();
//           }
//         }
//       }
//     };

//     this.zone.runOutsideAngular(() => {
//       window.addEventListener('scroll', scrollHandler, true);
//     });

//     this.$scope.$on('$destroy', () => {
//       window.removeEventListener('scroll', scrollHandler);
//     });
//   }

//   isFloatingPosition() {
//     return window.pageYOffset >= this.elementStaticPosition.top;
//   }

//   isStaticPosition() {
//     return window.pageYOffset < this.elementStaticPosition.top;
//   }

//   shouldSnap() {
//     return this.interactiveHelpService.isClosed() && this.snap === 'true';
//   }

//   isInitialized() {
//     return this.elementStaticPosition.top > 0;
//   }

//   setFloating() {
//     this.floating = true;
//     const width = this.width || this.$element.outerWidth() + 'px';

//     this.placeholder.css({
//       width: width,
//       height: this.$element.outerHeight() + 'px'
//     });

//     this.$element.css({
//       top: 0,
//       width: width
//     });

//     this.$element.addClass('floating');

//     if (this.always) {
//       this.$element.addClass('always');
//     }

//     if (this.enabled) {
//       this.placeholder.show();
//     }
//   }

//   setStatic() {
//     this.floating = false;
//     this.$element.css('top', '');
//     this.$element.css('width', this.width || '');

//     this.$element.removeClass('floating');

//     if (this.always) {
//       this.$element.removeClass('always');
//     }

//     this.placeholder.hide();
//   }
// }

import { Directive, ElementRef, OnDestroy, AfterViewInit, NgZone, Input } from '@angular/core';
import { requireDefined } from '@mju-psi/yti-common-ui';

interface Location {
  left: number;
  top: number;
}

@Directive({ selector: '[appFloat]' })
export class FloatDirective implements AfterViewInit, OnDestroy {

  @Input() setWidth = true;

  element: HTMLElement;
  placeholder: HTMLElement;

  floating = false;
  elementStaticLocation: Location;

  constructor(element: ElementRef, private zone: NgZone) {
    this.element = element.nativeElement as HTMLElement;
  }

  ngAfterViewInit() {

    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.onWindowScroll);
    });

    this.elementStaticLocation = this.calculateElementLocation();

    const placeholder = document.createElement('div');
    placeholder.hidden = true;

    requireDefined(this.element.parentElement).insertBefore(placeholder, this.element);

    this.placeholder = placeholder;
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.onWindowScroll);
    requireDefined(this.placeholder.parentElement).removeChild(this.placeholder);
  }

  calculateElementLocation(): Location {
    const rect = this.element.getBoundingClientRect();

    return {
      left: rect.left + window.pageXOffset,
      top: rect.top + window.pageYOffset
    }
  }

  isFloatingPosition() {
    return window.pageYOffset > this.elementStaticLocation.top;
  }

  isStaticPosition() {
    return window.pageYOffset <= this.elementStaticLocation.top;
  }

  isInitialized() {
    return this.elementStaticLocation.top > 0;
  }

  setFloating() {
    this.floating = true;

    const rect = this.element.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    this.placeholder.style.width = width + 'px';
    this.placeholder.style.height = height + 'px';

    this.element.style.top = '0';

    if (this.setWidth) {
      this.element.style.width = width + 'px';
    }

    this.element.classList.add('floating');
  }

  setStatic() {
    this.floating = false;
    this.element.style.top = '';

    if (this.setWidth) {
      this.element.style.width = '';
    }

    this.element.classList.remove('floating');
    this.placeholder.hidden = true;
  }

  onWindowScroll = () => {

    if (!this.floating) {

      const location = this.calculateElementLocation();

      if (location.top > 0) {
        // re-refresh has to be done since location can change due to accordion etc
        this.elementStaticLocation = location;
      }
    }

    if (this.isInitialized()) {
      if (this.floating) {
        if (this.isStaticPosition()) {
          this.setStatic();
        }
      } else {
        if (this.isFloatingPosition()) {
          this.setFloating();
        }
      }
    }
  }
}
