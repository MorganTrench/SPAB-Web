import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JourneyWrapperComponent } from './components/journey/journey.component';
import { PlanWrapperComponent } from './components/plan/plan.component';
import { MapServiceService } from './services/map-service/map-service.service';
import { SensorsComponent } from './components/sensors/sensors.component';
import { StatusComponent } from './components/status/status.component';

const routes: Routes = [
  { path: 'journey', component: JourneyWrapperComponent },
  { path: 'plan', component: PlanWrapperComponent },
  { path: 'sensor', component: SensorsComponent },
  { path: 'status', component: StatusComponent },
  { path: '', redirectTo: 'journey', pathMatch: 'full' },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
