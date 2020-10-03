import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {UserModel} from '../../models/user-model';
import { LendingService } from '../../services/lending.service';

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
  lenders: UserModel[];
  constructor( private router: Router, private route: ActivatedRoute, private lendingService:LendingService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap)=>{
      this.userId = parseInt(params.get("userId"));
    });

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
    console.log("clicked nav");
    this.router.navigate(['../../',pageName,this.userId],{relativeTo:this.route});
  }
}
