/* Angular */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

/* Leaflet */
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

/* Angular Material */
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material';

/* Angular Flex */
import { FlexLayoutModule } from '@angular/flex-layout';

/* Components*/
import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { JourneyComponent } from './components/journey/journey.component';
import { SensorsComponent } from './components/sensors/sensors.component';
import { StatusComponent } from './components/status/status.component';
import { PlanComponent } from './components/plan/plan.component';
import { MapExtrasDirective } from './directives/map-extras.directive';

/* Services */
import { MapServiceService } from './services/map-service/map-service.service';
import { SampleService } from './services/sample/sample.service';

@NgModule({
  declarations: [
    AppComponent,
    JourneyComponent,
    SensorsComponent,
    StatusComponent,
    MapExtrasDirective,
    PlanComponent
  ],
  imports: [
    // Angular
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    // Leaflet
    LeafletModule.forRoot(),
    // Material
    MatButtonModule,
    MatToolbarModule,
    AppRoutingModule,
    // Flex
    FlexLayoutModule
  ],
  providers: [MapServiceService, SampleService],
  bootstrap: [AppComponent]
})
export class AppModule { }
