import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { StorageKey, StorageService } from "app/shared/storage.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoginLayoutService } from "app/layouts/login-layout/login-layout.service";
import { CommonService } from "app/shared/common.service";
import { AdminLayoutService } from "app/layouts/admin-layout/admin-layout.service";
import { CoreHelperService } from "app/Providers/core-helper/core-helper.service";
import { environment } from "environments/environment";

@Component({
  selector: "app-admin-login",
  templateUrl: "./admin-login.component.html",
  styleUrls: ["./admin-login.component.css"],
})
export class AdminLoginComponent implements OnInit {
  utsav_logo_img: any;
  activeTab = 1;
  loginForm: FormGroup | any;
  userId: any;
  hide1 = false;
  hide2 = false;
  get fLoginData() {
    return this.loginForm.controls;
  }
  submittedLoginData = false;

  forgotpwdForm: FormGroup | any;
  forgotpwdData = false;
  get fForgotpwdData() {
    return this.forgotpwdForm.controls;
  }

  otp: string = "";
  config = {
    allowNumbersOnly: false,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '50px',
      'height': '50px'
    }
  };

  otpForm: FormGroup;
  submittedOtpFormData = false;
  otpMessage: string = "";
  get fOtpData() {
    return this.otpForm.controls;
  }

  resetpwdForm: FormGroup | any;
  submittedresetpwdFormData = false;
  get fResetpwdData() {
    return this.resetpwdForm.controls;
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    public storageService: StorageService,
    public loginLayoutService: LoginLayoutService,
    public commonService: CommonService,
    public adminLayoutService: AdminLayoutService,
    private coreHelper: CoreHelperService
  ) {
    if (this.storageService.getValue(StorageKey.isUtsavDecoreLogin) == "true") {
      this.router.navigate(["/admin/dashboard"]);
    }
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.utsav_logo_img = environment.uploadedUrl + this.storageService.getValue(StorageKey.utsav_decor_logo)
    }, 0);
    this.defaultloginForm();
    this.defaultForgotpwdForm();
    this.defaultOtpForm();
    this.defaultresetpwdForm();
  }

  defaultloginForm() {
    this.loginForm = this.fb.group({
      email: [
        "",
        [
          Validators.required,
          Validators.pattern(
            /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/
          ),
        ],
      ],
      pwd: ["", [Validators.required]],
    });
  }

  login() {
    this.submittedLoginData = true;
    if (this.loginForm.invalid) {
      return;
    }
    let loginObj = {
      email: this.loginForm.value.email,
      pwd: this.loginForm.value.pwd,
    };
    this.loginLayoutService.userLogin(loginObj).subscribe(
      (Response: any) => {
        console.log(loginObj);
        if (Response.meta.code == 200) {

          localStorage.setItem("LoginUserData", JSON.stringify(Response.data));
          this.storageService.setValue(
            StorageKey.myToken,
            Response.data.myToken
          );
          this.storageService.setValue(StorageKey.roleId, Response.data.roleId);
          this.storageService.setValue(
            StorageKey.contact,
            Response.data.contact
          );
          this.storageService.setValue(
            StorageKey.reference,
            Response.data.reference
          );
          this.storageService.setValue(
            StorageKey.aadharcardNo,
            Response.data.aadharcardNo
          );
          this.storageService.setValue(
            StorageKey.roleName,
            Response.data.roleName
          );
          this.storageService.setValue(StorageKey.email, Response.data.email);
          this.storageService.setValue(
            StorageKey.full_name,
            Response.data.name
          );
          this.storageService.setValue(StorageKey.isUtsavDecoreLogin, "true");
          this.commonService.notifier.notify("success", Response.meta.message);
          this.router.navigate(["/admin/dashboard"]);
        } else if (Response.meta.code === 1012) {
          this.commonService.notifier.notify("error", Response.meta.message);
        } else {
          this.commonService.notifier.notify("error", Response.meta.message);
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  backtoLogin() {
    this.activeTab = 1;
  }
  forgotPassword() {
    this.activeTab = 2;
  }

  defaultForgotpwdForm() {
    this.forgotpwdForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(
        /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/
      )]],
    });
  }

  sendOtp() {
    this.forgotpwdData = true;

    if (this.forgotpwdForm.invalid) {
      return;

    }
    let forgotpwdObj = {
      "email": this.forgotpwdForm.value.email
    }
    this.adminLayoutService.forgotPassword(forgotpwdObj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.otpForm.controls._id.setValue(Response.data)
        this.forgotpwdData = false;
        this.defaultForgotpwdForm();
        this.commonService.notifier.notify('success', "OTP Send Successfully.");
        this.activeTab = 3;
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    }, (error: any) => {
      console.log(error);
    });
  }

  defaultOtpForm() {
    this.otpForm = this.fb.group({
      _id: [''],
    });
  }

  resendOtp() {

    let otpFormObj = {
      "userId": this.otpForm.controls.userId.value,
      "activity": this.otpForm.controls.activity.value,
    }
    this.adminLayoutService.reSendOtp(otpFormObj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.commonService.notifier.notify('success', Response.meta.message);
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    }, (error: any) => {
      console.log(error);
    });
  }

  otpVerify() {
    this.submittedOtpFormData = true;
    this.otp.length;
    if (this.otp.length != 4) {
      this.otpMessage = "OTP is Required."
    }
    if (this.otp.length == 4) {
      this.otpMessage = ""
    }
    if (this.otpForm.invalid || this.otp == "" || !this.otp || this.otp.length != 4) {
      return;
    }
    let otpObj = {
      "user_id": this.otpForm.controls._id.value,
      "OTP": this.otp
    };

    this.adminLayoutService.otpVerification(otpObj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.submittedOtpFormData = false;
        this.defaultForgotpwdForm();
        this.resetpwdForm.controls.user_id.setValue(Response.data)
        this.commonService.notifier.notify('success', "OTP Verify Successfully.");
        this.activeTab = 4;
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    }, (error: any) => {
      console.log(error);
    });
  }

  onOtpChange(otp) {
    this.otp = otp;
    if (this.otp.length == 4) {
      this.otpMessage = ""
    }
  }

  defaultresetpwdForm() {
    this.resetpwdForm = this.fb.group({
      user_id: [''],
      pwd: ['', [Validators.required, this.coreHelper.patternPasswordValidator()]],
      confirmPwd: ['', [Validators.required]],
    }, {
      validator: [this.coreHelper.MustMatch('pwd', 'confirmPwd')]
    });
  }

  resetpassword() {

    this.submittedresetpwdFormData = true;
    if (this.resetpwdForm.invalid) {
      return;
    }
    let resetpwdObj = {
      "user_id": this.resetpwdForm.value.user_id,
      "pwd": this.resetpwdForm.value.pwd
    }
    this.adminLayoutService.resetPassword(resetpwdObj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.submittedresetpwdFormData = false;
        this.defaultresetpwdForm();
        this.commonService.notifier.notify('success', "Password Reset Successfully.");
        this.activeTab = 1;
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    }, (error) => {
      console.log(error);
    });
  }

  handleKeyUp(e: any) {
    if (e.keyCode === 13) {
      if (this.activeTab === 1) {
        this.login();
      } else if (this.activeTab === 3) {
        this.sendOtp();

      } else if (this.activeTab === 5) {
        this.otpVerify();
      }
    }
  }
}
