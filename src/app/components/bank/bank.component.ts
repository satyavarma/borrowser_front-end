import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {bankAccountValidator} from '../../share/bankAccount.Validator'
import { BankService } from '../../services/bank.service';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css']
})
export class BankComponent implements OnInit {
  public userId: number;
  public bankAddErrorNote: string="";
  public bankAddSuccessNote: string="";
  public responseErrorNote: boolean = false;
  public responseSuccessNote: boolean = false;
  public responseNoteValue: string ="";
  public bankRegisterForm: FormGroup;
  constructor(private fb:FormBuilder, private bankService:BankService,private router: Router, private route: ActivatedRoute) { }

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
    this.bankRegisterForm = this.fb.group({
      accountNumber:['',[Validators.required,bankAccountValidator]],
      bankName:['',[Validators.required]],
	    branch: ['',[Validators.required]],
	    ifscCode: ['',[Validators.required]]
    });
  }

  onBankRegisterFormSubmit(){
    this.bankAddErrorNote="";
    this.bankAddSuccessNote="";
    if(this.bankRegisterForm.invalid){
      this.bankAddErrorNote="Fill the input fields properly and then submit."
    }
    else{
      this.bankService.doBankRegister(this.userId,this.bankRegisterForm.value)
        .subscribe(
          data => {
            let result = data;
            if(result["statusCodeValue"] == 501){
              this.bankAddErrorNote = "Registration Failed Try Again!.."
            }
            else if(result["statusCodeValue"] == 202){
              this.router.navigate(['../../user',this.userId],{relativeTo: this.route});
            }
          },
          error => {
            this.bankAddErrorNote = "Try Again.Something went Wrong!..";
            console.log("error");
            console.log(error)
          }
        );
    }
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
