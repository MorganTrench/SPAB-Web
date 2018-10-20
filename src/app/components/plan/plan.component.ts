import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { LeafletModule, LeafletDirective } from '@asymmetrik/ngx-leaflet';
import { SampleService, Sample } from '../../services/sample/sample.service';
import { Subscription } from 'rxjs';
import { latLng } from 'leaflet';
import * as L from 'leaflet';
import 'leaflet-providers'; // attaches a 'provider' function to L.tileLayer
import { MapServiceService } from '../../services/map-service/map-service.service';


@Component({template: '<div leaflet [(leafletCenter)]="mapService.viewLocation" app-plan></div>'})
export class PlanWrapperComponent {
  constructor(private mapService: MapServiceService) {}
}

@Component({
  /* It is against the Angular 6 style guide to use an attribute selector for a component,
    but to inject leaflet into the constructor like this it is necessary */
  // tslint:disable-next-line
  selector: '[app-plan]',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css']
})
export class PlanComponent implements OnInit {

  imports: [LeafletModule];

  leafletDirective: LeafletDirective;
  map: L.Map;

  constructor(leafletDirective: LeafletDirective, private mapServiceService: MapServiceService) {
    console.log('pc');
    this.leafletDirective = leafletDirective;
  }

  ngOnInit() {
    console.log('pi');
    this.map = this.leafletDirective.getMap();
    this.mapServiceService.setupMap(this.map);
  }

}
