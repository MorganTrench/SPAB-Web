import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SampleService {

  RS: ReplaySubject<Sample>;
  currentVal: Sample;

  batteryCapacity = 24000;
  periodMs = 120 * 1000.0 * 4;

  constructor() {
    this.currentVal = new Sample(new Date(), -31.9505, 115.8605, 300, this.batteryCapacity);
    this.RS = new ReplaySubject();

    setInterval(() => {
      this.currentVal.timestamp = new Date();
      const angle = 2 * Math.PI * Math.random(); const dist = 0.01 * Math.random();
      const dx = dist * Math.cos(angle); let dy = dist * Math.sin(angle);
      if (dy > 0) { dy = -dy; }
      this.currentVal.lat += dx; this.currentVal.long += dy;
      this.currentVal.temp += (Math.random() > 0.5) ? 0.25 * Math.random() : -0.25 * Math.random();
      this.currentVal.power = Math.abs(this.batteryCapacity * Math.cos(((this.currentVal.timestamp.getTime() % this.periodMs) / this.periodMs + Math.random() * 0.02) * 2 * Math.PI ));
      this.currentVal.power = Math.max(this.currentVal.power, this.batteryCapacity * 0.02);
      this.RS.next({...this.currentVal});
    }, 0.5 * 1000);
  }

  getSampleSubject(): ReplaySubject<Sample> { return this.RS; }
}

export class Sample {
  constructor(public timestamp: Date, public lat: number, public long: number, public temp: number, public power: number) {
    this.timestamp = timestamp; this.lat = lat; this.long = long; this.temp = temp; this.power = power;
  }
}
