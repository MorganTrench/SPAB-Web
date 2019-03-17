/* Imports */
// Angular
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
// Leaflet
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';
// Angular Material
import {
  MatButtonModule,
  MatToolbarModule,
  MatCardModule,
  MatProgressBarModule
} from '@angular/material';
// Angular Flex
import { FlexLayoutModule } from '@angular/flex-layout';
// Socket.io
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
const socket_io_config: SocketIoConfig = {
  url: 'http://localhost:3000',
  options: {}
};

/* Custom */
// Modules
import { AppRoutingModule } from './app-routing.module';
// Component
import { AppComponent } from './app.component';
import {
  JourneyComponent,
  JourneyWrapperComponent
} from './components/journey/journey.component';
import {
  PlanComponent,
  PlanWrapperComponent
} from './components/plan/plan.component';
import { SensorsComponent } from './components/sensors/sensors.component';
import { StatusComponent } from './components/status/status.component';
// Services
import { MapServiceService } from './services/map-service/map-service.service';
import { SampleService } from './services/sample/sample.service';

@NgModule({
  declarations: [
    AppComponent,
    JourneyComponent,
    JourneyWrapperComponent,
    PlanComponent,
    PlanWrapperComponent,
    SensorsComponent,
    StatusComponent
  ],
  imports: [
    // Angular
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    // Leaflet
    LeafletModule.forRoot(),
    LeafletDrawModule.forRoot(),
    // Material
    MatButtonModule,
    MatToolbarModule,
    AppRoutingModule,
    MatCardModule,
    MatProgressBarModule,
    // Flex
    FlexLayoutModule,
    // Socket.io
    SocketIoModule.forRoot(socket_io_config)
  ],
  providers: [MapServiceService, SampleService],
  bootstrap: [AppComponent]
})
export class AppModule {}
