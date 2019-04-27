import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommandsService {
  private BS: BehaviorSubject<Command[]>;

  commands: Command[];

  private sourceUrl = 'http://therevproject.com/solarboat/api/command.cgi';

  constructor(private http: HttpClient) {
    this.commands = [];
    this.BS = new BehaviorSubject(this.commands);

    http.get(this.sourceUrl).subscribe((res: any) => {
      console.log(res)
      this.commands = res.data;
      this.BS.next(this.commands);
    });
  }

  updateCommands(newCommands: Command[]) {
    this.http.put(this.sourceUrl, newCommands).subscribe((res: any) => {
      // TODO: handle error case
    });
  }

  getCommandSubject(): BehaviorSubject<Command[]> {
    return this.BS;
  }
}

export class Command {
  private id: number;
  private uuid: string;
  constructor(
    public action: string,
    public latitude: number,
    public longitude: number,
    public duration: number
  ) {
    this.action = action;
    this.latitude = latitude;
    this.longitude = longitude;
    this.duration = duration;
  }
}
