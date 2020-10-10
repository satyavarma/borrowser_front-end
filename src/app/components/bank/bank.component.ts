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

}
