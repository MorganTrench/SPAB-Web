import { Directive, OnInit, HostListener } from '@angular/core';
import { LeafletModule, LeafletDirective } from '@asymmetrik/ngx-leaflet';
import * as L from 'leaflet';
import 'leaflet-providers'; // attaches a 'provider' function to L.tileLayer
import { MapServiceService } from '../services/map-service/map-service.service';

@Directive({
  selector: '[appMapExtras]'
})
export class MapExtrasDirective implements OnInit {
  leafletDirective: LeafletDirective;
  map: L.Map;
  mapService: MapServiceService;

  leafletProviderKey = /*'OpenStreetMap.HOT';*/ 'Esri.OceanBasemap' ;

  constructor(leafletDirective: LeafletDirective, mapService: MapServiceService) {
    this.leafletDirective = leafletDirective;
    this.mapService = mapService;
  }

  ngOnInit () {
    this.mapService.setMap(this.leafletDirective.getMap());
    this.map = this.leafletDirective.getMap();
    L.tileLayer.provider(this.leafletProviderKey,
      { attribution: '&copy; OpenStreetMap contributors' }
    ).addTo(this.map);
    // this.map.setView(L.latLng([ -31.9505, 115.8605 ]), 7, null);
  }
}
