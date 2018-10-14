import { Directive, OnInit, HostListener, OnDestroy } from '@angular/core';
import { LeafletModule, LeafletDirective } from '@asymmetrik/ngx-leaflet';
import * as L from 'leaflet';
import 'leaflet-providers'; // attaches a 'provider' function to L.tileLayer
import { MapServiceService } from '../services/map-service/map-service.service';

@Directive({
  selector: '[appMapExtras]'
})
export class MapExtrasDirective implements OnInit, OnDestroy{
  leafletDirective: LeafletDirective;
  mapService: MapServiceService;

  constructor(leafletDirective: LeafletDirective, mapService: MapServiceService) {
    this.leafletDirective = leafletDirective;
    this.mapService = mapService;
  }

  ngOnInit () {
    this.mapService.setMap(this.leafletDirective.getMap());
  }

  ngOnDestroy () {}
}
