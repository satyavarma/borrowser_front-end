import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { emailValidator } from '../../share/email.validator';
import { contactNoValidator } from '../../share/contactNo.validator'

@Component({
  selector: 'app-sign-up-and-log-in',
  templateUrl: './sign-up-and-log-in.component.html',
  styleUrls: ['./sign-up-and-log-in.component.css']
})
export class SignUpAndLogInComponent implements OnInit {

  public signUpErrorNote:string;
  public signUpSuccessNote:String;
  public logInErrorNote:string;
  public logInForm: FormGroup;
  public signUpForm: FormGroup;
  constructor(private fb: FormBuilder, private userService: UserService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    let signedUserId:string = localStorage.getItem('signedUserId') ? localStorage.getItem('signedUserId') : '0' ;
    if(parseInt(signedUserId) != 0){
      this.router.navigate(['/user', signedUserId],{relativeTo:this.route});
    }
    this.logInForm = this.fb.group({
      username:['',[Validators.required, emailValidator]],
      password:['',[Validators.required]]
    });

    this.signUpForm = this.fb.group({
      username:['',[Validators.required, emailValidator]],
      password: ['',[Validators.required]],
	    name:['',[Validators.required, Validators.minLength(3)]] ,
	    age: ['',[Validators.required]],
	    contactNumber:['',[Validators.required,, contactNoValidator]]
    });
  }
  onLogInSubmit(){
    this.signUpSuccessNote="";
    this.signUpErrorNote="";
    if(this.logInForm.invalid){
      this.logInErrorNote="Fill the input fields properly and then submit!";
    }else{
      this.logInErrorNote="";
      this.userService.doLogIn(this.logInForm.value)
        .subscribe(
          data => {
            let result = data;
            if(result["statusCodeValue"] == 404){
              this.logInErrorNote = "Wrong Credentials!..";
            }
            else if(result["statusCodeValue"] == 200){
              let userId = result["body"]["userId"];
              let bankId = result["body"]["bankId"];
              localStorage.setItem('signedUserId', JSON.stringify(userId));
              let date = new Date();
              localStorage.setItem('signedDate',date.toString());
              if(bankId == 6){
                this.router.navigate(['/bank',userId],{relativeTo:this.route});
              }
              else{
                this.router.navigate(['/user', userId],{relativeTo:this.route});
              }
            }
          },
          error => {
            this.logInErrorNote="Unable to Log-In.Something went wrong!..";
            console.log("error: ");
            console.log(error);
          }
        );
    }
  }

  onSignUpSubmit(){
    this.logInErrorNote="";
    if(this.signUpForm.invalid){
      this.signUpSuccessNote="";
      this.signUpErrorNote="Fill the input fields properly and then submit!";
    }else{
      this.userService.doSignUp(this.signUpForm.value)
        .subscribe(
          data => { 
            let result = data;
            if(result["statusCodeValue"] == 400){
              this.signUpSuccessNote="";
              this.signUpErrorNote = "UserName already exists";
            }
            else if(result["statusCodeValue"] == 202){
              this.signUpErrorNote="";
              this.signUpSuccessNote = "Account Created Successfully!";
              this.signUpForm.reset();
            }
          } ,
          error => {
            this.signUpErrorNote="Unable to Sign-Up.Something went wrong!..";
            console.log("error: ");
            console.log(error);
          }
        );
    }
  }

  refresh(): void {
    window.location.reload();
  }
}
