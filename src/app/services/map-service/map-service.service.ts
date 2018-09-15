import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-providers'; // attaches a 'provider' function to L.tileLayer


@Injectable({
  providedIn: 'root'
})
export class MapServiceService {
  map: L.Map;
  viewLocation: L.LatLngLiteral;

  leafletProviderKey = /*'OpenStreetMap.HOT';*/ 'Esri.OceanBasemap' ;

  constructor() {
    this.map = null;
    this.viewLocation = L.latLng([ -31.9505, 115.8605 ]);
  }

  setMap(inMap: L.Map) {
    this.map = inMap;
    this.map.setView(L.latLng([ -31.9505, 115.8605 ]), 7, null);
    L.tileLayer.provider(this.leafletProviderKey,
      { attribution: '&copy; OpenStreetMap contributors' }
    ).addTo(this.map);
  }

  setviewLocation(viewLocation: [number, number]) {
    this.viewLocation = L.latLng(viewLocation);
    if (this.map != null) {
      this.map.setView(this.viewLocation, 7, null);
    }
  }
}
