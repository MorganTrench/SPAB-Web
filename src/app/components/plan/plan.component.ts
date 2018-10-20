import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { LeafletModule, LeafletDirective } from '@asymmetrik/ngx-leaflet';
import { LeafletMouseEvent, Map, LatLng, marker as makeMarker, icon, Polyline, polyline, point, LeafletEvent, Marker } from 'leaflet';
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
  map: Map;

  waypoints: Marker[];
  path: Polyline;

  constructor(leafletDirective: LeafletDirective, private mapServiceService: MapServiceService) {
    this.leafletDirective = leafletDirective;
    this.waypoints = [];
    this.path = polyline([], {
      color: 'red',
      weight: 3,
      opacity: 0.5,
      smoothFactor: 1
    });
  }

  ngOnInit() {
    this.map = this.leafletDirective.getMap();
    this.path.addTo(this.map);
    this.map.on('click', (mouseEvent: LeafletMouseEvent) => {
      this.addWaypointAt(mouseEvent.latlng);
    });
    this.mapServiceService.setupMap(this.map);
  }

  addWaypointAt(loc: LatLng) {
    const marker = makeMarker(loc, {draggable: true});
    marker.setIcon(icon({
      iconUrl: 'leaflet/marker-icon.png',
      shadowUrl: 'leaflet/marker-shadow.png',
      iconAnchor: point(12.5, 40)
    }));
    marker.on('move', (event: LeafletEvent) => {
      this.path.setLatLngs(this.waypoints.map((wp) => wp.getLatLng()));
    });
    marker.on('dblclick', () => {
      console.log('double click, removing');
      marker.removeFrom(this.map);
      this.waypoints.splice(this.waypoints.indexOf(marker), 1);
    });
    marker.addTo(this.map);
    this.waypoints.push(marker);
    this.path.setLatLngs(this.waypoints.map((wp) => wp.getLatLng()));
  }

}
