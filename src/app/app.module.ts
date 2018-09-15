import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

/* Leaflet */
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

/* Angular Material */
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material';

/* Angular Flex */
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { JourneyComponent } from './components/journey/journey.component';
import { SensorsComponent } from './components/sensors/sensors.component';
import { StatusComponent } from './components/status/status.component';
import { MapExtrasDirective } from './directives/map-extras.directive';

import {MapServiceService} from './services/map-service/map-service.service';

@NgModule({
  declarations: [
    AppComponent,
    JourneyComponent,
    SensorsComponent,
    StatusComponent,
    MapExtrasDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    // Leaflet
    LeafletModule.forRoot(),
    // Material
    MatButtonModule,
    MatToolbarModule,
    AppRoutingModule,
    // Flex
    FlexLayoutModule
  ],
  providers: [MapServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
