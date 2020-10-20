import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../models/user-model';
import { LoanModel } from '../models/loan-model';

@Injectable({
  providedIn: 'root'
})
export class LendingService {

  constructor(private http: HttpClient) { }
  getLendedTransactions(userId: number){
    let url: string = "http://localhost:8080/loan/lendedTransactions/"+userId;
    return this.http.get<any>(url)
                      .pipe(catchError(this.handleError));
  }

  getBorrowededTransactions(userId: number){
    let url: string = "http://localhost:8080/loan/borrowedTransactions/"+userId;
    return this.http.get<any>(url)
                      .pipe(catchError(this.handleError));
  }

  getSentRequests(userId: number){
    let url: string = "http://localhost:8080/loan/sentRequests/"+userId;
    return this.http.get<any>(url)
                  .pipe(catchError(this.handleError));
  }

  getNotificationRequests(userId: number){
    let url: string = "http://localhost:8080/loan/notificationRequests/"+userId;
    return this.http.get<any>(url)
                      .pipe(catchError(this.handleError));
  }
  
  getReceivedRequests(userId: number){
    let url: string = "http://localhost:8080/loan/receivedRequests/"+userId;
    return this.http.get<any>(url)
                      .pipe(catchError(this.handleError));
  }
  
  getLenders(userId: number){
    let url: string = "http://localhost:8080/user/getall/"+userId;
    return this.http.get<UserModel[]>(url)
              .pipe(catchError(this.handleError));
  }

  getLendersBySearchName(userId:number, searchName:string){
    let url: string = "http://localhost:8080/user/search/"+userId+"/"+searchName;
    return this.http.get<UserModel[]>(url)
              .pipe(catchError(this.handleError));
  }

  addLoanRequest(lenderId: number, borrowerId:number, loanData:any){
    let url: string = "http://localhost:8080/loan/add/"+borrowerId+"/"+lenderId;
    return this.http.post<any>(url, loanData)
              .pipe(catchError(this.handleError));
  }

  onUpdateRequestStatus(requestId:number, requestStatus:number){
    let url: string = "http://localhost:8080/loan/changeStatus/"+requestId+"/"+requestStatus;
    return this.http.post<any>(url,null)
      .pipe(catchError(this.handleError));
  }

  handleError(error){
    return throwError(error.message);
  }
}
