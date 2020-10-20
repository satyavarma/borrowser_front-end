import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { LendingService } from '../../services/lending.service';
import { LoanModel } from 'src/app/models/loan-model';
import { BankService } from 'src/app/services/bank.service';
import { UserService } from 'src/app/services/user.service';
import { BsModalService, BsModalRef} from 'ngx-bootstrap/modal';
import { BankModel } from 'src/app/models/bank-model';
import { UserModel } from 'src/app/models/user-model';



@Component({
  selector: 'app-received-requests',
  templateUrl: './received-requests.component.html',
  styleUrls: ['./received-requests.component.css']
})
export class ReceivedRequestsComponent implements OnInit {
  userId:number;
  modalRef: BsModalRef;
  receivedRequests: LoanModel[];
  acceptedRequest:LoanModel;
  repayRequest:LoanModel;
  borrowingUser:UserModel;
  lendingUser:UserModel;
  borrowingBank:BankModel;
  lenderBank: BankModel;
  public responseErrorNote: boolean = false;
  public responseSuccessNote: boolean = false;
  public responseNoteValue: string ="";
  interest:number=0;
  fine:number=0;
  totalAmount:number = 0;


  constructor(private userService:UserService,private bankService:BankService, private modalService: BsModalService, private router: Router, private route: ActivatedRoute, private lendingService:LendingService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap)=>{
      this.userId = parseInt(params.get("userId"));
    });
    let signedUserId:string = localStorage.getItem('signedUserId') ? localStorage.getItem('signedUserId') : '0' ;
    if(parseInt(signedUserId) != this.userId){
      this.onLogout();
    }
    else{
      let std = new Date(localStorage.getItem('signedDate')); 
      let newd = new Date();
      let yearDiff = std.getFullYear()-newd.getFullYear();
      let monthDiff = std.getMonth()-newd.getMonth();
      let dateDiff = std.getDate()-newd.getDate();
      if(yearDiff == 0 && monthDiff==0 && dateDiff<=1){
        let date = new Date();
        localStorage.setItem('signedDate',date.toString());
      }
      else{
        this.onLogout();
      }
    }
    this.lendingService.getReceivedRequests(this.userId)
      .subscribe(
        data =>{
          let result = data;
          if(result["statusCodeValue"] == 404){
            this.responseErrorNote=true;
            this.responseNoteValue="No Requests Currently!..";
          }
          else if(result["statusCodeValue"] == 200){
            this.receivedRequests = result["body"];
          }
        },
        error => {
          this.responseErrorNote=true;
          this.responseNoteValue="Something went Wrong!..";
          console.log('error:',error);
        }
      );
  }

  onConfirmRepayment(transaction:LoanModel){
    this.lendingService.onUpdateRequestStatus(transaction.requestId,5)
      .subscribe(
        data => {
          let result = data;
          if(result["statusCodeValue"] == 501){
            this.responseErrorNote=true;
            this.responseSuccessNote=false;
            this.responseNoteValue="Repayment Failed, Try Again!..";
          }
          else if(result["statusCodeValue"] == 202){
            this.responseErrorNote=false;
            this.responseSuccessNote=true;
            this.responseNoteValue="Repaid Suessefully!..";
            transaction.requestStatus = 5;
          }
        },
        error => {
          this.responseErrorNote=true;
          this.responseSuccessNote=false;
          this.responseNoteValue = "Unable to Repay.Something Went Wrong!..";
          console.log("error");
          console.log(error);
        }
      );
      this.modalRef.hide();
  }

  calculateInterest(amount:number, tenure:number, date:string){
    this.interest = 0;
    this.fine = 0;
    var std:any = new Date('date');
    var newd:any = new Date();
    var diff:number =  (newd.getMonth() - std.getMonth() + (12 * (newd.getFullYear() - std.getFullYear())))? (newd.getMonth() - std.getMonth() + (12 * (newd.getFullYear() - std.getFullYear()))) : 0 ;
    if(diff == 0){
      this.interest= ((amount/100)*(6/12));
      this.fine = 0;
      this.totalAmount = amount + this.interest + this.fine;
    }
    else if(diff<=tenure){
      this.interest= ((amount/100)*(6/12)*diff);
      this.fine = 0;
      this.totalAmount = amount + this.interest + this.fine;
    }
    else if(diff>tenure){
      this.interest= ((amount/100)*(6/12)*diff);
      this.fine = ((amount/100)*(6/12)*(diff-tenure));
      this.totalAmount = amount + this.interest + this.fine;
    }
    return this.interest;
  }

  refresh(): void {
    window.location.reload();
  }

  onResponseCancel(){
    this.responseErrorNote = false;
    this.responseSuccessNote = false;
    this.responseNoteValue = "";
  }

  navigateNav(pageName:string){
    this.router.navigate(['../../',pageName,this.userId],{relativeTo:this.route});
  }

  onAcceptRequest(loan:LoanModel, acceptTemplate:TemplateRef<any>){
    this.acceptedRequest = loan;
    this.userService.getUserById(this.acceptedRequest.borrowerId)
      .subscribe(
        data => {
          let result = data;
            if(result["statusCodeValue"] == 404){
              this.responseErrorNote=true;
              this.responseNoteValue = "borrower Not-Found!.."
            }
            else if(result["statusCodeValue"] == 200){
              this.borrowingUser = result["body"];
              if(this.borrowingUser.bankId != 6 ){
                this.bankService.getBankDetails(this.borrowingUser.bankId)
                  .subscribe(
                    data =>{
                      let bankResult = data;
                      if(bankResult["statusCodeValue"] == 404){
                        this.responseErrorNote=true;
                        this.responseNoteValue = "Bank Details Not-Found!.."
                      }
                      else if(bankResult["statusCodeValue"] == 200){
                        this.borrowingBank = bankResult["body"];
                      }
                    },
                    error =>{
                      this.responseErrorNote=true;
                      this.responseNoteValue = "Unable to fetch Bank Details.Something Went Wrong!..";
                      console.log("error");
                      console.log(error);
                    }
                  );
              }
              else if(this.borrowingUser.bankId == 6){
                this.modalRef.hide();
                this.responseErrorNote=true;
                this.responseNoteValue="Borrower didn't added the bank account."
              }
            }
        },
        error => {
          this.responseErrorNote=true;
          this.responseNoteValue = "Unable to fetch user.Something Went Wrong!..";
          console.log("error");
          console.log(error);
        }
      )
    this.modalRef = this.modalService.show(acceptTemplate);
  }

  onConfirmPayment(request:LoanModel){
    this.lendingService.onUpdateRequestStatus(request.requestId,2)
      .subscribe(
        data => {
          let result = data;
          if(result["statusCodeValue"] == 501){
            this.responseErrorNote=true;
            this.responseSuccessNote=false;
            this.responseNoteValue="Payment Failed, Try Again!..";
          }
          else if(result["statusCodeValue"] == 202){
            this.responseErrorNote=false;
            this.responseSuccessNote=true;
            this.responseNoteValue="Paid Suessefully!..";
            request.requestStatus = 2;
          }
        },
        error => {
          this.responseErrorNote=true;
          this.responseSuccessNote=false;
          this.responseNoteValue = "Unable to Pay.Something Went Wrong!..";
          console.log("error");
          console.log(error);
        }
      );
      this.modalRef.hide();
  }

  onRejectRequest(request:LoanModel){
    this.lendingService.onUpdateRequestStatus(request.requestId,3)
      .subscribe(
        data => {
          let result = data;
          if(result["statusCodeValue"] == 501){
            this.responseErrorNote=true;
            this.responseSuccessNote=false;
            this.responseNoteValue="Unable to Reject!..";
          }
          else if(result["statusCodeValue"] == 202){
            this.responseErrorNote=false;
            this.responseSuccessNote=true;
            this.responseNoteValue="Rejected!..";
            request.requestStatus = 3;
          }
        },
        error => {
          this.responseErrorNote=true;
          this.responseSuccessNote=false;
          this.responseNoteValue = "Unable to Reject.Something Went Wrong!..";
          console.log("error");
          console.log(error);
        }
      );
  }

  onRepayDialog(loan:LoanModel, acceptTemplate:TemplateRef<any>){
    console.log("called");
    console.log(loan);
    this.repayRequest = loan;
    this.userService.getUserById(this.repayRequest.lenderId)
      .subscribe(
        data => {
          let result = data;
            if(result["statusCodeValue"] == 404){
              this.responseErrorNote=true;
              this.responseNoteValue = "Lender Not-Found!.."
            }
            else if(result["statusCodeValue"] == 200){
              this.lendingUser = result["body"];
              if(this.lendingUser.bankId != 6 ){
                this.bankService.getBankDetails(this.lendingUser.bankId)
                  .subscribe(
                    data =>{
                      let bankResult = data;
                      if(bankResult["statusCodeValue"] == 404){
                        this.responseErrorNote=true;
                        this.responseNoteValue = "Bank Details Not-Found!.."
                      }
                      else if(bankResult["statusCodeValue"] == 200){
                        this.lenderBank = bankResult["body"];
                      }
                    },
                    error =>{
                      this.responseErrorNote=true;
                      this.responseNoteValue = "Unable to fetch Bank Details.Something Went Wrong!..";
                      console.log("error");
                      console.log(error);
                    }
                  );
              }
              else if(this.lendingUser.bankId == 6){
                this.modalRef.hide();
                this.responseErrorNote=true;
                this.responseNoteValue="Lender didn't added the bank account."
              }
            }
        },
        error => {
          this.responseErrorNote=true;
          this.responseNoteValue = "Unable to fetch user.Something Went Wrong!..";
          console.log("error");
          console.log(error);
        }
      )
    this.modalRef = this.modalService.show(acceptTemplate);
  }
  onLogout(){
    localStorage.removeItem('signedUserId');
    localStorage.removeItem('signedDate');
    this.router.navigate(['../../'],{relativeTo:this.route})
  }
}
