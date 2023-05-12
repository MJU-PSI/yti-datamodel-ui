// import { IScope, IRootScopeService, IPromise, IQService, IDocumentService, IControllerService, ICompileService, IDeferred, IAugmentedJQuery, animate } from 'angular';
// import IAnimateService = animate.IAnimateService;

// /**
//  * Interface providing access to overlays by clients. Available as '$overlayInstance' in scope.
//  */
// export interface OverlayInstance {
//   result: IPromise<any>;
//   opened: IPromise<any>;
//   closed: IPromise<any>;
//   close(result?: any): void;
//   dismiss(reason?: any): void;
// }

// export interface OverlayOptions {
//   template: string;
//   controller?: any;
//   controllerAs?: string;
//   resolve?: any;
//   appendTo?: any;
//   scope?: IScope;
//   disableScroll?: boolean;
// }

// export interface IOverlayScope extends IScope {
//   $$overlayDestructionScheduled?: boolean;
//   $close(result?: any): void;
//   $dismiss(reason?: any): void;
// }

// const overlayOpenClass = 'overlay-open';

// export class OverlayService {

//   constructor(private $rootScope: IRootScopeService,
//               private $q: IQService,
//               private $document: IDocumentService,
//               private $controller: IControllerService,
//               private $compile: ICompileService,
//               private $animate: IAnimateService,
//               private $uibResolve: { resolve(options: any): IPromise<any> }) {
//     'ngInject';
//   }

//   open(options: OverlayOptions): OverlayInstance {

//     if (!options.template) {
//       throw new Error('template is required');
//     }

//     const body = this.$document.find('body').eq(0);
//     const appendTo = options.appendTo || body;
//     const instance = new DefaultOverlayInstance(this.$q, this.$animate, body);

//     this.$uibResolve.resolve(options.resolve || {}).then(vars => {
//       const parentScope = options.scope || this.$rootScope;
//       const scope = instance.createScope(parentScope);

//       if (options.controller) {

//         const locals = {
//           $scope: scope,
//           $overlayInstance: instance,
//           ...vars
//         };

//         // XXX: d.ts doesn't provide overload for this constructor anymore even though it exists at runtime
//         const instantiator: any = (this.$controller as any)(options.controller, locals, true);
//         const ctrl = instantiator();

//         if (options.controllerAs) {
//           (scope as any)[options.controllerAs] = ctrl;
//         }

//         if (typeof ctrl.$onInit === 'function') {
//           ctrl.$onInit();
//         }
//       }

//       const elem = jQuery(options.template);

//       if (options.disableScroll) {
//         body.addClass(overlayOpenClass);
//       }

//       this.$animate.enter(this.$compile(elem)(scope), appendTo);

//       instance.element = () => elem;
//       instance.openedDeferred.resolve(true);

//     }, reason => {
//       instance.openedDeferred.reject(reason);
//       instance.resultDeferred.reject(reason);
//     });

//     return instance;
//   }
// }

// class DefaultOverlayInstance implements OverlayInstance {

//   result: IPromise<any>;
//   opened: IPromise<any>;
//   closed: IPromise<any>;
//   resultDeferred: IDeferred<any>;
//   openedDeferred: IDeferred<any>;
//   closedDeferred: IDeferred<any>;

//   // We'd like to store scope and element normally, but angular would try to copy those
//   // values and fail. By wrapping the values inside functions, Angular works correctly.
//   scope: () => IOverlayScope;
//   element: () => IAugmentedJQuery;

//   constructor($q: IQService, private $animate: IAnimateService, private bodyElement: JQuery) {

//     this.resultDeferred = $q.defer();
//     this.openedDeferred = $q.defer();
//     this.closedDeferred = $q.defer();

//     this.result = this.resultDeferred.promise;
//     this.opened = this.openedDeferred.promise;
//     this.closed = this.closedDeferred.promise;
//   }

//   /**
//    * Create a scope for this instance. Note that we can't create the scope from constructor,
//    * because this instance needs to be returned even if initialization fails. We only want
//    * the scope to be created if constructor is successful.
//    */
//   createScope(parentScope: IScope): IOverlayScope {
//     const scope = parentScope.$new() as IOverlayScope;
//     scope.$close = this.close.bind(this);
//     scope.$dismiss = this.dismiss.bind(this);

//     scope.$on('$destroy', () => {
//       if (!scope.$$overlayDestructionScheduled) {
//         this.dismiss('unscheduledDestruction');
//       }
//     });

//     this.scope = () => scope;
//     return scope;
//   }

//   close(result?: any) {
//     this.closeOrDismiss(result, true);
//   }

//   dismiss(reason?: any) {
//     this.closeOrDismiss(reason, false);
//   }

//   private closeOrDismiss(result: any, closing: boolean) {
//     const scope = this.scope();

//     if (scope.$broadcast('overlay.closing', result, closing).defaultPrevented) {
//       return;
//     }

//     scope.$$overlayDestructionScheduled = true;

//     if (closing) {
//       this.resultDeferred.resolve(result);
//     } else {
//       this.resultDeferred.reject(result);
//     }

//     const elem = this.element();

//     this.$animate.leave(elem).then(() => {
//       this.bodyElement.removeClass(overlayOpenClass);
//       elem.remove();
//       this.closedDeferred.resolve();
//     });

//     scope.$destroy();
//   }
// }




// TODO ALES - tole mi ni jasno kaj narest

import { ComponentFactoryResolver, Inject, Injectable, Injector, } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { animate, AnimationBuilder, AnimationFactory, AnimationPlayer, query, style } from '@angular/animations';
import { Observable } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { IScope } from 'angular';

/**
 * Interface providing access to overlays by clients. Available as '$overlayInstance' in scope.
 */
export interface OverlayInstance {
  result: Promise<any>;
  opened: Promise<any>;
  closed: Promise<any>;
  close(result?: any): void;
  dismiss(reason?: any): void;
}

export interface OverlayOptions {
  template: string;
  component?: any;
  componentFactoryResolver?: ComponentFactoryResolver;
  injector?: Injector;
  appendTo?: any;
  disableScroll?: boolean;
}

export interface IOverlayScope extends IScope{
  $$overlayDestructionScheduled?: boolean;
  $close(result?: any): void;
  $dismiss(reason?: any): void;
}

const overlayOpenClass = 'overlay-open';

@Injectable({
  providedIn: 'root'
})
export class OverlayService {

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private animationBuilder: AnimationBuilder
  ) { }

  open(options: OverlayOptions): OverlayInstance {

    if (!options.template && !options.component) {
      throw new Error('template or component is required');
    }

    const body = this.document.body;
    const appendTo = options.appendTo || body;
    const instance = new DefaultOverlayInstance(body, this.animationBuilder);

    const componentFactoryResolver = options.componentFactoryResolver;
    const injector = options.injector;
    if (!injector) {
      throw new Error('injector is required when using component');
    }

    if (options.component) {
      const componentFactoryResolver = options.componentFactoryResolver;
      if (!componentFactoryResolver) {
        throw new Error('componentFactoryResolver is required when using component');
      }

      const factory = componentFactoryResolver.resolveComponentFactory(options.component);
      const componentRef = factory.create(injector);
      const componentEl = componentRef.location.nativeElement;

      appendTo.appendChild(componentEl);
      instance.element = () => componentEl;
      // instance.componentRef = componentRef;
    } else {
      const elem = document.createElement('div');
      elem.innerHTML = options.template;

      if (options.disableScroll) {
        body.classList.add(overlayOpenClass);
      }

      this.animateElement(elem, appendTo, instance).subscribe(() => {
        instance.element = () => elem;
        instance.openedDeferred.resolve(true);
      });
    }

    return instance;
  }

  private animateElement(elem: HTMLElement, appendTo: HTMLElement, instance: DefaultOverlayInstance): Observable<any> {
    const enterFactory: AnimationFactory = this.animationBuilder.build([
      query(':self', style({ opacity: 0 })),
      query(':self', animate('150ms ease-in', style({ opacity: 1 })))
    ]);

    const leaveFactory: AnimationFactory = this.animationBuilder.build([
      query(':self', style({ opacity: 1 })),
      query(':self', animate('150ms ease-in', style({ opacity: 0 })))
    ]);

    const player: AnimationPlayer = enterFactory.create(elem);
    player.play();

    return of(player.onDone(() => {
      instance.animationPlayer = leaveFactory.create(elem);
      instance.animationPlayer.play();

      instance.animationPlayer.onDone(() => {
        appendTo.removeChild(elem);
        instance.bodyElement.classList.remove(overlayOpenClass);
        instance.closedDeferred.resolve();
      });
    }));
  }
}

@Injectable()
export class DefaultOverlayInstance implements OverlayInstance {

  result: Promise<any>;
  opened: Promise<any>;
  closed: Promise<any>;
  resultDeferred: any;
  openedDeferred: any;
  closedDeferred: any;

  // We'd like to store scope and element normally, but angular would try to copy those
  // values and fail. By wrapping the values inside functions, Angular works correctly.
  scope!: () => IOverlayScope;
  element!: () => any;
  animationPlayer: AnimationPlayer;
  bodyElement: any;

  constructor(bodyElement: any, private animationBuilder: AnimationBuilder) {
    this.resultDeferred = {} as any;
    this.openedDeferred = {} as any;
    this.closedDeferred = {} as any;

    this.result = this.resultDeferred.promise;
    this.opened = this.openedDeferred.promise;
    this.closed = this.closedDeferred.promise;

  }

  /**
   * Create a scope for this instance. Note that we can't create the scope from constructor,
   * because this instance needs to be returned even if initialization fails. We only want
   * the scope to be created if constructor is successful.
   */
  createScope(parentScope: any): IOverlayScope {
    const scope = parentScope.$new() as IOverlayScope;
    scope.$close = this.close.bind(this);
    scope.$dismiss = this.dismiss.bind(this);

    scope.$on('$destroy', () => {
      if (!scope.$$overlayDestructionScheduled) {
        this.dismiss('unscheduledDestruction');
      }
    });

    this.scope = () => scope;
    return scope;
  }

  close(result?: any) {
    this.closeOrDismiss(result, true);
  }

  dismiss(reason?: any) {
    this.closeOrDismiss(reason, false);
  }

  private closeOrDismiss(result: any, closing: boolean) {
    const scope = this.scope();

    if (scope.$broadcast('overlay.closing', result, closing).defaultPrevented) {
      return;
    }

    scope.$$overlayDestructionScheduled = true;

    if (closing) {
      this.resultDeferred.resolve(result);
    } else {
      this.resultDeferred.reject(result);
    }

    const elem = this.element();

    elem.instance.$animate.leave(elem.location.nativeElement).then(() => {
      this.bodyElement.removeClass('overlay-open');
      elem.destroy();
      this.closedDeferred.resolve();
    });

    scope.$destroy();
  }
}

