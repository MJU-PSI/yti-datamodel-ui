import { NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, RouterModule, Routes } from '@angular/router';
import { Uri } from './entities/uri';
import { resourceUrl, modelUrl } from './utils/entity';
import { NotificationModal } from './components/common/notificationModal';
import { ModelMainComponent } from './components/model/modelMain';
import { ApplicationComponent } from './components/application';
import { UserDetailsComponent } from './components/userdetails/user-details.component';
import { FrontPageComponent } from './components/frontPage';
import { NewModelPageComponent } from './components/model/newModelPage';
import { InformationAboutServicePageComponent } from './components/information/information-about-service-page.component';
import { ModelViewComponent } from './components/model/modelView';
import { ClassViewComponent } from './components/editor/class-view';

const routes: Routes = [

  { path: '', component: FrontPageComponent, pathMatch: 'full' },
  { path: 'newModel', component: NewModelPageComponent },
  // {
  //   path: 'model/:prefix', component: ModelMainComponent, children: [
  //     // { path: '', component: NoSelectionComponent, canDeactivate: [ConfirmCancelEditGuard]  },
  //     { path: ':resource', component: ClassViewComponent },
  //   ]
  // },

  { path: 'user', component: UserDetailsComponent },
  { path: 'information', component: InformationAboutServicePageComponent},

  {path: 'model/:prefix', component: ModelMainComponent},
  {path: 'model/:prefix/:resource', component: ModelMainComponent},
  // {
  //   path: 'group/:id',
  //   // component: GroupPageComponent,
  //   resolve: {
  //     groupId: GroupIdResolver
  //   }
  // },

  // {
  //   path: 'ns/:prefix',
  //   // component: RedirectResolver
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

function GroupIdResolver(route: ActivatedRouteSnapshot): Uri {
  return new Uri(route.params.id, {});
}

function RedirectResolver(route: ActivatedRouteSnapshot, location: Location, notificationModal: NotificationModal) {
  const prefix = route.params.prefix;
  const resource = location.hash;

  if (resource) {
    location.replace(resourceUrl(prefix, resource));
  } else {
    location.replace(modelUrl(prefix));
  }

  // notificationModal.openPageNotFound();
  // return false;
}
