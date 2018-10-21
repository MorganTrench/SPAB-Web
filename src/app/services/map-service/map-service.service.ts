import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { LeafletModule, LeafletDirective } from '@asymmetrik/ngx-leaflet';


@Injectable({
  providedIn: 'root'
})
export class MapServiceService {
  viewLocation: L.LatLngLiteral;
  zoomLevel: number;

  leafletProviderKey = 'OpenStreetMap.HOT'; // 'Esri.OceanBasemap';

  constructor() {
    this.viewLocation = L.latLng([ -31.9505, 115.8605 ]);
    this.zoomLevel = 10;
  }

  getViewLocation(): L.LatLngLiteral {
    return this.viewLocation;
  }

  getZoomLevel(): number {
    return this.zoomLevel;
  }

  setupMap(map: L.Map) {
    // Load and configure map
    map.setView(this.viewLocation, this.zoomLevel, null);
    L.tileLayer.provider('OpenStreetMap.Mapnik', { attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
  }
}
