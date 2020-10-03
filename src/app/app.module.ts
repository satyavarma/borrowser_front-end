import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, NgForm } from '@angular/forms';
import { ReactiveFormsModule} from '@angular/forms' 
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { SignUpAndLogInComponent } from './components/sign-up-and-log-in/sign-up-and-log-in.component';
import { UserService } from './services/user.service';
import { BankComponent } from './components/bank/bank.component';
import { UserComponent } from './components/user/user.component';
import { LendersComponent } from './components/lenders/lenders.component';
import { BankService } from './services/bank.service';
import { LendingService } from './services/lending.service';

@NgModule({
  declarations: [
    AppComponent,
    SignUpAndLogInComponent,
    BankComponent,
    UserComponent,
    LendersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [UserService, BankService, LendingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
