import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable()
export class EventService {
  constructor(private httpClient: HttpClient) {}

  getEventList() {
    console.log("Getting");
    return this.httpClient.get(environment.gateway + '/planner');
  }

  addEvent(event: Event) {
    console.log("Add");
    return this.httpClient.post(environment.gateway + '/planner', event);
  }

  completeEvent(event: Event) {
    return this.httpClient.put(environment.gateway + '/planner', event);
  }

  deleteEvent(event: Event) {
    return this.httpClient.delete(environment.gateway + '/planner/' + event.id);
  }
}

export class Event {
  id: string;
  name: string;
  time: string;

  constructor() { 
    this.id = "";
    this.name = "";
    this.time = "";
  }
}
