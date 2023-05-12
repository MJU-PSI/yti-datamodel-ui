// import { IModalService, IModalServiceInstance } from 'angular-ui-bootstrap';
// import { InteractiveHelp } from 'app/help/contract';
// import { InteractiveHelpDisplay } from 'app/help/components/interactiveHelpDisplay';
// import { labelNameToResourceIdIdentifier } from '@mju-psi/yti-common-ui';
// import { TranslateService } from '@ngx-translate/core';

// export class HelpSelectionModal {

//   constructor(private $uibModal: IModalService) {
//     'ngInject';
//   }

//   open(helps: InteractiveHelp[]) {
//     return this.$uibModal.open({
//       template: `
//         <div class="help-selection">

//           <div class="modal-header">
//             <h4 class="modal-title">
//               <a><i id="cancel_help_selection_button" ng-click="$dismiss('cancel')" class="fas fa-times"></i></a>
//               <span translate>Select help topic</span>
//             </h4>
//           </div>

//           <div class="modal-body full-height">
//             <div class="content-box scrolling">
//               <div class="search-results">
//                 <div id="{{$ctrl.getHelpLinkId(help.storyLine.title)}}" class="search-result" ng-repeat="help in $ctrl.helps" ng-click="$ctrl.startHelp(help)">
//                   <div class="content" ng-class="{last: $last}">
//                     <div class="title">{{help.storyLine.title | translate}}</div>
//                     <div class="body">{{help.storyLine.description | translate}}</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div class="modal-footer">
//             <button id="close_help_selection_button" class="btn btn-link" type="button" ng-click="$dismiss('cancel')" translate>Close</button>
//           </div>
//         </div>
//       `,
//       size: 'md',
//       controllerAs: '$ctrl',
//       controller: HelpSelectionModalController,
//       resolve: {
//         helps: () => helps
//       }
//     }).result;
//   }
// }

// class HelpSelectionModalController {

//   constructor(private $uibModalInstance: IModalServiceInstance,
//               public helps: InteractiveHelp[],
//               private interactiveHelpDisplay: InteractiveHelpDisplay,
//               private translateService: TranslateService) {
//     'ngInject';
//   }

//   startHelp(help: InteractiveHelp) {
//     this.$uibModalInstance.close();
//     this.interactiveHelpDisplay.open(help);
//   }

//   getHelpLinkId(title: string) {
//     return `${labelNameToResourceIdIdentifier(this.translateService.instant(title))}_help_link`;
//   }
// }


import { Component, Injectable } from '@angular/core';
import { NgbModal, NgbModalRef, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InteractiveHelp } from 'app/help/contract';
// import { InteractiveHelpDisplay } from 'app/help/components/interactiveHelpDisplay';
import { labelNameToResourceIdIdentifier } from '@mju-psi/yti-common-ui';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class HelpSelectionModal {

  constructor(private modalService: NgbModal,
              private translateService: TranslateService) {
  }

  open(helps: InteractiveHelp[]): Promise<void> {
    const modalRef: NgbModalRef = this.modalService.open(HelpSelectionModalComponent, { size: 'md' });
    modalRef.componentInstance.helps = helps;
    modalRef.componentInstance.getHelpLinkId = (title: string) => this.getHelpLinkId(title);
    modalRef.result.then(() => {}, () => {}); // dismiss callback
    return modalRef.result;
  }

  private getHelpLinkId(title: string): string {
    return `${labelNameToResourceIdIdentifier(this.translateService.instant(title))}_help_link`;
  }
}

@Component({
  selector: 'help-selection-modal',
  template: `
    <div class="help-selection">
      <div class="modal-header">
        <h4 class="modal-title">
          <a><i id="cancel_help_selection_button" (click)="modal.dismiss('cancel')" class="fas fa-times"></i></a>
          <span translate>Select help topic</span>
        </h4>
      </div>
      <div class="modal-body full-height">
        <div class="content-box scrolling">
          <div class="search-results">
            <div [id]="getHelpLinkId(help.storyLine.title)" class="search-result" *ngFor="let help of helps" (click)="startHelp(help)">
              <div class="content" [ngClass]="{ last: last }">
                <div class="title">{{ help.storyLine.title | translate }}</div>
                <div class="body">{{ help.storyLine.description | translate }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button id="close_help_selection_button" class="btn btn-link" type="button" (click)="modal.dismiss('cancel')" translate>Close</button>
      </div>
    </div>
  `
})
export class HelpSelectionModalComponent {

  public helps: InteractiveHelp[] = [];
  public getHelpLinkId: (title: string) => string;

  constructor(public modal: NgbActiveModal,
              // private interactiveHelpDisplay: InteractiveHelpDisplay
              ) {
  }

  startHelp(help: InteractiveHelp) {
    this.modal.close();
    // this.interactiveHelpDisplay.open(help);
  }

  get last() {
    return this.helps.indexOf(this.helps[this.helps.length - 1]) === this.helps.length - 1;
  }
}
