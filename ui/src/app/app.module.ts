import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';

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

import { NgbDate, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { fakeBackendProvider } from './helpers/fake-backend';


import { JwtInterceptor } from './helpers/jwt.interceptor';
import { ErrorInterceptor } from './helpers/error.interceptor';

import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    EventComponent,
    CalendarHeaderComponent,
    LoginComponent,
  ],
  imports: [
    CommonModule, 
    NgbModule,
    FormsModule, 
    CalendarModule,
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  
  ],
  providers: [
    EventService,
    //{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    //{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    // provider used to create fake backend
    fakeBackendProvider
  ],
  bootstrap: [AppComponent],
  exports: [CalendarHeaderComponent],
})
export class AppModule { }
