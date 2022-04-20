
import { Component } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '../models/user';
import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/user.service';

@Component({ templateUrl: 'home.component.html', styleUrls: ['../app.component.css']})
export class HomeComponent {
    loading = false;
    users: User[];

    constructor(private userService: UserService) { }

    ngOnInit() {
        //this.loading = true;
        //his.userService.getAll().pipe(first()).subscribe(users => {
            //this.loading = false;
            //this.users = users;
        //});
    }
}