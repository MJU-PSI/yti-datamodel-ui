// import { IScope, ITimeoutService } from 'angular';
// import { hasLocalization } from 'app/utils/language';
// import { Coordinate } from 'app/types/visualization';
// import { Localizable } from '@mju-psi/yti-common-ui';
// import { LanguageContext } from 'app/types/language';
// import { LegacyComponent } from 'app/utils/angular';

// export interface VisualizationPopoverDetails {
//   coordinate: Coordinate;
//   heading: Localizable;
//   comment: Localizable;
// }

// @LegacyComponent({
//   bindings: {
//     details: '=',
//     context: '='
//   },
//   template: `
//        <div class="popover fade show bs-popover-left" ng-style="$ctrl.style">
//          <div class="arrow" ng-style="{ top: $ctrl.arrowTopOffset }"></div>
//          <div class="popover-header">
//            <h4 class="mb-0">{{$ctrl.details.heading | translateValue: $ctrl.context}}</h4>
//          </div>
//          <div class="popover-body">
//            {{$ctrl.details.comment | translateValue: $ctrl.context}}
//          </div>
//        </div>
//   `
// })
// export class VisualizationPopoverComponent {
//   details: VisualizationPopoverDetails;
//   context: LanguageContext;

//   style: any = {};

//   constructor(private $scope: IScope,
//               private $timeout: ITimeoutService,
//               private $element: JQuery) {
//     'ngInject';
//   }

//   $onInit() {
//     this.$scope.$watch(() => this.details, details => {
//       // Hide by keeping off screen absolute position
//       this.style = { top: -10000 + 'px',  left: -10000 + 'px' };

//       if (details && hasLocalization(details.comment)) {
//         this.style.comment = details.comment;

//         // Let the comment render before accessing calculated dimensions
//         this.$timeout(() => {
//           const dimensions = this.getDimensions();
//           const offset = this.visualizationOffset();
//           this.style.top = (details.coordinate.y - offset.y - (dimensions.height / 2)) + 'px';
//           this.style.left = (details.coordinate.x - offset.x - dimensions.width - 15) + 'px';
//         });
//       }
//     });
//   }

//   getDimensions() {

//     const popoverElement = this.$element.find('.popover');

//     return {
//       width: popoverElement.outerWidth(),
//       height: popoverElement.outerHeight()
//     };
//   }

//   visualizationOffset() {

//     const classVisualizationElement = this.$element.closest('class-visualization');

//     return {
//       x: classVisualizationElement.offset().left,
//       y: classVisualizationElement.offset().top
//     };
//   }

//   get arrowTopOffset() {
//     return this.getDimensions().height / 2;
//   }
// }

import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, OnInit, HostBinding } from '@angular/core';
import { hasLocalization } from 'app/utils/language';
import { Coordinate } from 'app/types/visualization';
import { Localizable } from '@mju-psi/yti-common-ui';
import { LanguageContext } from 'app/types/language';

export interface VisualizationPopoverDetails {
  coordinate: Coordinate;
  heading: Localizable;
  comment: Localizable;
}

@Component({
  selector: 'visualization-popover',
  template: `
    <div class="popover fade show bs-popover-left" [ngStyle]="style" #popover>
      <div class="arrow" [ngStyle]="{ top: arrowTopOffset }"></div>
      <div class="popover-header">
        <h4 class="mb-0">{{ details?.heading | translateValue: context }}</h4>
      </div>
      <div class="popover-body">
        {{ details?.comment | translateValue: context }}
      </div>
    </div>
  `
})
export class VisualizationPopoverComponent implements OnInit, OnChanges {
  @Input() details: VisualizationPopoverDetails;
  @Input() context: LanguageContext;

  @HostBinding('class.popover')
  @HostBinding('class.fade')
  @HostBinding('class.show')
  popoverClass = true;

  style: any = {};
  @ViewChild('popover', { static: true }) popoverElement: ElementRef;

  ngOnInit() {
    this.updateStyle();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.details) {
      this.updateStyle();
    }
  }

  private updateStyle() {
    this.style = { top: '-10000px', left: '-10000px' };

    if (this.details && hasLocalization(this.details.comment)) {
      this.style.comment = this.details.comment;

      setTimeout(() => {
        const dimensions = this.getDimensions();
        const offset = this.visualizationOffset();
        this.style.top = (this.details.coordinate.y - offset.y - (dimensions.height / 2)) + 'px';
        this.style.left = (this.details.coordinate.x - offset.x - dimensions.width - 15) + 'px';
      });
    }
  }

  private getDimensions() {
    const popoverElement = this.popoverElement.nativeElement;
    return {
      width: popoverElement.offsetWidth,
      height: popoverElement.offsetHeight
    };
  }

  private visualizationOffset() {
    const classVisualizationElement = this.popoverElement.nativeElement.closest('class-visualization');
    return {
      x: classVisualizationElement.offsetLeft,
      y: classVisualizationElement.offsetTop
    };
  }

  get arrowTopOffset() {
    return this.getDimensions().height / 2 + 'px';
  }
}
