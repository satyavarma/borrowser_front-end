import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { UserService } from '../../services/user.service';
import { BankService } from '../../services/bank.service';
import { UserModel } from '../../models/user-model';
import { BankModel } from '../../models/bank-model';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { emailValidator } from '../../share/email.validator';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  public userId:number;
  public user: UserModel;
  public bank: BankModel;
  public responseErrorNote: boolean = false;
  public responseSuccessNote: boolean = false;
  public responseNoteValue: string ="";
  public inviteForm: FormGroup;
  constructor(private fb:FormBuilder, private router: Router, private userService: UserService, private bankService: BankService, private route:ActivatedRoute) { }

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
    this.inviteForm = this.fb.group(
      {
        mailId: ['',[Validators.required, emailValidator]]
      }
    );

    this.userService.getUserById(this.userId)
      .subscribe(
        data => {
          let result = data;
            if(result["statusCodeValue"] == 404){
              this.responseErrorNote=true;
              this.responseNoteValue = "User Not-Found!.."
            }
            else if(result["statusCodeValue"] == 200){
              this.user = result["body"];
              if(this.user.bankId != 6 ){
                this.bankService.getBankDetails(this.user.bankId)
                  .subscribe(
                    data =>{
                      let bankResult = data;
                      if(bankResult["statusCodeValue"] == 404){
                        this.responseErrorNote=true;
                        this.responseNoteValue = "Bank Details Not-Found!.."
                      }
                      else if(bankResult["statusCodeValue"] == 200){
                        this.bank = bankResult["body"];
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
              else if(this.user.bankId == 6){
                this.router.navigate(['../../bank',this.user.userId],{relativeTo:this.route});
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
  }

  doUpdateBankDetails(){
    this.router.navigate(['../../bank',this.userId],{relativeTo:this.route});
  }

  onInviteSubmit(){
    if(this.inviteForm.valid){
      this.userService.doInviteByMailId(this.inviteForm.value.mailId)
      .subscribe(
        data => {
          let result = data;
          if(result["statusCodeValue"] == 202){
            this.responseSuccessNote = true;
            this.responseNoteValue = "Invitation Sent Successfully..";
            this.inviteForm.reset();
          }
          else if(result["statusCodeValue"]=400){
            this.responseErrorNote = true;
            this.responseNoteValue = "Unable to send Invitation..";
          }
        },
        error =>{
          this.responseErrorNote = true;
          this.responseNoteValue="Unable to send Invitation.Something went wrong!..";
          console.log('error:',error);
        }
      );
    }
  }

  onResponseCancel(){
    this.responseErrorNote = false;
    this.responseSuccessNote = false;
    this.responseNoteValue = "";
  }

  onShowLenders(){
    this.router.navigate(['../../lenders',this.userId],{relativeTo:this.route});
  }

  refresh(): void {
    window.location.reload();
  }

  navigateNav(pageName:string){
    this.router.navigate(['../../',pageName,this.userId],{relativeTo:this.route});
  }
  
  onLogout(){
    localStorage.removeItem('signedUserId');
    localStorage.removeItem('signedDate');
    this.router.navigate(['../../'],{relativeTo:this.route})
  }
}
