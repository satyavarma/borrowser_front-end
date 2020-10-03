import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../models/user-model';

@Injectable({
  providedIn: 'root'
})
export class LendingService {

  constructor(private http: HttpClient) { }

  getLenders(userId: number){
    let url: string = "http://localhost:8080/user/getall/"+userId;
    return this.http.get<UserModel[]>(url)
              .pipe(catchError(this.handleError));
  }

  handleError(error){
    return throwError(error.message);
  }
}
