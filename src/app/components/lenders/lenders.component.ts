import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {UserModel} from '../../models/user-model';
import { LendingService } from '../../services/lending.service';
import { BsModalService, BsModalRef} from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-lenders',
  templateUrl: './lenders.component.html',
  styleUrls: ['./lenders.component.css']
})
export class LendersComponent implements OnInit {

  public responseErrorNote: boolean = false;
  public responseSuccessNote: boolean = false;
  public responseNoteValue: string ="";
  userId:number;
  requestingLender: UserModel;
  lenders: UserModel[];
  modalRef: BsModalRef;
  public loanRequestForm: FormGroup;
  LoanRequestInvalidError:string = "";

  constructor(private fb: FormBuilder, private modalService: BsModalService, private router: Router, private route: ActivatedRoute, private lendingService:LendingService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap)=>{
      this.userId = parseInt(params.get("userId"));
    });
    let signedUserId:string = localStorage.getItem('signedUserId') ? localStorage.getItem('signedUserId') : '0' ;
    if(parseInt(signedUserId) != this.userId){
      localStorage.removeItem('signedUserId');
      this.router.navigate(['../../'],{relativeTo:this.route});
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
        localStorage.removeItem('signedUserId');
        localStorage.removeItem('signedDate');
        this.router.navigate(['../../'],{relativeTo:this.route});
      }
    }
    this.lendingService.getLenders(this.userId)
      .subscribe(
        data =>{
          let result = data;
          if(result["statusCodeValue"] == 404){
            this.responseErrorNote=true;
            this.responseNoteValue="Unable to get the borrowers!..";
          }
          else if(result["statusCodeValue"] == 200){
            this.lenders = result["body"];
          }
        },
        error => {
          this.responseErrorNote=true;
          this.responseNoteValue="Something went Wrong!..";
          console.log('error:',error);
        }
      );

      this.loanRequestForm = this.fb.group({
        loanAmount: ['',[Validators.required]],
        loanReason: ['',[Validators.required]],
        tenure: ['',[Validators.required]],
      });
  }
  refresh(): void {
    window.location.reload();
  }

  onLoadRequestSubmit(){
    if(this.loanRequestForm.invalid){
      this.LoanRequestInvalidError="Fill the input fields correctrly and then submit";
    }
    else{
      this.LoanRequestInvalidError="";
      this.lendingService.addLoanRequest(this.requestingLender.userId,this.userId,this.loanRequestForm.value)
      .subscribe(
        data => {
          let result = data;
          if(result["statusCodeValue"] == 501){
            this.LoanRequestInvalidError = "Unable to send the request, Try Again..";
            this.loanRequestForm.reset();
          }
          else if(result["statusCodeValue"] = 202){
            this.responseErrorNote = false;
            this.responseSuccessNote = true;
            this.responseNoteValue= "Requst sent successfully!..";
            this.loanRequestForm.reset();
            this.modalRef.hide();
          }
          else if(result["statusCodeValue"] = 417){
            console.log("Server side exception catched...");
          }
        },
        error => {
          this.loanRequestForm.reset();
          this.modalRef.hide();
          this.responseErrorNote=true;
          this.responseSuccessNote=false;
          this.responseNoteValue="Unable to Log-In.Something went wrong!..";
          console.log("error");
          console.log(error);
        }
      );
    }
  }

  onResponseCancel(){
    this.responseErrorNote = false;
    this.responseSuccessNote = false;
    this.responseNoteValue = "";
  }

  navigateNav(pageName:string){
    this.router.navigate(['../../',pageName,this.userId],{relativeTo:this.route});
  }

  onLogout(){
    localStorage.removeItem('signedUserId');
    this.router.navigate(['../../'],{relativeTo:this.route})
  }

  openModalForLoan(requestingLender: UserModel,template: TemplateRef<any>){
    this.requestingLender = requestingLender;
    this.modalRef = this.modalService.show(template);
  }
}
