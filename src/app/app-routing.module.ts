import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignUpAndLogInComponent } from './components/sign-up-and-log-in/sign-up-and-log-in.component';
import { BankComponent } from './components/bank/bank.component';
import { UserComponent } from './components/user/user.component';
import { LendersComponent } from './components/lenders/lenders.component';

const routes: Routes = [
  {path:'', redirectTo:'/signup&login', pathMatch:'full'},
  {path:'signup&login', component:SignUpAndLogInComponent},
  {path:'bank/:userId', component:BankComponent},
  {path:'user/:userId', component:UserComponent},
  {path:'lenders/:userId', component:LendersComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
