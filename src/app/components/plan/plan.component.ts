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
  constructor(public mapService: MapServiceService) { }
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
  commands: Command[];

  setLine: L.Polyline; // Current set plan
  planingLine: any; // Plan we are creating/editing

  sampleSubscription: Subscription;

  state: String; // either 'view' or 'edit'

  constructor(
    private leafletDirective: LeafletDirective,
    private leafletDrawDirective: LeafletDrawDirective,
    private mapServiceService: MapServiceService,
    private commandService: CommandsService,
    private sampleService: SampleService
  ) {
    this.commands = null;
    this.currentLatLng = new L.LatLng(0, 0, 0);
    this.state = 'view';
  }

  ngOnInit() {
    // Map setup
    this.map = this.leafletDirective.getMap();
    this.drawControl = this.leafletDrawDirective.drawControl;
    this.mapServiceService.setupMap(this.map);

    this.map.on(L.Draw.Event.EDITED, console.log);
    this.map.on(L.Draw.Event.EDITSTART, console.log);
    this.map.on(L.Draw.Event.EDITSTOP, console.log);

    this.refreshCommands()

    // Control bar for each device
    const spabClear = L.Toolbar2.Action.extend({
      options: {
        toolbarIcon: {
          html: '<div>Clear</div>',
          tooltip: 'Clear the SPAB Route'
        }
      },
      addHooks: () => {
        controlSubToolbar._hide();
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
        // @ts-ignore
        this.planingLine = this.setLine.editing.enable();
        controlSubToolbar._hide();
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
        this.planingLine = new L.Draw.Polyline(this.map, {});
        this.planingLine.enable();
        this.commands.forEach(cmd => {
          this.planingLine.addVertex(new L.LatLng(cmd.latitude, cmd.longitude));
        });
        controlSubToolbar._hide();
      }
    });


    const commitHook = () => {
      saveSubToolbar._hide();
      // The two different editing methods result in two different types of line, handles those here
      if (this.planingLine) {
        if (this.planingLine.disable) this.planingLine.disable()
        if (this.planingLine.latlngs) {
          this.commands = this.planingLine.latlngs[0].map((x: L.LatLng) => { /* tslint:disable */
            return new Command('moveTo', x.lat, x.lng, 0)
          })
        } else if (this.planingLine._latlngs) {
          this.commands = this.planingLine._latlngs.map((x: L.LatLng) => { /* tslint:disable */
            return new Command('moveTo', x.lat, x.lng, 0)
          })
        }
        if (this.planingLine.removeFrom) this.planingLine.removeFrom(this.map)
        this.refreshSetPlanLine()
        this.commandService.updateCommands(this.commands)
      }

    }

    const commit = L.Toolbar2.Action.extend({
      options: {
        toolbarIcon: {
          html: `<div>Commit</div>`,
          tooltip: 'Commit plan changes to the server'
        }
      },
      addHooks: commitHook
    });

    // Listen for finished polyline paths
    this.map.on(L.Draw.Event.CREATED, (e: L.DrawEvents.Created) => {
      if (e.layerType === 'polyline') {
        console.log(e.layer)
        this.planingLine = e.layer
        commitHook()
      }
    });

    const discard = L.Toolbar2.Action.extend({
      options: {
        toolbarIcon: {
          html: '<div>Discard</div>',
          tooltip: 'Discard changes and revert to the existing plan'
        }
      },
      addHooks: () => {
        if (this.planingLine && this.planingLine.disable) this.planingLine.disable()
        this.refreshCommands();
        saveSubToolbar._hide();
      }
    });


    const controlSubToolbar = new L.Toolbar2.Control({
      actions: [spabAppend, spabEdit, spabClear]
    });

    const saveSubToolbar = new L.Toolbar2.Control({
      actions: [commit, discard]
    });

    const serverControls = L.Toolbar2.Action.extend({
      options: {
        toolbarIcon: {
          html: `Server`,
          className: "override",
          // tslint:disable-next-line:quotemark
          tooltip: "Manipulate the SPAB's future routes"
        },
        subToolbar: saveSubToolbar
      },
      addHooks: () => { }
    });

    const spabControls = L.Toolbar2.Action.extend({
      options: {
        toolbarIcon: {
          html: `Edit Plan`,
          className: "override",
          // tslint:disable-next-line:quotemark
          tooltip: "Manipulate the SPAB's future routes"
        },
        subToolbar: controlSubToolbar
      },
      addHooks: () => { }
    });

    const controlBar = new L.Toolbar2.Control({
      position: 'topleft',
      actions: [serverControls, spabControls]
    });
    controlBar.addTo(this.map);

    // Subscribe sample data
    this.sampleSubscription = this.sampleService
      .getSampleSubject()
      .subscribe(sample => {
        this.currentLatLng = new L.LatLng(sample.lat, sample.long);
        if (this.state === 'view') {
          // Update the set plan line with a new current position
          this.refreshSetPlanLine();
        } else { // this.state === 'edit'
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
    if (this.commands != null) {
      // Create a new setline, add it to map
      this.setLine = new L.Polyline(
        this.commands.reduce(
          (acc, cmd) => acc.concat([new L.LatLng(cmd.latitude, cmd.longitude)]),
          [this.currentLatLng]
        )
      );
      this.setLine.addTo(this.map);
    }
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

  private refreshCommands() {
    this.commandService.getCommandSubject().subscribe(commands => {
      this.commands = commands
      // Setup display of current plan
      this.refreshSetPlanLine();
    });
  }

  // commit() {
  //   this.commandService.setCommands(this.commands);
  // }
}
