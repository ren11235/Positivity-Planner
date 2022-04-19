import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { Observable } from 'rxjs';
import { User } from './models/user';

@Injectable()
export class EventService {
  constructor(private httpClient: HttpClient) {}
  public user: User;
  getEventList() {
    console.log("Getting");
    let userStr: string = localStorage.getItem('currentUser');

    if (userStr) {
        this.user = JSON.parse(userStr) as User;
    }
    else{
      console.log("No string available");
      return;
    }
    //let user = JSON.parse(localStorage.getItem('user')) as User;
    if(this.user == null){
      console.log("No User Found");
      return;
    }
    return this.httpClient.get(environment.gateway + '/planner/' + this.user.id);
  }

  addEvent(event: CalendarEvent) {
    console.log("Add");
    console.log(event.primary);
    console.log(event.secondary);
    return this.httpClient.post(environment.gateway + '/planner/' + this.user.id, event);
  }


  deleteEvent(event: CalendarEvent) {
    return this.httpClient.delete(environment.gateway + '/planner/' + this.user.id + "/" + event.id);
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
