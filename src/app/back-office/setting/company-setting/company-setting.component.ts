import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AdminLayoutService } from "app/layouts/admin-layout/admin-layout.service";
import { CommonService } from "app/shared/common.service";
import { StorageKey, StorageService } from "app/shared/storage.service";
import { environment } from "environments/environment";

@Component({
  selector: "app-company-setting",
  templateUrl: "./company-setting.component.html",
  styleUrls: ["./company-setting.component.css"],
})
export class CompanySettingComponent implements OnInit {
  comapnyForm: FormGroup;
  isEditing = false;
  userFile: any;
  userSignatureFile: any;
  filelogo: any;
  filesignature: any;
  imgURLsignature: string | ArrayBuffer;
  imgURLlogo: string | ArrayBuffer;
  @ViewChild('filelogo') myInputVariablelogo: ElementRef | any;
  @ViewChild('filesignature') myInputVariablesignature: ElementRef;
  hide1 = false;
  activepartyplotList: any;
  get fnameData() {
    return this.comapnyForm.controls;
  }
  submittedCompanyData = false;
  isView: boolean;
  isCreated: boolean;
  isUpdated: boolean;
  isDeleted: boolean;



  constructor(private fb: FormBuilder, public adminLayoutService: AdminLayoutService, public storageService: StorageService, public commonService: CommonService, private router: Router) {
    let pagePermission = { module: "companySetting" }
    this.adminLayoutService.getpagePermission(pagePermission).subscribe((Response: any) => {

      if (Response.meta.code == 200) {

        this.isView = Response.data.isView;
        this.isCreated = Response.data.isCreated;
        this.isUpdated = Response.data.isUpdated;
        this.isDeleted = Response.data.isDeleted;
        if (this.isView === false) {
          this.router.navigate(['admin/dashboard']);
        }
      }
    }, (error) => {
      console.log(error.error.Message);
    });
  }

  ngOnInit(): void {
    this.defaultForm();
    this.getActivePartyplotList();
    this.comapnyForm.disable();
    this.getcomapnySetting();
  }
  defaultForm() {
    this.comapnyForm = this.fb.group({
      _id: [""],
      name: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      Telephone1: ["", [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      Telephone2: [""],
      logo: [""],
      signature: [""],
      cricketPartyPlot: [null],
      SMTP_email: ["", [Validators.required, Validators.email]],
      SMTP_password: ["", [Validators.required]],
      service: ["", [Validators.required]],
      port: ["", [Validators.required]],
      SMTP: ["", [Validators.required]],
    });
  }

  getActivePartyplotList() {
    this.adminLayoutService.getPartyplotActiveList().subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.activepartyplotList = Response.data;

      }
      //for select sub industry step
    },
      (error) => {
        console.log(error.error.Message);
      }
    );
  }

  getcomapnySetting() {
    this.adminLayoutService.getComapnysetting().subscribe((Response: any) => {
      this.comapnyForm.controls._id.setValue(Response.data._id);
      this.comapnyForm.controls.name.setValue(Response.data.name);
      this.comapnyForm.controls.email.setValue(Response.data.email);
      this.comapnyForm.controls.Telephone1.setValue(Response.data.Telephone1);
      this.comapnyForm.controls.Telephone2.setValue(Response.data.Telephone2);
      this.comapnyForm.controls.SMTP_email.setValue(Response.data.SMTP_email);
      this.comapnyForm.controls.SMTP_password.setValue(Response.data.SMTP_password);
      this.comapnyForm.controls.service.setValue(Response.data.service);
      this.comapnyForm.controls.port.setValue(Response.data.port);
      this.comapnyForm.controls.SMTP.setValue(Response.data.SMTP);
      this.comapnyForm.controls.cricketPartyPlot.setValue(Response.data.cricketPartyPlot);

      if (Response.data.logo != "") {
        this.imgURLlogo = environment.uploadsUrl + "photos/" + Response.data.logo;
        this.userFile = Response.data.logo;
      } else {
        this.imgURLlogo = "";
        this.userFile = "";
        this.myInputVariablelogo.nativeElement.value = "";
        this.storageService.setValue(StorageKey.utsav_decor_logo, this.userFile);
      }
      if (!!Response.data.signature) {
        this.imgURLsignature = environment.uploadsUrl + "photos/" + Response.data.signature;
        this.userSignatureFile = Response.data.signature;
      } else {
        this.imgURLsignature = "";
        this.userSignatureFile = "";
        this.myInputVariablesignature.nativeElement.value = "";
      }
    })
  }

  removeURLsignature() {
    this.imgURLsignature = "";
    this.userSignatureFile = "";
    this.myInputVariablesignature.nativeElement.value = "";
  }

  removeURLlogo() {
    this.imgURLlogo = "";
    this.userFile = "";
    this.myInputVariablelogo.nativeElement.value = "";
  }

  updateCompanySetting() {
    if (this.comapnyForm.invalid) {
      this.submittedCompanyData = true;
      return;
    }

    let loginModelObj: FormData = new FormData();
    //loginModelObj.append('_id', this.comapnyForm.value._id);
    loginModelObj.append('name', this.comapnyForm.value.name);
    loginModelObj.append('email', this.comapnyForm.value.email);
    loginModelObj.append('Telephone1', this.comapnyForm.value.Telephone1);
    loginModelObj.append('Telephone2', this.comapnyForm.value.Telephone2);
    loginModelObj.append('logo', this.userFile);
    loginModelObj.append('signature', this.userSignatureFile);
    loginModelObj.append('SMTP_email', this.comapnyForm.value.SMTP_email);
    loginModelObj.append('SMTP_password', this.comapnyForm.value.SMTP_password);
    loginModelObj.append('service', this.comapnyForm.value.service);
    loginModelObj.append('port', this.comapnyForm.value.port);
    loginModelObj.append('SMTP', this.comapnyForm.value.SMTP);
    loginModelObj.append('cricketPartyPlot', JSON.stringify(this.comapnyForm.value.cricketPartyPlot));

    this.adminLayoutService.UpdateCompanySetting(loginModelObj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.comapnyForm.disable();
        this.storageService.setValue(StorageKey.utsav_decor_logo, Response.data.logo);
        this.isEditing = false;
        this.commonService.notifier.notify('success', "Company Details Updates Successfully.");
        window.location.reload();
      } else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    }, (error) => {
      console.log(error);
    });
  }

  onLogoChange(event: any) {
    this.userFile = event.target.files[0];
    this.filelogo = this.userFile.name;
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imgURLlogo = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  onSignatureChange(event: any) {
    this.userSignatureFile = event.target.files[0];
    this.filesignature = this.userSignatureFile.name;
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imgURLsignature = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  canclecompanySetting() {
    this.comapnyForm.disable();
    this.isEditing = false;
    this.getcomapnySetting()
  }
  editcompanySetting() {
    this.comapnyForm.enable();
    this.isEditing = true;
    //this.isEditing = !this.isEditing;
  }
}
