import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignUpAndLogInComponent } from './components/sign-up-and-log-in/sign-up-and-log-in.component';
import { BankComponent } from './components/bank/bank.component';
import { UserComponent } from './components/user/user.component';
import { LendersComponent } from './components/lenders/lenders.component';
import { ReceivedRequestsComponent } from './components/received-requests/received-requests.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { SentRequestsComponent } from './components/sent-requests/sent-requests.component';
import { NotificationsComponent } from './components/notifications/notifications.component';

const routes: Routes = [
  {path:'', redirectTo:'/signup&login', pathMatch:'full'},
  {path:'signup&login', component:SignUpAndLogInComponent},
  {path:'bank/:userId', component:BankComponent},
  {path:'user/:userId', component:UserComponent},
  {path:'lenders/:userId', component:LendersComponent},
  {path:'receivedRequests/:userId', component:ReceivedRequestsComponent},
  {path: 'sentRequests/:userId', component:SentRequestsComponent},
  {path:'transactions/:userId', component:TransactionsComponent},
  {path:'notifications/:userId', component:NotificationsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
