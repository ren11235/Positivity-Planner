import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
;
import { EventComponent } from './planner/planner.component';
import { EventService } from './planner.service';
import { FormsModule } from '@angular/forms';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarHeaderComponent } from './header';

import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    EventComponent,
    CalendarHeaderComponent,
  ],
  imports: [
    CommonModule, 
    FormsModule, 
    CalendarModule,
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  
  ],
  providers: [EventService],
  bootstrap: [AppComponent],
  exports: [CalendarHeaderComponent],
})
export class AppModule { }
