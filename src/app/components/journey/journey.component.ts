import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { LeafletModule, LeafletDirective } from '@asymmetrik/ngx-leaflet';
import { SampleService, Sample } from '../../services/sample/sample.service';
import { Subscription } from 'rxjs';
import { latLng } from 'leaflet';
import * as L from 'leaflet';
import 'leaflet-providers'; // attaches a 'provider' function to L.tileLayer
import { MapServiceService } from '../../services/map-service/map-service.service';

@Component({
  template:
    '<div leaflet ' +
    '[(leafletCenter)]="mapService.viewLocation"' +
    '[(leafletZoom)]="mapService.zoomLevel"' +
    ' app-journey></div>'
})
export class JourneyWrapperComponent {
  constructor(public mapService: MapServiceService) {}
}
@Component({
  /* It is against the Angular 6 style guide to use an attribute selector for a component,
    but to inject leaflet into the constructor like this it is necessary */
  // tslint:disable-next-line
  selector: '[app-journey]',
  templateUrl: './journey.component.html',
  styleUrls: ['./journey.component.css']
})
export class JourneyComponent implements OnInit, OnDestroy {
  imports: [LeafletModule];

  leafletDirective: LeafletDirective;
  map: L.Map;
  subscription: Subscription;

  // Drawables
  path: L.Polyline;
  markers: L.Marker[];

  constructor(
    leafletDirective: LeafletDirective,
    private sampleService: SampleService,
    private mapServiceService: MapServiceService
  ) {
    this.leafletDirective = leafletDirective;
  }

  ngOnInit() {
    this.map = this.leafletDirective.getMap();
    this.mapServiceService.setupMap(this.map);

    // Setup drawables/containers
    this.path = L.polyline([], {
      color: 'red',
      weight: 3,
      opacity: 0.5,
      smoothFactor: 1
    });
    this.path.addTo(this.map);
    this.markers = [];

    // Subscribe sample data
    this.subscription = this.sampleService
      .getSampleSubject()
      .subscribe(sample => {
        this.addToPath(sample);
      });
  }

  addToPath(sample: Sample) {
    // Extend Polyline
    const latlng = L.latLng([sample.lat, sample.long]);
    this.path.addLatLng(latlng);
    // Add marker with popup
    const marker = L.marker(latlng).bindPopup(
      JSON.stringify(sample, null, '\t'),
      { offset: L.point(0, 0) }
    );
    marker.on('mouseover', () => {
      marker.openPopup();
    });
    marker.on('mouseout', () => {
      marker.closePopup();
    });
    marker.setIcon(
      L.icon({
        iconSize: [20, 20],
        iconUrl: 'leaflet/marker-icon.png',
        className: 'invisible_marker_icon'
        // shadowUrl: 'leaflet/marker-shadow.png'
      })
    );
    marker.addTo(this.map);
    this.markers.push(marker);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
