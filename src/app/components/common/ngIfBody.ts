// import { IAttributes, IDirectiveFactory, IDocumentService, IScope, ITranscludeFunction } from 'angular';

// interface NgIfBodyAttributes extends IAttributes {
//   ngIfBody: string;
// }

// export const NgIfBodyDirective: IDirectiveFactory = ($document: IDocumentService) => {
//   'ngInject';
//   return {
//     transclude: 'element',
//     priority: 600,
//     terminal: true,
//     restrict: 'A',
//     link($scope: IScope, _element: JQuery, attributes: NgIfBodyAttributes, _ctrls: any, $transclude: ITranscludeFunction) {

//       let childScope: IScope | undefined | null;
//       let previousElement: JQuery | undefined | null;

//       const body = jQuery($document.find('body'));

//       function cleanFromBody() {
//         if (previousElement) {
//           previousElement.remove();
//           previousElement = null;
//         }

//         if (childScope) {
//           childScope.$destroy();
//           childScope = null;
//         }
//       }

//       $scope.$watch(attributes.ngIfBody, (value) => {
//         if (value) {
//           if (!childScope) {
//             // append to body
//             $transclude((clone, newScope) => {
//               body.append(clone!);
//               previousElement = clone;
//               childScope = newScope;
//             });
//           }
//         } else {
//           cleanFromBody();
//         }
//       });

//       $scope.$on('$destroy', cleanFromBody);
//     }
//   };
// };

import {
  Directive,
  Inject,
  InjectionToken,
  Input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

interface NgIfBodyAttributes {
  ngIfBody: string;
}

@Directive({
  selector: '[ngIfBody]',
})
export class NgIfBodyDirective {
  private childViewRef: any = null;
  private previousElement: any = null;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  @Input()
  set ngIfBody(condition: any) {
    if (condition) {
      if (!this.childViewRef) {
        // create new view
        this.childViewRef = this.viewContainerRef.createEmbeddedView(
          this.templateRef
        );
        // append to body
        this.previousElement = this.childViewRef.rootNodes[0];
        this.document.body.appendChild(this.previousElement);
      }
    } else {
      if (this.childViewRef) {
        // remove view from container
        this.viewContainerRef.clear();
        // remove element from body
        this.previousElement.remove();
        this.previousElement = null;
        this.childViewRef = null;
      }
    }
  }

  ngOnDestroy() {
    if (this.childViewRef) {
      // remove element from body
      this.previousElement.remove();
      this.previousElement = null;
      this.childViewRef = null;
    }
  }
}
