// import { InteractiveHelp, StoryLine } from 'app/help/contract';
// import { ILocationService, IQService } from 'angular';
// import { IModalStackService } from 'angular-ui-bootstrap';
// import { EntityLoader, EntityLoaderService } from 'app/services/entityLoader';
// import { InteractiveHelpService } from 'app/help/services/interactiveHelpService';
// import { identity } from '@mju-psi/yti-common-ui';
// import { gettextCatalog as GettextCatalog } from 'angular-gettext';
// import { helpImportedLibrary, helpOrganization, helpVocabulary } from 'app/help/providers/data';

// export interface NavigationEvents {
//   onStart?: string;
//   onEnd?: string;
// }

// export class HelpBuilderService {

//   constructor(private $location: ILocationService,
//               private $uibModalStack: IModalStackService,
//               private $q: IQService,
//               private gettextCatalog: GettextCatalog,
//               private entityLoaderService: EntityLoaderService) {
//     'ngInject';
//   }

//   create(navigation: NavigationEvents): HelpBuilder {
//     return new HelpBuilder(this.$location, this.$uibModalStack, this.$q, this.gettextCatalog, this.entityLoaderService, navigation);
//   }
// }

// export class HelpBuilder {

//   helps: InteractiveHelp[] = [];

//   constructor(private $location: ILocationService,
//               private $uibModalStack: IModalStackService,
//               private $q: IQService,
//               private gettextCatalog: GettextCatalog,
//               private entityLoaderService: EntityLoaderService,
//               private navigation: NavigationEvents) {
//   }

//   add(storyLine: StoryLine, initializer: (loader: EntityLoader) => void) {

//     this.helps.push({
//       storyLine,
//       onInit: (service: InteractiveHelpService) => {
//         return service.reset()
//           .then(() => {

//             const loader = this.entityLoaderService.create(false);

//             // default data for all helps
//             return this.$q.all([
//               loader.createVocabularyWithConcepts(helpVocabulary),
//               loader.createOrganization(helpOrganization)
//             ])
//               .then(() => loader.createModelWithResources(helpImportedLibrary))
//               .then(() => {
//                 initializer(loader);
//                 return loader.result;
//               });
//           })
//           .then(identity, err => {
//             console.log(err);
//             throw err;
//           })
//           .then(() => this.navigate(this.navigation.onStart));
//       },
//       onComplete: () => this.navigate(this.navigation.onEnd),
//       onCancel: () => this.navigate(this.navigation.onEnd)
//     });
//   };

//   private navigate(url?: string) {

//     this.$uibModalStack.dismissAll();

//     if (url) {
//       this.$location.url(url);
//       return true;
//     } else {
//       return false;
//     }
//   };
// }


import { InteractiveHelp, StoryLine } from 'app/help/contract';
import { EntityLoader, EntityLoaderService } from 'app/services/entityLoader';
import { InteractiveHelpService } from 'app/help/services/interactiveHelpService';
import { identity } from '@mju-psi/yti-common-ui';
import { helpImportedLibrary, helpOrganization, helpVocabulary } from 'app/help/providers/data';
import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { NgbModalStack } from '@ng-bootstrap/ng-bootstrap/modal/modal-stack';


export interface NavigationEvents {
  onStart?: string;
  onEnd?: string;
}

@Injectable({
  providedIn: 'root'
})
export class HelpBuilderService {

  constructor(
    private location: Location,
    private modalStack: NgbModalStack,
    private entityLoaderService: EntityLoaderService
  ) {}

  create(navigation: NavigationEvents): HelpBuilder {
    return new HelpBuilder(this.location, this.modalStack, this.entityLoaderService, navigation);
  }
}

export class HelpBuilder {

  helps: InteractiveHelp[] = [];

  constructor(private location: Location,
              private modalStack: NgbModalStack,
              private entityLoaderService: EntityLoaderService,
              private navigation: NavigationEvents) {
  }

  add(storyLine: StoryLine, initializer: (loader: EntityLoader) => void) {

    this.helps.push({
      storyLine,
      onInit: (service: InteractiveHelpService) => {
        return service.reset()
          .then(() => {

            const loader = this.entityLoaderService.create(false);

            // default data for all helps
            return Promise.all([
              loader.createVocabularyWithConcepts(helpVocabulary),
              loader.createOrganization(helpOrganization)
            ])
              .then(() => loader.createModelWithResources(helpImportedLibrary))
              .then(() => {
                initializer(loader);
                return loader.result;
              });
          })
          .then(identity, err => {
            console.log(err);
            throw err;
          })
          .then(() => this.navigate(this.navigation.onStart));
      },
      onComplete: () => this.navigate(this.navigation.onEnd),
      onCancel: () => this.navigate(this.navigation.onEnd)
    });
  };

  private navigate(url?: string) {

    this.modalStack.dismissAll();

    if (url) {
      this.location.go(url);
      return true;
    } else {
      return false;
    }
  };
}
