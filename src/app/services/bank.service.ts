import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BankAddDetailsModel } from '../models/bank-add-details-model';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { BankModel } from '../models/bank-model';

@Injectable({
  providedIn: 'root'
})
export class BankService {

  constructor(private http: HttpClient) { }

  doBankRegister(userId:number, data: BankAddDetailsModel){
    let url: string = "http://localhost:8080/bank/add/"+userId;
    return this.http.post(url,data)
              .pipe(catchError(this.handleError));
  }

  getBankDetails(bankId:number){
    let url: string = "http://localhost:8080/bank/get/"+bankId;
    return this.http.get<BankModel>(url)
              .pipe(catchError(this.handleError));
  }
  handleError(error){
    return throwError(error.message);
  }
}
