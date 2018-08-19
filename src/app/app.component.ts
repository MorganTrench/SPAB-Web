import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Solar Powered Autonomous Boat';
  navMenuItems = [
    {text: 'Journey', route: 'journey'},
    {text: 'Sensors', route: 'sensor'},
    {text: 'Status', route: 'status'},
  ];
}
