import { Component, OnInit, OnDestroy } from '@angular/core';
import { SampleService, Sample } from 'src/app/services/sample/sample.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  latestSample: Sample;

  constructor(private sampleService: SampleService) {
    this.latestSample = new Sample(new Date(), 0, 0, 300, 24000, 35);
  }

  ngOnInit() {
    this.subscription = this.sampleService.getSampleSubject().subscribe((sample) => {
      this.latestSample = sample;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
