import { Component, OnInit , TemplateRef} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { LendingService } from '../../services/lending.service';
import { LoanModel } from 'src/app/models/loan-model';
import { BsModalService, BsModalRef} from 'ngx-bootstrap/modal';
import { BankService } from 'src/app/services/bank.service';
import { UserService } from 'src/app/services/user.service';
import { BankModel } from 'src/app/models/bank-model';
import { UserModel } from 'src/app/models/user-model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  userId:number;
  borrowedTransactions: LoanModel[];
  lendedTransactions: LoanModel[];
  repayRequest:LoanModel;
  lenderBank:BankModel;
  lendingUser:UserModel;
  modalRef: BsModalRef;
  public classLend:boolean = true;
  public classBorrow:boolean = false;
  public responseErrorNote: boolean = false;
  public responseSuccessNote: boolean = false;
  public responseNoteValue: string ="";
  interest:number=0;
  fine:number=0;
  totalAmount:number = 0;

  constructor(private datePipe: DatePipe,private userService:UserService,private bankService:BankService, private modalService: BsModalService, private router: Router, private route: ActivatedRoute, private lendingService:LendingService) { }

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
    this.onShowLended();      
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

  onRequestRepay(transaction:LoanModel){
    this.lendingService.onUpdateRequestStatus(transaction.requestId,4)
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
            transaction.requestStatus = 4;
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
      this.interest= ((amount/100)*(6));
      this.fine = 0;
      this.totalAmount = amount + this.interest + this.fine;
    }
    else if(diff<=tenure){
      this.interest= ((amount/100)*(6)*diff);
      this.fine = 0;
      this.totalAmount = amount + this.interest + this.fine;
    }
    else if(diff>tenure){
      this.interest= ((amount/100)*(6)*diff);
      this.fine = ((amount/100)*(6)*(diff-tenure));
      this.totalAmount = amount + this.interest + this.fine;
    }
    return this.interest;
  }

  refresh(): void {
    window.location.reload();
  }

  navigateNav(pageName:string){
    this.router.navigate(['../../',pageName,this.userId],{relativeTo:this.route});
  }

  onShowBorrowed(){
    this.classLend = false;
    this.classBorrow = true;
    this.lendingService.getBorrowededTransactions(this.userId)
      .subscribe(
        data =>{
          let result = data;
          if(result["statusCodeValue"] == 404){
            this.responseErrorNote=true;
            this.responseNoteValue="No Borrowed Transactions Found!..";
          }
          else if(result["statusCodeValue"] == 200){
            this.borrowedTransactions = result["body"];
            this.responseErrorNote=false;
          }
        },
        error => {
          this.responseErrorNote=true;
          this.responseNoteValue="Something went Wrong!..";
          console.log('error:',error);
        }
      );
  }
  onShowLended(){
    this.classLend = true;
    this.classBorrow = false;
    this.lendingService.getLendedTransactions(this.userId)
      .subscribe(
        data =>{
          let result = data;
          if(result["statusCodeValue"] == 404){
            this.responseErrorNote=true;
            this.responseNoteValue="No Lend Transactions Found!..";
          }
          else if(result["statusCodeValue"] == 200){
            this.lendedTransactions = result["body"];
            this.responseErrorNote=false;
          }
        },
        error => {
          this.responseErrorNote=true;
          this.responseNoteValue="Something went Wrong!..";
          console.log('error:',error);
        }
      );
  }
  onResponseCancel(){
    this.responseErrorNote = false;
    this.responseSuccessNote = false;
    this.responseNoteValue = "";
  }
  onLogout(){
    localStorage.removeItem('signedUserId');
    localStorage.removeItem('signedDate');
    this.router.navigate(['../../'],{relativeTo:this.route})
  }
}
