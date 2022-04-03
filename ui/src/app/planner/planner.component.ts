import { Component, OnInit } from '@angular/core';
import { EventService, Event } from '../planner.service';

@Component({
  selector: 'app-event',
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.css']
})
export class EventComponent implements OnInit {

  activeEvents: Event[];
  eventMessage: string;
  eventTime: string;
  
  constructor(private eventService: EventService) { 
    this.activeEvents = [];
    this.eventMessage = "";
    this.eventTime = "";
  }

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.eventService.getEventList().subscribe((data: any) => {
      this.activeEvents = data;
    });
  }

  addEvent() {
    var newEvent : Event = {
      name: this.eventMessage,
      id: '',
      time: this.eventTime,
    };

    this.eventService.addEvent(newEvent).subscribe(() => {
      this.getAll();
      this.eventMessage = '';
    });
  }

  completeEvent(event: Event) {
    this.eventService.completeEvent(event).subscribe(() => {
      this.getAll();
    });
  }

  deleteEvent(event: Event) {
    this.eventService.deleteEvent(event).subscribe(() => {
      this.getAll();
    })
  }
}
