import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy
} from '@angular/core';
import Dygraph from 'dygraphs';
import { SampleService } from 'src/app/services/sample/sample.service';
import { Subscription } from 'rxjs';
import { bufferTime, filter } from 'rxjs/operators';

@Component({
  selector: 'app-sensors',
  templateUrl: './sensors.component.html',
  styleUrls: ['./sensors.component.css']
})
export class SensorsComponent implements OnInit, OnDestroy {
  // Temperature
  tempGraph: Dygraph;
  tempData: [Date, number][];
  @ViewChild('tempGraph') tempGraphElem: ElementRef;

  // Power
  powerGraph: Dygraph;
  powerData: [Date, number][];
  @ViewChild('powerGraph') powerGraphElem: ElementRef;

  subscription: Subscription;

  constructor(private sampleServie: SampleService) {
    this.tempGraph = null;
    this.tempData = [];
    this.powerGraph = null;
    this.powerData = [];
  }

  ngOnInit() {
    this.subscription = this.sampleServie
      .getSampleSubject()
      .pipe(
        bufferTime(0.05 * 1000),
        filter(samples => samples.length > 0)
      )
      .subscribe(samples => {
        // Unpack buffer
        samples.forEach(sample => {
          this.tempData.push([sample.timestamp, sample.temp]);
          this.powerData.push([sample.timestamp, sample.power]);
        });

        // Update Temp Graph
        if (this.tempGraph != null) {
          this.tempGraph.updateOptions({ file: this.tempData });
        } else {
          console.log(this.tempData);
          this.tempGraph = new Dygraph(
            this.tempGraphElem.nativeElement,
            this.tempData,
            {
              ylabel: 'Temperature (K)',
              xlabel: 'Timestamp'
            }
          );
        }

        // Update Power Graph
        if (this.powerGraph != null) {
          this.powerGraph.updateOptions({ file: this.powerData });
        } else {
          this.powerGraph = new Dygraph(
            this.powerGraphElem.nativeElement,
            this.powerData,
            {
              stackedGraph: true,
              ylabel: 'Battery Charge (mAh)',
              xlabel: 'Timestamp'
            }
          );
        }
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
