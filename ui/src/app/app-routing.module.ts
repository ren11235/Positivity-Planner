import { HomeComponent } from './home/home.component';
import { RouterModule, Routes } from "@angular/router";
import { NgModule } from '@angular/core';

import { EventComponent } from './planner/planner.component';

import { LoginComponent } from './login/login.component';
import { AuthGuard } from './helpers/auth.guard';

import { RegisterComponent } from './login/register.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'planner', component: EventComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent}
  
 
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }