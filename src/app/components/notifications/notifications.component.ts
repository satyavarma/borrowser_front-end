import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { LendingService } from '../../services/lending.service';
import { LoanModel } from 'src/app/models/loan-model';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  userId:number;
  sentRequests: LoanModel[];
  public responseErrorNote: boolean = false;
  public responseSuccessNote: boolean = false;
  public responseNoteValue: string ="";
  constructor(private router: Router, private route: ActivatedRoute, private lendingService:LendingService) { }
 

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
    this.lendingService.getNotificationRequests(this.userId)
    .subscribe(
      data =>{
        let result = data;
        if(result["statusCodeValue"] == 404){
          this.responseErrorNote=true;
          this.responseNoteValue="You Don't Have Any Notifications Currently!..";
        }
        else if(result["statusCodeValue"] == 200){
          this.sentRequests = result["body"];
        }
      },
      error => {
        this.responseErrorNote=true;
        this.responseNoteValue="Something went Wrong!..";
        console.log('error:',error);
      }
    );
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

  onLogout(){
    localStorage.removeItem('signedUserId');
    localStorage.removeItem('signedDate');
    this.router.navigate(['../../'],{relativeTo:this.route})
  }
}
