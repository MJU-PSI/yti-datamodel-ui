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

import { Directive, ElementRef, HostListener, Input, NgZone, Renderer2 } from '@angular/core';
import { InteractiveHelpService } from 'app/help/services/interactiveHelpService';

@Directive({
  selector: '[float]',
})
export class FloatDirective {

  @Input() float: string;
  @Input() snap: string;
  @Input() always: string;
  @Input() width: string;

  placeholder: HTMLElement;

  elementStaticPosition: {
    left: number;
    top: number;
  };

  floating = false;
  enabled = true;
  timeoutId: any = null;

  constructor(private el: ElementRef,
              private renderer: Renderer2
              // private interactiveHelpService: InteractiveHelpService,
             ) {}

  ngAfterViewInit() {

    const placeholderClass = this.float;
    this.elementStaticPosition = this.el.nativeElement.getBoundingClientRect();

    this.placeholder = this.renderer.createElement('div');
    if (placeholderClass.trim() !== '') {
      this.renderer.addClass(this.placeholder, placeholderClass);
    }
    this.renderer.setStyle(this.placeholder, 'display', 'none');
    this.renderer.insertBefore(this.el.nativeElement.parentNode, this.placeholder, this.el.nativeElement);
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    const snap = (destination: number ) => {
      const diff = destination - window.pageYOffset;
      if (Math.abs(diff) < 3) {
        scrollTo(window.pageXOffset, destination + 1);
      } else if (diff < 80 && diff > 0) {
        scrollTo(window.pageXOffset, window.pageYOffset + ((destination - window.pageYOffset) / 2));
        setTimeout(snap, 20, destination);
      }
    };

    if (this.shouldSnap()) {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }

      this.timeoutId = setTimeout(snap, 200, this.elementStaticPosition.top);
    }

    if (!this.floating) {
      const offset = this.el.nativeElement.getBoundingClientRect();

      if (offset.top > 0) {
        // re-refresh has to be done since location can change due to accordion etc
        this.elementStaticPosition = offset;
      }
    }

    if (this.isInitialized()) {
      if (this.floating) {
        if (this.isStaticPosition()) {
          this.setStatic();
        }
      } else {
        if (this.enabled && this.isFloatingPosition()) {
          this.setFloating();
        }
      }
    }
  }

  isFloatingPosition() {
    return window.pageYOffset >= this.elementStaticPosition.top;
  }

  isStaticPosition() {
    return window.pageYOffset < this.elementStaticPosition.top;
  }

  shouldSnap() {
    // return this.interactiveHelpService.isClosed() && this.snap === 'true';
    return true;
  }

  isInitialized() {
    return this.elementStaticPosition.top > 0;
  }

  setFloating() {
    this.floating = true;
    const width = (this.width || this.el.nativeElement.clientWidth) + 'px';

    this.placeholder.style.width = width;
    this.placeholder.style.height = this.el.nativeElement.offsetHeight + 'px';

    this.renderer.setStyle(this.el.nativeElement, 'top', '0');
    this.renderer.setStyle(this.el.nativeElement, 'width', width);

    this.renderer.addClass(this.el.nativeElement, 'floating');

    if (this.always) {
      this.renderer.addClass(this.el.nativeElement, 'always');
    }

    if (this.enabled) {
      this.placeholder.style.display = 'block';
    }
  }

  setStatic() {
    this.floating = false;
    this.renderer.setStyle(this.el.nativeElement, 'top', '');
    this.renderer.setStyle(this.el.nativeElement, 'width', this.width || '');

    this.renderer.addClass(this.el.nativeElement, 'floating');

    if (this.always) {
      this.renderer.addClass(this.el.nativeElement, 'always');
    }

    this.placeholder.style.display = 'none';
  }
}
