import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { SampleService, Sample } from '../../services/sample/sample.service';
import { Subscription } from 'rxjs';
import { latLng } from 'leaflet';
import { MapServiceService } from '../../services/map-service/map-service.service';

@Component({
  selector: 'app-journey',
  templateUrl: './journey.component.html',
  styleUrls: ['./journey.component.css']
})
export class JourneyComponent implements OnInit, AfterViewInit, OnDestroy {

  imports: [LeafletModule];

  samples: Array<any>; // TODO define sample types

  subscription: Subscription;

  constructor(private sampleService: SampleService, private mapServiceService: MapServiceService) {}

  ngOnInit() {}

  /* We use this instead of of ngOnInit() to ensure the leaflet map is available in its service before using it to it */
  ngAfterViewInit() {
    this.subscription = this.sampleService.getSampleSubject()
      .subscribe((sample) => {
        this.mapServiceService.addToPath(sample);
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.mapServiceService.clear();
  }

}
