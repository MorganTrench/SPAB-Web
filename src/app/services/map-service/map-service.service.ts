import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-providers'; // attaches a 'provider' function to L.tileLayer
import { latLng } from 'leaflet';


@Injectable({
  providedIn: 'root'
})
export class MapServiceService {
  map: L.Map;
  path: L.Polyline;
  viewLocation: L.LatLngLiteral;

  leafletProviderKey = 'OpenStreetMap.HOT'; // 'Esri.OceanBasemap';

  constructor() {
    this.map = null;
    this.viewLocation = L.latLng([ -31.9505, 115.8605 ]);
    this.path = L.polyline([], {
      color: 'red',
      weight: 3,
      opacity: 0.5,
      smoothFactor: 1
    });
    this.path.addLatLng(L.latLng([ -31.9505, 115.8605 ]));
  }

  setMap(inMap: L.Map) {
    this.map = inMap;
    this.map.setView(L.latLng([ -31.9505, 115.8605 ]), 7, null);
    L.tileLayer.provider('OpenStreetMap.Mapnik', { attribution: '&copy; OpenStreetMap contributors' }
    ).addTo(this.map);
    this.path.addTo(this.map);
  }

  setviewLocation(viewLocation: [number, number]) {
    this.viewLocation = L.latLng(viewLocation);
    if (this.map != null) {
      this.map.setView(this.viewLocation, 7, null);
    }
  }

  addToPath(coordinates) {
    const latlng = L.latLng(coordinates);
    this.path.addLatLng(latlng);
  }
}
