import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { EventService, Event } from '../planner.service';
import { CalendarEvent, CalendarView } from 'angular-calendar';
@Component({
  selector: 'app-event',
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventComponent implements OnInit {
  view: CalendarView = CalendarView.Month;
  activeEvents: Event[];
  eventMessage: string;
  eventTime: string;

  viewDate = new Date();

  events: CalendarEvent[] = [
    //{
      //title: 'An event',
      //start: new Date(),
      //color: {
        //primary: '#ad2121',
        //secondary: '#FAE3E3',
      //},
    //},
  ];

  clickedDate: Date;

  clickedColumn: number;
  
  constructor(private eventService: EventService) { 
    this.activeEvents = [];
    this.eventMessage = "";
    this.eventTime = "";
    console.log("test");
  }

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.eventService.getEventList().subscribe((data: any) => {
      this.activeEvents = data;
    });
  }

  addNewEvent() {
    console.log("We are adding an event");
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


