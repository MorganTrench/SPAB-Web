import * as L from 'leaflet';

declare module 'leaflet' {
  namespace Draw {
    export interface Polyline {
      _markers: [L.Marker];
    }
  }
}
