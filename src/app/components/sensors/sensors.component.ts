import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import Dygraph from 'dygraphs';
import { SampleService, Sample } from 'src/app/services/sample/sample.service';
import { Subscription} from 'rxjs';
import { bufferTime, filter } from 'rxjs/operators';

@Component({
  selector: 'app-sensors',
  templateUrl: './sensors.component.html',
  styleUrls: ['./sensors.component.css']
})
export class SensorsComponent implements OnInit, OnDestroy {

  @ViewChild('tempGraph') tempGraphElem: ElementRef;
  tempGraph: Dygraph;
  tempData: [Date, number][];

  subscription: Subscription;

  constructor(private sampleServie: SampleService) {
    this.tempGraph = null; this.tempData = [];
  }

  ngOnInit() {
    this.subscription = this.sampleServie.getSampleSubject().pipe(
      bufferTime(0.05 * 1000),
      filter((samples) => (samples.length > 0))
    ).subscribe((samples) => {
      samples.forEach((sample) => {
        this.tempData.push([sample.timestamp, sample.temp]);
      });
      if (this.tempGraph != null) {
        this.tempGraph.updateOptions( { 'file': this.tempData });
      } else {
        this.tempGraph = new Dygraph(this.tempGraphElem.nativeElement, this.tempData, {});
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
