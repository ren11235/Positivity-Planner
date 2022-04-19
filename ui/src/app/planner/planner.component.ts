import { Component, Injectable, OnInit, TemplateRef, ViewChild, ViewEncapsulation, ChangeDetectorRef, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { EventService, Event } from '../planner.service';
import { CalendarEvent, CalendarEventTitleFormatter, CalendarView } from 'angular-calendar';
import { addDays, addMinutes, endOfWeek, set} from 'date-fns';
import { WeekViewHourSegment } from 'calendar-utils';
import { fromEvent } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../models/user';
  
import {NgbModal, NgbModalOptions, NgbDatepicker, NgbModalRef, NgbDate, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
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
  //changeDetection: ChangeDetectionStrategy.OnPush,
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
  @ViewChild('content') templateRef: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;
  activeEvents: Event[];
  eventMessage: string;
  eventTime: string;

  color_themes = {
    "Red": {
      primary: '#ad2121',
      secondary: '#fa9e9e',
    },
    "Blue": {
      primary: '#0d64a6',
      secondary: '#c1daed',
    },
    "Yellow": {
      primary: '#ffee0c',
      secondary: '#f8f29a' 
    },
    "Orange": {
      primary: '#ff8200',
      secondary: '#ffcb95' 
    },
    "Green": {
      primary: '#398c15',
      secondary: '#95dc77'
    },
  
    "Purple": {
      primary: '#5e34ca',
      secondary:'#d3c3fc'
    },
  
    "Grey": {
      primary: '#000000',
      secondary: '#e4e3e3'
    },
  
    "Brown":{
      primary: '#6b4d2f',
      secondary: '#dcc2a6'
    },

  }

  currEvent: CalendarEvent;
  tempStart: string;
  tempEnd: string;

  viewDate = new Date();

  weekStartsOn: 0 = 0;

  constructor(private cdr: ChangeDetectorRef, private modalService: NgbModal, private eventService: EventService, private authService: AuthenticationService) {}

  events: CalendarEvent[] = [];

  //events: CalendarEvent[] = [];

  clickedDate: Date;

  clickedColumn: number;

  dragToCreateActive = false;
  
  

  modalRef: NgbModalRef;

  closeResult = '';

  
  changeColor(color){
    this.currEvent.primary = this.color_themes[color].primary;
    this.currEvent.secondary = this.color_themes[color].secondary;
    this.currEvent.color = this.color_themes[color];
  }
  
  showDayView(){
    this.view = CalendarView.Day;
  }
  
  changeDateTime(){
    //console.log(this.tempStart);
    let time_component_start = this.tempStart.split(":");
    let new_hour_start = time_component_start[0];
    let new_minute_start = time_component_start[1];

    let time_component_end = this.tempEnd.split(":");
    let new_hour_end = time_component_end[0];
    let new_minute_end = time_component_start[1];

    this.currEvent.start = set(this.currEvent.start, {hours: Number(new_hour_start), minutes: Number(new_minute_start)});
    this.currEvent.end = set(this.currEvent.end, {hours: Number(new_hour_end), minutes: Number(new_minute_end)});
  }
  //openModal(template: TemplateRef<any>) {
    //const user = {
        //id: 10
      //};
    //this.modalRef = this.modalService.show(template);
  //}

  logoutScreenOptions: NgbModalOptions = {
    backdrop: 'static',
  };

  open(content) {
    this.modalRef = this.modalService.open(content, this.logoutScreenOptions);
   this.modalRef.result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    console.log(this.closeResult);
    if(this.closeResult == `Dismissed with Add click`){
      delete this.currEvent.meta.tmpEvent;
    }
    
    this.refresh();
    this.getAll();
    this.refresh();
    });
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  startDragToCreate(
    segment: WeekViewHourSegment,
    mouseDownEvent: MouseEvent,
    segmentElement: HTMLElement
  ) {
    const dragToSelectEvent: CalendarEvent = {
      id: this.events.length.toString(),
      title: 'New event',
      start: segment.date,
      meta: {
        tmpEvent: true,
      },
      color: {
        primary: '#ad2121',
          secondary: '#fa9e9e',
      },
        primary: '#ad2121',
        secondary: '#fa9e9e',
     
      actions: [
        {
          label: '<i class="fas fa-fw fa-pencil-alt"></i>',
          onClick: ({ event }: { event: CalendarEvent }): void => {
            console.log('Edit event', event);
            this.open(this.templateRef);
            //this.modalRef = this.modalService.show(this.templateRef);
            
          },
          
        },
        {
          label: '<i class="fa fa-trash"></i>',
          onClick: ({ event }: { event: CalendarEvent }): void => {
            console.log('Delete Event', event);
            this.deleteEvent(dragToSelectEvent);
            //this.modalRef = this.modalService.show(this.templateRef);
          }
        },
        
      ],
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
          this.dragToCreateActive = false;
          this.currEvent = dragToSelectEvent;
          this.open(this.templateRef);
          
          //console.log("CLOSING WITH" + returnValue);
          
          //if (returnValue == "Add click"){
            
          //}
          
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

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    console.log("Getting all events");
    this.eventService.getEventList().subscribe((data: any) => {
      let tempEvents: CalendarEvent[] = [];
      for (let i = 0; i < data.length; i++){
        
        let newEvent: CalendarEvent = {
          id: this.events.length.toString(),
          title: 'New event',
          start: new Date(),
          
          meta: {
            tmpEvent: true,
          },
          
            primary: '#ad2121',
            secondary: '#fa9e9e',
          color : {
            primary: '#ad2121',
            secondary: '#fa9e9e',
          },
          actions: [
            {
              label: '<i class="fas fa-fw fa-pencil-alt"></i>',
              onClick: ({ event }: { event: CalendarEvent }): void => {
                console.log('Edit event');
                this.open(this.templateRef);
              },
            },
            {
              label: '<i class="fa fa-trash"></i>',
              onClick: ({ event }: { event: CalendarEvent }): void => {
                console.log('Delete event');
                this.deleteEvent(newEvent);
              }
            },
          ],
        };
        newEvent.id = data[i].id;
        newEvent.title = data[i].title;
        newEvent.start = new Date(data[i].start);
        newEvent.end = new Date(data[i].end); 
        newEvent.primary = data[i].primary;
        newEvent.secondary = data[i].secondary;
        newEvent.color.primary = data[i].primary;
        newEvent.color.secondary = data[i].secondary; 
        
        delete newEvent.meta.tmpEvent;
        
        tempEvents =  [...tempEvents, newEvent];
      }

      this.events = tempEvents;
      //console.log(data);
      //console.log(tempEvents);
      console.log(this.events);
      //this.events = data;
    });
    this.refresh();
  }

  addNewEvent(newCalendarEvent: CalendarEvent) {
    
    console.log("We are adding an event");
    
    this.eventService.addEvent(newCalendarEvent).subscribe(() => {
      this.events = [...this.events, newCalendarEvent];
      this.refresh();
      //this.getAll();
    });
    
  }

  deleteEvent(event: CalendarEvent) {
    this.eventService.deleteEvent(event).subscribe(() => {
      const index = this.events.indexOf(event);
      if (index > -1) {
        this.events.splice(index, 1); // 2nd parameter means remove one item only
      }
      this.refresh(); 
      //this.getAll(); 
    })
     
  }
}
