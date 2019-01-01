import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { LeafletModule, LeafletDirective } from '@asymmetrik/ngx-leaflet';
import {
  LeafletMouseEvent,
  Map as LeafetMap,
  LatLng,
  marker as makeMarker,
  icon,
  Polyline,
  polyline,
  point,
  LeafletEvent,
  Marker
} from 'leaflet';
import { MapServiceService } from '../../services/map-service/map-service.service';
import {
  Command,
  CommandsService
} from 'src/app/services/commands/commands.service';
import { SampleService, Sample } from 'src/app/services/sample/sample.service';

@Component({
  template:
    '<div leaflet ' +
    '[(leafletCenter)]="mapService.viewLocation"' +
    '[(leafletZoom)]="mapService.zoomLevel" ' +
    'app-plan></div>'
})
export class PlanWrapperComponent {
  constructor(public mapService: MapServiceService) {}
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
  map: LeafetMap;
  path: Polyline;

  commands: Command[];

  currentLatLng: LatLng;
  waypoints: Marker[];
  lookup: Map<Marker, Command>;

  constructor(
    leafletDirective: LeafletDirective,
    private mapServiceService: MapServiceService,
    private commandService: CommandsService,
    private sampleService: SampleService
  ) {
    this.leafletDirective = leafletDirective;
    this.commands = commandService.getCommands();
    this.lookup = new Map();
    this.path = polyline([], {
      color: 'blue',
      weight: 3,
      opacity: 0.5,
      smoothFactor: 1
    });

    this.currentLatLng = new LatLng(0, 0, 0);
    this.waypoints = [];
  }

  ngOnInit() {
    // Map setup
    this.map = this.leafletDirective.getMap();
    this.path.addTo(this.map);

    // Generate waypoints from current commands
    this.commands.forEach(command => {
      this.addWaypointAt(new LatLng(command.lat, command.long), command);
    });
    this.map.on('click', (mouseEvent: LeafletMouseEvent) => {
      this.addWaypointAt(mouseEvent.latlng, null);
    });
    this.mapServiceService.setupMap(this.map);
    setInterval(() => {
      this.commit();
    }, 2 * 1000);

    this.sampleService.getSampleSubject().subscribe(sample => {
      this.currentLatLng = new LatLng(sample.lat, sample.long, 0);
      this.path.setLatLngs(this.generatePathLatLngs());
    });
  }

  addWaypointAt(loc: LatLng, command: Command) {
    const marker = makeMarker(loc, { draggable: true });
    marker.setIcon(
      icon({
        iconUrl: 'leaflet/marker-icon.png',
        shadowUrl: 'leaflet/marker-shadow.png',
        iconAnchor: point(12.5, 40)
      })
    );
    marker.on('move', (event: LeafletEvent) => {
      this.path.setLatLngs(this.generatePathLatLngs());
      const corresponding = this.lookup.get(marker);
      corresponding.lat = marker.getLatLng().lat;
      corresponding.long = marker.getLatLng().lng;
    });
    marker.on('dblclick', () => {
      marker.removeFrom(this.map);
      this.waypoints.splice(this.waypoints.indexOf(marker), 1);
      this.path.setLatLngs(this.generatePathLatLngs());
      this.commands.splice(this.commands.indexOf(this.lookup.get(marker)), 1);
    });
    marker.addTo(this.map);
    this.waypoints.push(marker);
    this.path.setLatLngs(this.generatePathLatLngs());
    if (command == null) {
      command = new Command('moveTo', loc.lat, loc.lng);
      this.commands.push(command);
    }
    this.lookup.set(marker, command);
  }

  private generatePathLatLngs(): Array<LatLng> {
    const pathLatLngs = this.waypoints.map(wp => wp.getLatLng());
    pathLatLngs.unshift(this.currentLatLng);
    return pathLatLngs;
  }

  commit() {
    this.commandService.setCommands(this.commands);
  }
}
