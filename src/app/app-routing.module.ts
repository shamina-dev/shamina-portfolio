import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { FreeServicesComponent } from './features/free-services/free-services.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'free-services', component: FreeServicesComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { 
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
    scrollOffset: [0, 90]
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
