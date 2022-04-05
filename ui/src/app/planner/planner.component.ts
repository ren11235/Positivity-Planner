import { Component, Injectable, OnInit, ViewEncapsulation, ChangeDetectorRef, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { EventService, Event } from '../planner.service';
import { CalendarEvent, CalendarEventTitleFormatter, CalendarView } from 'angular-calendar';
import { addDays, addMinutes, endOfWeek } from 'date-fns';
import { WeekViewHourSegment } from 'calendar-utils';
import { fromEvent } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
function floorToNearest(amount: number, precision: number) {
  return Math.floor(amount / precision) * precision;
}

function ceilToNearest(amount: number, precision: number) {
  return Math.ceil(amount / precision) * precision;
}

@Injectable()
export class CustomEventTitleFormatter extends CalendarEventTitleFormatter {
  weekTooltip(event: CalendarEvent, title: string) {
    if (!event.meta.tmpEvent) {
      return super.weekTooltip(event, title);
    }
  }

  dayTooltip(event: CalendarEvent, title: string) {
    if (!event.meta.tmpEvent) {
      return super.dayTooltip(event, title);
    }
  }
}

@Component({
  selector: 'app-event',
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,

  providers: [
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter,
    },
  ],
  styles: [
    `
      .disable-hover {
        pointer-events: none;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})


export class EventComponent{
  view: CalendarView = CalendarView.Month;
  activeEvents: Event[];
  eventMessage: string;
  eventTime: string;

  viewDate = new Date();

  weekStartsOn: 0 = 0;

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

  dragToCreateActive = false;
  
  constructor(private cdr: ChangeDetectorRef) {}

  //constructor(private eventService: EventService) { 
    //this.activeEvents = [];
    //this.eventMessage = "";
    //this.eventTime = "";
    //console.log("test");
  //}

  startDragToCreate(
    segment: WeekViewHourSegment,
    mouseDownEvent: MouseEvent,
    segmentElement: HTMLElement
  ) {
    const dragToSelectEvent: CalendarEvent = {
      id: this.events.length,
      title: 'New event',
      start: segment.date,
      meta: {
        tmpEvent: true,
      },
    };
    this.events = [...this.events, dragToSelectEvent];
    const segmentPosition = segmentElement.getBoundingClientRect();
    this.dragToCreateActive = true;
    const endOfView = endOfWeek(this.viewDate, {
      weekStartsOn: this.weekStartsOn,
    });

    fromEvent(document, 'mousemove')
      .pipe(
        finalize(() => {
          delete dragToSelectEvent.meta.tmpEvent;
          this.dragToCreateActive = false;
          this.refresh();
        }),
        takeUntil(fromEvent(document, 'mouseup'))
      )
      .subscribe((mouseMoveEvent: MouseEvent) => {
        const minutesDiff = ceilToNearest(
          mouseMoveEvent.clientY - segmentPosition.top,
          30
        );

        const daysDiff =
          floorToNearest(
            mouseMoveEvent.clientX - segmentPosition.left,
            segmentPosition.width
          ) / segmentPosition.width;

        const newEnd = addDays(addMinutes(segment.date, minutesDiff), daysDiff);
        if (newEnd > segment.date && newEnd < endOfView) {
          dragToSelectEvent.end = newEnd;
        }
        this.refresh();
      });
  }

  private refresh() {
    this.events = [...this.events];
    this.cdr.detectChanges();
  }


  /*ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.eventService.getEventList().subscribe((data: any) => {
      this.activeEvents = data;
    });
  }

  addNewEvent() {
    //var event: CalendarEvent =
      //{
        //title: 'Has custom class',
        //color: {
         // primary: '#ad2121',
        // // secondary: '#FAE3E3',
       //},
       // start: new Date(),
        //cssClass: 'my-custom-class',
      //};
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

*/
}
