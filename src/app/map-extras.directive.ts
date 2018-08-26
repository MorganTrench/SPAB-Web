import { Directive, OnInit, HostListener } from '@angular/core';
import { LeafletModule, LeafletDirective } from '@asymmetrik/ngx-leaflet';
import * as L from 'leaflet';
import 'leaflet-providers'; // attaches a 'provider' function to L.tileLayer

@Directive({
  selector: '[appMapExtras]'
})
export class MapExtrasDirective implements OnInit {
  leafletDirective: LeafletDirective;
  map: L.Map;

  constructor(leafletDirective: LeafletDirective) {
    this.leafletDirective = leafletDirective;
  }

  ngOnInit () {
    this.map = this.leafletDirective.getMap();
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
    this.map.setView(L.latLng([ -31.9505, 115.8605 ]), 7, null);
  }
}
