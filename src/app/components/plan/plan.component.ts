import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { LeafletModule, LeafletDirective } from '@asymmetrik/ngx-leaflet';
import { LeafletDrawDirective } from '@asymmetrik/ngx-leaflet-draw';
import * as L from 'leaflet';
import 'leaflet-draw';
import 'leaflet-toolbar';
import { MapServiceService } from '../../services/map-service/map-service.service';
import {
  Command,
  CommandsService
} from 'src/app/services/commands/commands.service';
import { Sample, SampleService } from 'src/app/services/sample/sample.service';
import { map } from 'rxjs/operators';

@Component({
  template:
    '<div leaflet leafletDraw ' +
    // '<div leaflet ' +
    '[(leafletCenter)]="mapService.viewLocation"' +
    '[(leafletZoom)]="mapService.zoomLevel" ' +
    '[leafletDrawOptions]="mapService.drawOptions" ' +
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
  map: L.Map;
  drawControl: L.Control.Draw;

  currentLatLng: L.LatLng;
  traveledPath: L.Polyline;

  waypoints: L.LatLng[];
  commands: Command[];
  lookup: Map<L.Marker, Command>;

  path: L.Polyline; // Previous path
  setLine: L.Polyline; // Current set plan
  planingLine: L.Draw.Polyline; // Plan we are creating/editing

  constructor(
    private leafletDirective: LeafletDirective,
    private leafletDrawDirective: LeafletDrawDirective,
    private mapServiceService: MapServiceService,
    private commandService: CommandsService,
    private sampleService: SampleService
  ) {
    this.commands = commandService.getCommands();
    this.lookup = new Map();
    this.traveledPath = new L.Polyline([], {
      color: 'red',
      weight: 3,
      opacity: 0.5,
      smoothFactor: 1
    });

    this.currentLatLng = new L.LatLng(0, 0, 0);
  }

  ngOnInit() {
    // Map setup
    this.map = this.leafletDirective.getMap();
    this.drawControl = this.leafletDrawDirective.drawControl;
    this.traveledPath.addTo(this.map);
    this.mapServiceService.setupMap(this.map);
    setInterval(() => {
      this.commit();
    }, 2 * 1000);

    // Listen for finished polyline paths
    this.map.on(L.Draw.Event.CREATED, e => {
      if (e.type === 'polyline') {
        const polyline = e.layer;
        console.log(polyline._latlngs);
      }
    });

    // Setup display of current plan
    this.setLine = new L.Polyline(
      this.commands.map(cmd => new L.LatLng(cmd.lat, cmd.long))
    );
    this.setLine.addTo(this.map);

    // Control bar for each device
    const spabEdit = L.Toolbar2.Action.extend({
      options: {
        toolbarIcon: {
          html: '<div>Edit</div>',
          tooltip: 'Edit the SPAB Route'
        }
      },
      addHooks: () => {
        /*this.plan.enable();*/
      }
    });
    const spabControls = L.Toolbar2.Action.extend({
      options: {
        toolbarIcon: {
          html: '<div>SPAB</div>',
          tooltip: "Manipulate the SPAB's future routes"
        },
        subToolbar: new L.Toolbar2.Control({
          actions: [spabEdit]
        })
      },
      addHooks: () => {
        /*this.plan.enable();*/
      }
    });

    const controlBar = new L.Toolbar2.Control({
      position: 'topleft',
      actions: [spabControls]
    });
    controlBar.addTo(this.map);

    // Generate waypoints from current commands
    this.commands.forEach(command => {});
  }

  private generatePathLatLngs(): Array<L.LatLng> {
    const pathLatLngs = this.waypoints.slice();
    pathLatLngs.unshift(this.currentLatLng);
    return pathLatLngs;
  }

  commit() {
    this.commandService.setCommands(this.commands);
  }
}
