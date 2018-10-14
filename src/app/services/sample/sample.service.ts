import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SampleService extends EventEmitter<number[]> {

  baseCoordinates: number[];

  constructor() {
    super();
    this.baseCoordinates = [ -31.9505, 115.8605 ];
    this.emit(this.baseCoordinates);
    setInterval(() => {
      const angle = 2 * Math.PI * Math.random(); const dist = 0.01 * Math.random();
      const dx = dist * Math.cos(angle); let dy = dist * Math.sin(angle);
      if (dy > 0) { dy = -dy; }
      this.baseCoordinates[0] += dx; this.baseCoordinates[1] += dy;
      this.emit(this.baseCoordinates);
    }, 0.1 * 1000);
  }
}
