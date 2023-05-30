// import { IScope } from 'angular';
// import { UsageService } from 'app/services/usageService';
// import { EditableEntity } from 'app/types/entity';
// import { LanguageContext } from 'app/types/language';
// import { Usage } from 'app/entities/usage';
// import { LegacyComponent } from 'app/utils/angular';

// @LegacyComponent({
//   bindings: {
//     id: '@',
//     entity: '=',
//     context: '='
//   },
//   template: require('./usagePanel.html')
// })
// export class UsagePanelComponent {

//   entity: EditableEntity;
//   context: LanguageContext;
//   usage: Usage|null = null;
//   open = false;
//   loading: boolean;

//   constructor(private $scope: IScope,
//               private usageService: UsageService) {
//     'ngInject';
//   }

//   $onInit() {
//     this.$scope.$watch(() => this.open, () => this.updateUsage());
//     this.$scope.$watch(() => this.entity, () => this.updateUsage());
//   }

//   hasReferrers() {
//     return this.usage && this.usage.referrers.length > 0;
//   }

//   private updateUsage() {
//     if (this.open) {
//       if (!this.usage || this.usage.id.notEquals(this.entity.id)) {
//         this.loading = true;
//         this.usageService.getUsage(this.entity).then(usage => {
//           this.usage = usage;
//           this.loading = false;
//         });
//       }
//     } else {
//       this.usage = null;
//     }
//   }
// }


import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { UsageService } from 'app/services/usageService';
import { EditableEntity } from 'app/types/entity';
import { LanguageContext } from 'app/types/language';
import { Usage } from 'app/entities/usage';
import { AccordionComponent } from './accordion';

@Component({
  selector: 'usage-panel',
  templateUrl: './usage-panel.component.html'
})
export class UsagePanelComponent implements OnInit, OnChanges {

  @Input() id: string;
  @Input() entity: EditableEntity;
  @Input() context: LanguageContext;

  @ViewChild(AccordionComponent, {static: true}) private accordion: AccordionComponent;

  usage: Usage | null = null;
  open = false;
  loading = false;
  identifier = 'default';

  constructor(private usageService: UsageService) {}

  ngOnInit() {
    this.updateUsage();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes.entity && !changes.entity.firstChange) ||
        (changes.context && !changes.context.firstChange)) {
      this.updateUsage();
    }
  }

  ngDoCheck(){
    // this.open = this.accordion.isOpen(this.identifier)
    // this.updateUsage();
  }

  hasReferrers() {
    return this.usage && this.usage.referrers.length > 0;
  }

  private updateUsage() {
    if (this.open) {
      if (!this.usage || this.usage.id.uri !== this.entity.id.uri) {
        this.loading = true;
        this.usageService.getUsage(this.entity).then((usage) => {
          this.usage = usage;
          this.loading = false;
        });
      }
    } else {
      this.usage = null;
    }
  }
}
