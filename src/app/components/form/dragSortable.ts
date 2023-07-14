// import { IAttributes, IDirectiveFactory, IRepeatScope, IScope } from 'angular';
// import { moveElement, resetWith } from '@mju-psi/yti-common-ui';
// import { LegacyDirective } from 'app/utils/angular';

// interface DragSortableAttributes extends IAttributes {
//   dragSortable: string;
//   dragDisabled: string;
//   onReorder: string;
// }

// @LegacyDirective({
// })
// export class DragSortableDirective<T> {

//   drag: Drag|null = null;
//   dragDisabled: boolean;
//   dragValuesOriginal: T[]|null = null;
//   dragValues: T[];
//   onReorder: (item: T, index: number) => void;

//   constructor(private $scope: IScope,
//               private $attrs: DragSortableAttributes) {
//     'ngInject';
//   }

//   $postLink() {
//     this.$scope.$watch(this.$attrs.dragSortable, (values: any[]) => this.dragValues = values);
//     this.$scope.$watch(this.$attrs.dragDisabled, (disabled: boolean) => this.dragDisabled = disabled);
//     this.$scope.$watch(this.$attrs.onReorder, (onReorder: (item: any, index: number) => void) => this.onReorder = onReorder);
//   }

//   startDrag(dataTransfer: DataTransfer, fromIndex: number, sourceWidth: number): void {
//     dataTransfer.setData('text', '');
//     dataTransfer.dropEffect = 'move';
//     dataTransfer.effectAllowed = 'move';

//     this.drag = { fromIndex, droppable: true, cloneCreated: false, sourceWidth };
//     this.dragValuesOriginal = this.dragValues.slice();
//   }

//   cloneCreated() {

//     if (!this.drag) {
//       throw new Error('Drag not started');
//     }

//     this.drag.cloneCreated = true;
//   }

//   overDroppable(index: number, targetWidth: number, mousePosition: number) {

//     if (!this.drag) {
//       throw new Error('Drag not started');
//     }

//     const sourceWidth = this.drag.sourceWidth;
//     const toLeft = index < this.drag.fromIndex;
//     const stableDropRegion = toLeft ? mousePosition < sourceWidth : mousePosition > targetWidth - sourceWidth;

//     if (stableDropRegion) {
//       this.drag.droppable = true;
//       if (this.canDrop(index)) {

//         moveElement(this.dragValues, this.drag.fromIndex, index, this.onReorder);
//         this.drag.fromIndex = index;
//       }
//     }
//   }

//   notOverDroppable() {

//     if (!this.drag) {
//       throw new Error('Drag not started');
//     }

//     this.drag.droppable = false;
//   }

//   canDrop(index: number) {

//     if (!this.drag) {
//       throw new Error('Drag not started');
//     }

//     return this.drag.fromIndex !== index;
//   }

//   drop() {
//     if (this.drag && !this.drag.droppable) {
//       resetWith(this.dragValues, this.dragValuesOriginal || []);
//     }
//     this.drag = null;
//     this.dragValuesOriginal = null;
//   }
// }

// interface Drag {
//   fromIndex: number;
//   droppable: boolean;
//   cloneCreated: boolean;
//   sourceWidth: number;
// }

// export const DragSortableItemDirective: IDirectiveFactory = () => {
//   return {
//     require: '^dragSortable',
//     link($scope: IRepeatScope, element: JQuery, _attributes: IAttributes, dragSortable: DragSortableDirective<any>) {

//       const selectStartHandler = () => element.dragDrop(); // IE9 support hack

//       const dragStartHandler = (event: JQueryMouseEventObject) => $scope.$apply(
//         () => {
//           if ((<DragEvent>event.originalEvent).dataTransfer != null) {
//             dragSortable.startDrag((<DragEvent> event.originalEvent).dataTransfer!, $scope.$index, element.width())
//           }
//         }
//       );


//       const dragEndHandler = () => $scope.$apply(() => dragSortable.drop());

//       const dragOverHandler = (event: JQueryMouseEventObject) => {
//         if (dragSortable.drag) {
//           event.preventDefault();

//           const originalEvent = (<DragEvent> event.originalEvent);
//           const mousePosition = originalEvent.clientX - element.offset().left;

//           $scope.$apply(() => dragSortable.overDroppable($scope.$index, element.width(), mousePosition));
//         }
//       };

//       const dragLeaveHandler = () => $scope.$apply(() => dragSortable.notOverDroppable());

//       const dragEnterHandler = () => $scope.$apply(() => dragSortable.cloneCreated());

//       const dropHandler = (event: JQueryMouseEventObject) => {
//         event.preventDefault();
//         $scope.$apply(() => dragSortable.drop());
//       };

//       $scope.$watch(() => dragSortable.drag, drag => {
//         const dragReady = drag ? drag.cloneCreated : false;
//         element.toggleClass('dragged', dragReady && drag!.fromIndex === $scope.$index);
//         element.toggleClass('droppable', dragReady && drag!.droppable);
//       }, true);

//       function init() {
//         element.attr('draggable', 'true');
//         element.on('selectstart', selectStartHandler);
//         element.on('dragstart', dragStartHandler);
//         element.on('dragend', dragEndHandler);
//         element.on('dragover', dragOverHandler);
//         element.on('dragleave', dragLeaveHandler);
//         element.on('dragenter', dragEnterHandler);
//         element.on('drop', dropHandler);
//       }

//       function release() {
//         element.attr('draggable', 'false');
//         element.off('selectstart', selectStartHandler);
//         element.off('dragstart', dragStartHandler);
//         element.off('dragend', dragEndHandler);
//         element.off('dragover', dragOverHandler);
//         element.off('dragleave', dragLeaveHandler);
//         element.off('dragenter', dragEnterHandler);
//         element.off('drop', dropHandler);
//       }

//       $scope.$watch(() => dragSortable.dragDisabled, disabled => {
//         if (disabled) {
//           release();
//         } else {
//           init();
//         }
//       });

//       $scope.$on('$destroy', release);
//     }
//   };
// };

import { ChangeDetectorRef, Directive, ElementRef, EventEmitter, Input, NgZone, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { moveElement, requireDefined } from '@mju-psi/yti-common-ui';
import { BehaviorSubject, Subscription } from 'rxjs';

export interface Sortable<T> {
  sortableValues: T[];
  moveItem(fromIndex: number, toIndex: number): void;
}

interface Drag {
  fromIndex: number;
  droppable: boolean;
  cloneCreated: boolean;
  sourceWidth: number;
}

interface PositionChange {
  fromIndex: number;
  toIndex: number;
}

@Directive({
  selector: '[appDragSortable]'
})
export class DragSortableDirective<T> implements OnChanges {

  @Input('appDragSortable') sortable: T[];
  @Input() dragDisabled = false;
  @Output() positionChange = new EventEmitter<PositionChange>();

  disabled$ = new BehaviorSubject(false);

  drag$ = new BehaviorSubject<Drag|null>(null);
  dragValuesOriginal: T[]|null = null;

  constructor(private zone: NgZone, private cdRef: ChangeDetectorRef) {
  }

  ngOnChanges(changes: SimpleChanges): void {

    const previouslyDisabled = this.disabled$.getValue();

    if ((this.dragDisabled && !previouslyDisabled) || !this.dragDisabled && previouslyDisabled) {
      this.disabled$.next(this.dragDisabled);
    }
  }

  startDrag(dataTransfer: DataTransfer, fromIndex: number, sourceWidth: number): void {

    dataTransfer.setData('text', '');
    dataTransfer.dropEffect = 'move';
    dataTransfer.effectAllowed = 'move';

    this.drag = { fromIndex, droppable: true, cloneCreated: false, sourceWidth };
    // this.dragValuesOriginal = this.sortable.sortableValues.slice();
    this.dragValuesOriginal = this.sortable.slice();
  }

  get drag(): Drag|null {
    return this.drag$.getValue();
  }

  set drag(value: Drag|null) {
    this.drag$.next(value);
  }

  cloneCreated() {
    if (this.drag) {
      this.drag.cloneCreated = true;
    }
  }

  overDroppable(toIndex: number, targetWidth: number, mousePosition: number): void {

    if (this.drag) {

      const sourceWidth = this.drag.sourceWidth;
      const toLeft = toIndex < this.drag.fromIndex;
      const stableDropRegion = toLeft ? mousePosition < sourceWidth : mousePosition > targetWidth - sourceWidth;

      if (stableDropRegion) {

        if (this.canDrop(toIndex)) {

          const fromIndex = this.drag.fromIndex;

          this.zone.run(() => {
            this.drag = {...this.drag!, fromIndex: toIndex, droppable: true};
            // this.sortable.moveItem(fromIndex, toIndex);
            const copy = this.sortable.slice();
            moveElement(copy, fromIndex, toIndex);
            this.sortable = copy;

            this.positionChange.emit({fromIndex, toIndex});


          });
          this.cdRef.detectChanges();
        } else {
          this.drag = {...this.drag, droppable: true};
        }
      }
    }
  }

  notOverDroppable(): void {

    if (this.drag) {
      this.drag = {...this.drag, droppable: false};
    }
  }

  canDrop(index: number): boolean {
    return this.drag ? this.drag.fromIndex !== index : false;
  }

  drop(): void {

    if (this.drag && !this.drag.droppable) {

      const dragValuesOriginal = this.dragValuesOriginal;

      this.zone.run(() => {
        // this.sortable.sortableValues = requireDefined(dragValuesOriginal);
        this.sortable = requireDefined(dragValuesOriginal);


      });
      this.cdRef.detectChanges();
    }
    this.drag = null;
    this.dragValuesOriginal = null;
  }
}

@Directive({
  selector: '[appDragSortableItem]'
})
export class DragSortableItemDirective<T> implements OnInit, OnDestroy {

  @Input('appDragSortableItem') item: T;
  @Input() index: number;

  private element: HTMLElement;
  private subscriptionsToClean: Subscription[] = [];

  private dragStartHandler = (event: DragEvent) =>
    event.dataTransfer ? this.dragSortable.startDrag(event.dataTransfer, this.index, this.element.getBoundingClientRect().width) : null;

  private dragEndHandler = () =>
    this.dragSortable.drop();

  private dragOverHandler = (event: DragEvent) => {

    if (this.dragSortable.drag) {

      event.preventDefault();
      const mousePosition = event.clientX - this.element.getBoundingClientRect().left;
      this.dragSortable.overDroppable(this.index, this.element.getBoundingClientRect().width, mousePosition);
    }
  };

  private dragLeaveHandler = () =>
    this.dragSortable.notOverDroppable();

  private dragEnterHandler = () =>
    this.dragSortable.cloneCreated();

  private dropHandler = (event: DragEvent) => {
    event.preventDefault();
    this.dragSortable.drop();
  };

  constructor(private dragSortable: DragSortableDirective<T>,
              private zone: NgZone,
              elementRef: ElementRef) {

    this.element = elementRef.nativeElement;
  }

  ngOnInit() {

    this.zone.runOutsideAngular(() => {

      this.subscriptionsToClean.push(
        this.dragSortable.disabled$.subscribe(disabled => {
          if (disabled) {
            this.disable();
          } else {
            this.enable();
          }
        })
      );

      this.subscriptionsToClean.push(
        this.dragSortable.drag$.subscribe(drag => {

          const dragReady = drag ? drag.cloneCreated : false;
          const dragged = dragReady && drag!.fromIndex === this.index;
          const droppable = dragReady && drag!.droppable;

          if (dragged) {
            this.element.classList.add('dragged');
          } else {
            this.element.classList.remove('dragged');
          }

          if (droppable) {
            this.element.classList.add('droppable');
          } else {
            this.element.classList.remove('droppable');
          }
        })
      );
    });
  }

  ngOnDestroy() {

    this.disable();
    this.subscriptionsToClean.forEach(s => s.unsubscribe());
    this.subscriptionsToClean = [];
  }

  private enable() {

    this.zone.runOutsideAngular(() => {

      this.element.setAttribute('draggable', 'true');
      this.element.addEventListener('dragstart', this.dragStartHandler);
      this.element.addEventListener('dragend', this.dragEndHandler);
      this.element.addEventListener('dragover', this.dragOverHandler);
      this.element.addEventListener('dragleave', this.dragLeaveHandler);
      this.element.addEventListener('dragenter', this.dragEnterHandler);
      this.element.addEventListener('drop', this.dropHandler);
    });
  }

  private disable() {

    this.element.setAttribute('draggable', 'false');
    this.element.removeEventListener('dragstart', this.dragStartHandler);
    this.element.removeEventListener('dragend', this.dragEndHandler);
    this.element.removeEventListener('dragover', this.dragOverHandler);
    this.element.removeEventListener('dragleave', this.dragLeaveHandler);
    this.element.removeEventListener('dragenter', this.dragEnterHandler);
    this.element.removeEventListener('drop', this.dropHandler);
  }
}
