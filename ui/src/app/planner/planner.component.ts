import { Component, Injectable, OnInit, TemplateRef, ViewChild, ViewEncapsulation, ChangeDetectorRef, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { EventService, Event } from '../planner.service';
import { CalendarEvent, CalendarEventTitleFormatter, CalendarView } from 'angular-calendar';
import { addDays, addMinutes, endOfWeek } from 'date-fns';
import { WeekViewHourSegment } from 'calendar-utils';
import { fromEvent } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
  
import {NgbModal, NgbDate, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
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
  @ViewChild('content') templateRef: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;
  activeEvents: Event[];
  eventMessage: string;
  eventTime: string;


  viewDate = new Date();

  weekStartsOn: 0 = 0;

  events: CalendarEvent[] = [];

  clickedDate: Date;

  clickedColumn: number;

  dragToCreateActive = false;
  
  constructor(private cdr: ChangeDetectorRef, private modalService: NgbModal) {}

  modalRef: BsModalRef;

  closeResult = '';

  //constructor(private eventService: EventService) { 
    //this.activeEvents = [];
    //this.eventMessage = "";
    //this.eventTime = "";
    //console.log("test");
  //}

  showDayView(){
    this.view = CalendarView.Day;
  }

  //openModal(template: TemplateRef<any>) {
    //const user = {
        //id: 10
      //};
    //this.modalRef = this.modalService.show(template);
  //}

  open(content) {
    this.modalService.open(content,
    {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.closeResult = 
          `Dismissed ${this.getDismissReason(reason)}`;
        }
    );
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
      id: this.events.length,
      title: 'New event',
      start: segment.date,
      meta: {
        tmpEvent: true,
      },
      actions: [
        {
          label: '<i class="fas fa-fw fa-pencil-alt"></i>',
          onClick: ({ event }: { event: CalendarEvent }): void => {
            console.log('Edit event', event);
            this.open(this.templateRef);
            //this.modalRef = this.modalService.show(this.templateRef);
            
          },
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
