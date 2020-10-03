import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpAndLogInComponent } from './sign-up-and-log-in.component';

describe('SignUpAndLogInComponent', () => {
  let component: SignUpAndLogInComponent;
  let fixture: ComponentFixture<SignUpAndLogInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignUpAndLogInComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpAndLogInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
