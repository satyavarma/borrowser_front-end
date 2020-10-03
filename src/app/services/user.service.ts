import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SignUpUserModel } from '../models/sign-up-user-model';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators'
import { LogInUserModel } from '../models/log-in-user-model';
import { UserModel } from '../models/user-model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  doSignUp(data: SignUpUserModel){
    console.log(data);
    let url:string = "http://localhost:8080/user/signup";
    return this.http.post(url,data)
      .pipe(catchError(this.handleError));
  }

  doLogIn(data: LogInUserModel){
    let url: string = "http://localhost:8080/user/login";
    return this.http.post<UserModel>(url,data)
      .pipe(catchError(this.handleError));
  }

  getUserById(userId: number){
    let url: string= "http://localhost:8080/user/"+userId;
    return this.http.get<UserModel>(url)
      .pipe(catchError(this.handleError));
  }

  doInviteByMailId(mailId: string){
    let url: string="http://localhost:8080/user/invite/"+mailId;
    return this.http.get(url)
      .pipe(catchError(this.handleError));
  }

  handleError(error){
    return throwError(error.message);
  }
}
