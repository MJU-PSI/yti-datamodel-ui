// import { IScope, IWindowService } from 'angular';
// import { SessionService } from 'app/services/sessionService';
// import { NgZone } from '@angular/core';
// import { LegacyComponent } from 'app/utils/angular';

// const modelPanelLeft = 350;
// const minSelectionWidth = 520;
// const normalSelectionWidth = 720;
// const minVisualizationWidth = 321;

// @LegacyComponent({
//   bindings: {
//     selectionWidth: '='
//   },
//   template: `<div class="divider" ng-mousedown="$ctrl.moveDivider($event)"></div>`
// })
// export class DividerComponent {

//   selectionWidth: number;

//   constructor(private $scope: IScope,
//               private $window: IWindowService,
//               private zone: NgZone,
//               private sessionService: SessionService) {
//     'ngInject';
//   }

//   $onInit() {

//     this.initWidth();

//     const onResize = () => {
//       this.initWidth();
//       this.$scope.$apply();
//     };

//     this.zone.runOutsideAngular(() => {
//       this.$window.addEventListener('resize', onResize);
//     });

//     this.$scope.$on('$destroy', () => this.$window.removeEventListener('resize', onResize));
//   }

//   initWidth() {
//     this.selectionWidth = Math.min(this.maxWidth - minVisualizationWidth, this.sessionService.selectionWidth || normalSelectionWidth);
//   }

//   get maxWidth() {
//     return this.$window.innerWidth - modelPanelLeft;
//   }

//   moveDivider(mouseDown: MouseEvent) {

//     mouseDown.preventDefault();

//     const offset = mouseDown.clientX - this.selectionWidth;
//     const maxWidth = this.maxWidth;

//     const onMouseMove = (event: MouseEvent) => {
//       const newWidth = event.clientX - offset;

//       if ((newWidth >= minSelectionWidth && newWidth < this.selectionWidth)
//         || (newWidth <= (maxWidth - minVisualizationWidth) && newWidth > this.selectionWidth)) {
//         this.sessionService.selectionWidth = newWidth;
//         this.selectionWidth = newWidth;
//         this.$scope.$apply();
//       }
//     };

//     const onMouseUp = () => {
//       this.$window.removeEventListener('mousemove', onMouseMove);
//       this.$window.removeEventListener('mouseup', onMouseUp);
//     };

//     this.zone.runOutsideAngular(() => {
//       this.$window.addEventListener('mousemove', onMouseMove);
//       this.$window.addEventListener('mouseup', onMouseUp);
//     });
//   }
// }


import { Component, HostListener } from '@angular/core';
import { SessionService } from 'app/services/sessionService';

const leftWidth = 400;
const minSelectionWidth = 300;
const minVisualizationWidth = 361;
const minMaxIconWidth = 52;

@Component({
  selector: 'divider',
  template: `<div class="divider" id="divider_div" (mousedown)="moveDivider($event)"></div>`,
})
export class DividerComponent {

  constructor(private sessionService: SessionService) {
    this.setConstrainedSelectionWidth(this.sessionService.selectionWidth);
  }

  get selectionWidth() {
    return this.sessionService.selectionWidth;
  }

  set selectionWidth(value: number) {
    this.sessionService.selectionWidth = value;
  }

  @HostListener('window:resize')
  onResize() {
    this.setConstrainedSelectionWidth(this.selectionWidth);
  }

  setConstrainedSelectionWidth(selectionWidth: number) {
    const maxSelectionWidth = DividerComponent.maxWidth - minVisualizationWidth;
    this.selectionWidth = Math.max(minSelectionWidth, Math.min(maxSelectionWidth, selectionWidth));
  }

  static get maxWidth() {
    return document.body.clientWidth - leftWidth - minMaxIconWidth;
  }

  moveDivider(mouseDown: MouseEvent) {

    mouseDown.preventDefault();

    const offset = mouseDown.clientX - this.selectionWidth;

    const onMouseMove = (event: MouseEvent) => {
      this.setConstrainedSelectionWidth(event.clientX - offset)
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }
}
