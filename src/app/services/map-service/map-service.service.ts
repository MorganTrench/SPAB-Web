import { Injectable } from '@angular/core';
import { Sample } from '../sample/sample.service';
import * as L from 'leaflet';
import 'leaflet-providers'; // attaches a 'provider' function to L.tileLayer


@Injectable({
  providedIn: 'root'
})
export class MapServiceService {
  map: L.Map;
  viewLocation: L.LatLngLiteral;

  // Drawables
  path: L.Polyline;
  markers: L.Marker[];

  leafletProviderKey = 'OpenStreetMap.HOT'; // 'Esri.OceanBasemap';

  constructor() {
    this.map = null;
    this.viewLocation = L.latLng([ -31.9505, 115.8605 ]);
    this.markers = [];
  }

  setMap(inMap: L.Map) {
    this.clear();
    this.map = inMap;
    this.path.addTo(this.map);
    this.map.setView(this.viewLocation, 7, null);
    L.tileLayer.provider('OpenStreetMap.Mapnik', { attribution: '&copy; OpenStreetMap contributors' }).addTo(this.map);
  }

  setviewLocation(viewLocation: [number, number]) {
    this.viewLocation = L.latLng(viewLocation);
    if (this.map != null) {
      this.map.setView(this.viewLocation, 7, null);
    }
  }

  addToPath(sample: Sample) {
    // Extend Polyline
    const latlng = L.latLng([sample.lat, sample.long]);
    this.path.addLatLng(latlng);
    // Add marker with popup
    const marker = L.marker(latlng).bindPopup(JSON.stringify(sample, null, '\t'), { offset: L.point(0, 0) });
    marker.on('mouseover', () => { marker.openPopup(); }); marker.on('mouseout', () => { marker.closePopup(); });
    marker.setIcon(L.icon({
      iconSize: [ 20, 20 ],
      iconUrl: 'leaflet/marker-icon.png',
      className: 'invisible_marker_icon'
      // shadowUrl: 'leaflet/marker-shadow.png'
    }));
    marker.addTo(this.map);
    this.markers.push(marker);
  }

  clear() {
    // Reset path
    if (this.path != null) { this.path.remove(); }
    this.path = L.polyline([], {
      color: 'red',
      weight: 3,
      opacity: 0.5,
      smoothFactor: 1
    });
    if (this.map != null) { this.path.addTo(this.map); }
    // Reset markers
    this.markers = this.markers.filter((value) => {
      value.remove();
      return false;
    });
  }
}
