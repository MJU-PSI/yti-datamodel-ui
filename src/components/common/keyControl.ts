import { IAttributes, IScope } from 'angular';
import { arrowDown, arrowUp, pageDown, pageUp, enter } from 'yti-common-ui/utils/key-code';
import { module as mod } from './module';

mod.directive('keyControl', () => {
  return {
    restrict: 'A',
    controllerAs: 'keyControl',
    require: 'keyControl',
    link($scope: IScope, element: JQuery, _attributes: IAttributes, controller: KeyControlController) {
      element.on('keydown', event => controller.keyPressed(event));
      $scope.$watch(element.attr('key-control') + '.length', (items: number) => controller.onItemsChange(items || 0));
    },
    controller: KeyControlController
  };
});

export class KeyControlController {

  itemCount = 0;
  selectionIndex = -1;

  private keyEventHandlers: {[key: number]: () => void} = {
    [arrowDown]: () => this.moveSelection(1),
    [arrowUp]: () => this.moveSelection(-1),
    [pageDown]: () => this.moveSelection(10),
    [pageUp]: () => this.moveSelection(-10),
    [enter]: () => this.selectSelection()
  };

  constructor(private $scope: IScope) {
  }

  onItemsChange(itemCount: number) {
    this.itemCount = itemCount;
    this.setSelection(-1);
  }

  keyPressed(event: JQueryEventObject) {
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
    this.$scope.$parent.$broadcast('selectionMoved', this.selectionIndex);
  }

  private selectSelection() {
    this.$scope.$parent.$broadcast('selectionSelected', this.selectionIndex);
  }
}


