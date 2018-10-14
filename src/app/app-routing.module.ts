import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JourneyComponent } from './components/journey/journey.component';
import { PlanComponent } from './components/plan/plan.component';
import { SensorsComponent } from './components/sensors/sensors.component';
import { StatusComponent } from './components/status/status.component';

const routes: Routes = [
  { path: 'journey', component: JourneyComponent },
  { path: 'plan', component: PlanComponent },
  { path: 'sensor', component: SensorsComponent },
  { path: 'status', component: StatusComponent },
  { path: '', redirectTo: 'journey', pathMatch: 'full' },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
