import { IRootScopeService } from 'angular';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import { isDifferentUrl } from '../utils/angular';
import { Model } from '../entities/model';
import { EditingGuard } from '../components/model/modelControllerService';
import { Location } from '@angular/common';
import { ActivatedRoute, NavigationEnd, NavigationStart, Params, Router, UrlSegment } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subject } from 'rxjs';

interface RouteParams {
  prefix: string;
  resource?: string;
  property?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SubRoutingHackService implements OnDestroy {
  currentSelection: BehaviorSubject<RouteData> = new BehaviorSubject(new RouteData({ prefix: '' }));
  private locationService: Location;
  private initialRoute: UrlSegment[];
  private currentRouteParams: Params;
  private subscriptions: Subscription[] = [];
  private ajsSubscriptions: (() => void)[] = [];
  private editingGuard?: EditingGuard;

  private destroy$ = new Subject();

  private route: ActivatedRoute;
  private router: Router;

  constructor(
    private location: Location
    ) {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
    this.ajsSubscriptions.forEach(s => s());
  }

  initSubRoutingHack(route: ActivatedRoute, router: Router): void {
    this.route = route;
    this.router = router;
    // The logic is mostly transferred from old AngularJS bloat modelPage.ts. The main idea is to emulate sub routing by hacking,
    // to keep the data model level stuff from re-initializing when lower level selections change.

    this.initialRoute = this.route.snapshot.url;
    this.currentRouteParams = this.route.snapshot.params;

    const initialRouteData = new RouteData(this.currentRouteParams);
    this.currentSelection.next(initialRouteData);

    this.router.events
      .pipe(filter(event => event instanceof NavigationStart || event instanceof NavigationEnd ))
      .subscribe(event => {
        if (event instanceof NavigationStart) {
          // Navigation started
          const currentUrl = event.url;
          const urlAfterRedirects = this.router.parseUrl(event.url).toString();
          if (isDifferentUrl(currentUrl, urlAfterRedirects)) {
            if (this.editingGuard) {
              // this.editingGuard.attemptRouteChange(() => event.preventDefault(), () => this.location.go(nextUrl(this.location, next)));
            }
          }
        }

        if (event instanceof NavigationEnd) {
          // Navigation ended
          if (this.location.path().startsWith('/model')) {

            this.route.params.subscribe(params => {
              this.currentRouteParams = params;
              const newRoute = new RouteData(this.currentRouteParams);

              const oldRoute = this.currentSelection.getValue();
              const modelDiffers = oldRoute.modelPrefix !== newRoute.modelPrefix;
              const resourceDiffers = oldRoute.resourceCurie !== newRoute.resourceCurie;
              const propertyDiffers = oldRoute.propertyId !== newRoute.propertyId;

              if (modelDiffers || resourceDiffers || propertyDiffers) {
                this.currentSelection.next(newRoute);
              }
            });


          } else {
            if (this.currentSelection.getValue().modelPrefix) {
              this.currentSelection.next(new RouteData({ prefix: '' }));
            }
          }
        }
      });
  }

  navigateTo(modelPrefix: string, resourceCurie?: string, propertyId?: string) {
    // NOTE: Cannot use the signature specified in the interface because it does not allow clearing parameters.
    // const newParams: { [key: string]: string } = {
    const newParams: any = {
      prefix: modelPrefix,
      resource: undefined,
      property: undefined
    };
    if (resourceCurie) {
      newParams.resource = this.cleanCurie(modelPrefix, resourceCurie);
      if (propertyId) {
        newParams.property = propertyId;
      }
    }

    if (newParams.prefix !== this.currentRouteParams.prefix ||
      newParams.resource !== this.currentRouteParams.resource ||
      newParams.property !== this.currentRouteParams.property) {

      // this.routeService.updateParams(newParams);
      this.router.navigate(['/model', newParams.prefix, newParams.resource]);
    }
  }

  navigateToRoot() {
    this.location.go('/');
  }

  setGuard(guard: EditingGuard): void {
    if (this.editingGuard) {
      console.error('Overwriting existing editing guard registration');
    }
    this.editingGuard = guard;
  }

  unsetGuard(guard: EditingGuard): void {
    if (this.editingGuard === guard) {
      this.editingGuard = undefined;
    } else {
      console.error('Trying to deregister unknown editing guard');
    }
  }

  private cleanCurie(modelPrefix: string, resourceCurie: string): string {
    if (resourceCurie.startsWith(modelPrefix + ':')) {
      return resourceCurie.substring(modelPrefix.length + 1);
    }
    return resourceCurie;
  }
}

export class RouteData {

  modelPrefix: string;
  resourceCurie?: string;
  propertyId?: string;

  constructor(params: Params) {
    this.modelPrefix = params.prefix;

    if (params.resource) {
      const split = params.resource.split(':');

      if (split.length === 1) {
        this.resourceCurie = params.prefix + ':' + params.resource;
      } else if (split.length === 2) {
        this.resourceCurie = params.resource;
      } else {
        throw new Error('Unsupported resource format: ' + params.resource);
      }

      if (params.property) {
        this.propertyId = params.property;
      }
    }
  }

  toString(): string {
    return this.modelPrefix ? this.modelPrefix + (this.resourceCurie ? '/' + this.resourceCurie + (this.propertyId ? '/' + this.propertyId : '') : '') : '';
  }
}

export class ModelAndSelection {
  model?: Model;
  resourceCurie?: string;
  propertyId?: string;

  static fromModelAndRoute(model: Model | undefined, routeData: RouteData): ModelAndSelection {
    if ((model ? model.prefix : '') !== routeData.modelPrefix) {
      throw Error('ModelAndSelection constructed with mismatching model and route data');
    }
    const ret = new ModelAndSelection();
    ret.model = model;
    if (model) {
      ret.resourceCurie = routeData.resourceCurie;
      ret.propertyId = routeData.propertyId;
    }
    return ret;
  }

  equals(other: ModelAndSelection): boolean {
    if ((!!this.model !== !!other.model) || (this.model && (this.model.prefix !== other.model!.prefix))) {
      return false;
    }

    return this.resourceCurie === other.resourceCurie && this.propertyId === other.propertyId;
  }

  toString(): string {
    return this.model ? this.model.prefix + (this.resourceCurie ? '/' + this.resourceCurie + (this.propertyId ? '/' + this.propertyId : '') : '') : '';
  }

  copyWithUpdatedModel(updatedModel: Model): ModelAndSelection {
    if (!this.model || updatedModel.prefix !== this.model.prefix) {
      throw Error(`Updated model prefix "${updatedModel.prefix}" does not match existing one "${this.model ? this.model.prefix : 'undefined'}".`);
    }
    const ret = new ModelAndSelection();
    ret.model = updatedModel;
    ret.resourceCurie = this.resourceCurie;
    ret.propertyId = this.propertyId;
    return ret;
  }
}
