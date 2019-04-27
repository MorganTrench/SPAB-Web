import { Injectable } from '@angular/core';
import { ReplaySubject, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SampleService {
  RS: ReplaySubject<Sample>;

  // This variable only exists for generating dummy data
  currentVal: Sample;

  salinity = 15.0;
  batteryCapacity = 24000;
  periodMs = 120 * 1000.0 * 4;

  private sourceUrl = 'http://therevproject.com/solarboat/api/data.cgi';

  constructor(private http: HttpClient) {
    this.currentVal = new Sample(
      new Date(),
      -31.9505,
      115.8605,
      300,
      this.batteryCapacity,
      35.0
    );
    this.RS = new ReplaySubject();

    http.get(this.sourceUrl).subscribe((samples: Array<any>) => {
      this.processData(samples);
      setInterval(() => {
        this.http
          .get(this.sourceUrl, {
            params: new HttpParams().set(
              'fromTimestamp',
              `${this.currentVal.timestamp.getTime()}`
            )
          })
          .subscribe((newSamples: Array<any>) => {
            if (newSamples && newSamples.length > 0) {
              this.processData(newSamples);
            }
          });
      }, 2500);
    });
  }

  private processData(samples: Array<any>) {
    console.log('new data:', samples)
    samples.reverse(); // We recieve the data ordered with the most recent values first, we want to process them chronologically
    samples.forEach(sampleData => {
      const power = this.calcNextPower();
      const salinity = this.calcNextSalinity();
      const valid = Sample.validateFields(
        sampleData.timestamp,
        sampleData.latitude,
        sampleData.longitude,
        sampleData.temperature,
        power,
        salinity
      );
      if (valid) {
        const sample = new Sample(
          new Date(sampleData.timestamp),
          sampleData.latitude,
          sampleData.longitude,
          sampleData.temperature,
          power,
          salinity
        );
        this.currentVal = sample;
        this.RS.next(sample);
      }
    });
  }

  getSampleSubject(): ReplaySubject<Sample> {
    return this.RS;
  }

  private calcNextSalinity(): number {
    this.salinity +=
      Math.random() > 0.5 ? 0.25 * Math.random() : -0.25 * Math.random();
    this.salinity = this.salinity < 20 ? 20 : this.salinity;
    this.salinity = this.salinity < 20 ? 20 : this.salinity;
    return this.salinity;
  }

  private calcNextPower(): number {
    // Power
    let power = Math.abs(
      this.batteryCapacity *
        Math.cos(
          ((this.currentVal.timestamp.getTime() % this.periodMs) /
            this.periodMs +
            Math.random() * 0.005) *
            2 *
            Math.PI
        )
    );
    power = Math.max(this.currentVal.power, this.batteryCapacity * 0.02);
    return power;
  }
}

export class Sample {
  constructor(
    public timestamp: Date,
    public lat: number,
    public long: number,
    public temp: number,
    public power: number,
    public salinity: number
  ) {
    this.timestamp = timestamp;
    this.lat = lat;
    this.long = long;
    this.temp = temp;
    this.power = power;
    this.salinity = salinity;
  }
  static validateFields(
    timestamp: any,
    lat: any,
    long: any,
    temp: any,
    power: any,
    salinity: any
  ) {
    return (
      timestamp != null &&
      lat != null &&
      long != null &&
      temp != null &&
      power != null &&
      salinity != null
    );
  }
}
