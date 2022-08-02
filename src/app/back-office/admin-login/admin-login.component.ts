import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { StorageKey, StorageService } from 'app/shared/storage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginLayoutService } from 'app/layouts/login-layout/login-layout.service';
import { CommonService } from 'app/shared/common.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {

  loginForm: FormGroup | any;
  userId: any;
  hide1 = false;
  get fLoginData() { return this.loginForm.controls; }
  submittedLoginData = false;

  constructor(private http: HttpClient, private router: Router, private fb: FormBuilder,  public storageService: StorageService, public loginLayoutService: LoginLayoutService,  public commonService: CommonService) {
    if (this.storageService.getValue(StorageKey.isUtsavDecoreLogin) == 'true') {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  ngOnInit(): void {
    this.defaultloginForm();
  }

  defaultloginForm() {
    this.loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.pattern(/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/)]],
        pwd: ['', [Validators.required]],
    });
  }

  handleKeyUp(e : any) {
    if (e.keyCode === 13) {
      this.login();
    }
  }

  login() {

    this.submittedLoginData = true;
    if (this.loginForm.invalid) {
        return;
    }
    let loginObj = {
        c_Email: this.loginForm.value.email,
        pwd: this.loginForm.value.pwd
    };
    this.loginLayoutService.userLogin(loginObj).subscribe((Response: any) => {
        console.log(loginObj)
        if (Response.meta.code == 200) {
            localStorage.setItem('LoginUserData', JSON.stringify(Response.data))
            this.storageService.setValue(StorageKey.myToken, Response.data.myToken);
            this.storageService.setValue(StorageKey.roleId, Response.data.roleId);
            this.storageService.setValue(StorageKey.contact, Response.data.employeeId);
            this.storageService.setValue(StorageKey.reference, Response.data.firstName);
            this.storageService.setValue(StorageKey.aadharcardNo, Response.data.middleName);
            this.storageService.setValue(StorageKey.lastName, Response.data.lastName);
            this.storageService.setValue(StorageKey.email, Response.data.c_Email);
            this.storageService.setValue(StorageKey.full_name, Response.data.p_Email);
            this.storageService.setValue(StorageKey.isUtsavDecoreLogin, 'true');
            this.commonService.notifier.notify('success', Response.meta.message);
            this.router.navigate(['/admin/dashboard']);
        }
        else if (Response.meta.code === 1012) {
            this.commonService.notifier.notify('error', Response.meta.message);
        }
        else {
            this.commonService.notifier.notify('error', Response.meta.message);
        }
    }, (error : any) => {
        console.log(error);
    });
}
}
