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
import { Subscription } from 'rxjs';

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

  waypoints: L.LatLng[];
  commands: Command[];

  path: L.Polyline; // Previous path
  setLine: L.Polyline; // Current set plan
  planingLine: L.Draw.Polyline; // Plan we are creating/editing

  sampleSubscription: Subscription;

  state: String;

  constructor(
    private leafletDirective: LeafletDirective,
    private leafletDrawDirective: LeafletDrawDirective,
    private mapServiceService: MapServiceService,
    private commandService: CommandsService,
    private sampleService: SampleService
  ) {
    this.commands = commandService.getCommands();
    this.currentLatLng = new L.LatLng(0, 0, 0);
    this.state = 'view';
  }

  ngOnInit() {
    // Map setup
    this.map = this.leafletDirective.getMap();
    this.drawControl = this.leafletDrawDirective.drawControl;
    this.mapServiceService.setupMap(this.map);
    setInterval(() => {
      this.commit();
    }, 2 * 1000);

    // Listen for finished polyline paths
    this.map.on(L.Draw.Event.CREATED, e => {
      if (e.type === 'polyline') {
        // const polyline = e.layer;
        // console.log(polyline._latlngs);
      }
    });

    // Setup display of current plan
    this.refreshSetPlanLine();

    // Control bar for each device
    const spabClear = L.Toolbar2.Action.extend({
      options: {
        toolbarIcon: {
          html: '<div>Clear</div>',
          tooltip: 'Clear the SPAB Route'
        }
      },
      addHooks: () => {
        /*this.plan.enable();*/
      }
    });
    const spabEdit = L.Toolbar2.Action.extend({
      options: {
        toolbarIcon: {
          html: '<div>Modify</div>',
          tooltip: 'Edit the existing SPAB Route'
        }
      },
      addHooks: () => {
        /*this.plan.enable();*/
      }
    });
    const spabAppend = L.Toolbar2.Action.extend({
      options: {
        toolbarIcon: {
          html: '<div>Append</div>',
          tooltip: 'Create/Replace the SPAB Route'
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
          // tslint:disable-next-line:quotemark
          tooltip: "Manipulate the SPAB's future routes"
        },
        subToolbar: new L.Toolbar2.Control({
          actions: [spabAppend, spabEdit, spabClear]
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

    // Subscribe sample data
    this.sampleSubscription = this.sampleService
      .getSampleSubject()
      .subscribe(sample => {
        this.currentLatLng = new L.LatLng(sample.lat, sample.long);
        if (this.state === 'view') {
          // Update the set plan line with a new current position
          this.refreshSetPlanLine();
        } else {
          // Move first point in editing line
          this.refreshEditablePlanLine();
        }
      });
  }

  private refreshSetPlanLine() {
    // Remove previous line if it exists
    if (this.setLine) {
      this.setLine.removeFrom(this.map);
    }
    // Create a new setline, add it to map
    this.setLine = new L.Polyline(
      this.commands.reduce(
        (acc, cmd) => acc.concat([new L.LatLng(cmd.lat, cmd.long)]),
        [this.currentLatLng]
      )
    );
    this.setLine.addTo(this.map);
  }

  private refreshEditablePlanLine() {
    // Old line points
    // const latLngs = this.planingLine._markers.map(x => x.getLatLng());
    // latLngs.splice(0, 1, this.currentLatLng);
    console.log(this.setLine.getLatLngs());

    // const latLngs = this.setLine.getLatLngs();
    // latLngs.splice(0, 1, this.currentLatLng);

    // this.setLine.removeFrom(this.map);

    // this.setLine = new
  }

  commit() {
    this.commandService.setCommands(this.commands);
  }
}
