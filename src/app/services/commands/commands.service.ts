import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class CommandsService {
  nextId: number;
  commands: Command[];

  constructor() {
    this.nextId = null;
    this.commands = [];
    // TOD0: Get commands and next id from server
  }

  setCommands(newCommands: Command[]) {
    this.commands = newCommands;
  }
  getCommands(): Command[] {
    return this.commands;
  }
  // addCommands(newCommands: Command[]) { }
  // cancelCommands(oldCommands: Command[]) { }
}

export class Command {
  private id: number;
  private index: number;
  constructor(public action: string, public lat: number, public long: number) {
    this.action = action;
    this.lat = lat;
    this.long = long;
  }
  setIndex(index: number) {
    this.index = index;
  }
  getIndex(): number {
    return this.index;
  }
  setID(id: number) {
    this.id = id;
  }
  getID(): number {
    return this.id;
  }
}
