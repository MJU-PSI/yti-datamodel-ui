import { ClassVisualizationComponent } from './classVisualization';
import { VisualizationPopoverComponent } from './popover';
import { VisualizationContextMenuComponent } from './contextMenu';

import { componentDeclaration, directiveDeclaration } from 'app/utils/angular';
import { module3 as mod } from './module';
export { module3 } from './module'

mod.component('classVisualization', componentDeclaration(ClassVisualizationComponent));
mod.component('visualizationPopover', componentDeclaration(VisualizationPopoverComponent));
mod.component('visualizationContextMenu', componentDeclaration(VisualizationContextMenuComponent));
