import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JourneyComponent } from './journey/journey.component';
import { SensorsComponent } from './sensors/sensors.component';
import { StatusComponent } from './status/status.component';

const routes: Routes = [
  { path: 'journey', component: JourneyComponent },
  { path: 'sensor', component: SensorsComponent },
  { path: 'status', component: StatusComponent },
  { path: '', redirectTo: 'journey', pathMatch: 'full' },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
