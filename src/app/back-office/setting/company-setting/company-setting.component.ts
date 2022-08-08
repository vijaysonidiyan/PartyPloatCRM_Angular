import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-company-setting",
  templateUrl: "./company-setting.component.html",
  styleUrls: ["./company-setting.component.css"],
})
export class CompanySettingComponent implements OnInit {
  comapnyForm: FormGroup;
  isEditing = false;
  imageSelected: any;
  userFile: any;
  userSignatureFile: any;
  imageSignatureSelected: any;
  imgSignatureSrc: any;
  imgLogoSrc: any;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.defaultForm();
    this.comapnyForm.disable();
  }
  defaultForm() {
    this.comapnyForm = this.fb.group({
      name: [""],
      companyEmail: [""],
      companyLogo: [""],
      signature: [""],
      phone: [],
      phone2: [""],
      email: [""],
      password: [""],
      service: [""],
      port: [""],
      smtp: [""],
    });
  }
  onLogoChange(event: any) {
    debugger;
    this.userFile = event.target.files[0];
    this.imageSelected = this.userFile.name;
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imgLogoSrc = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  onSignatureChange(event: any) {
    debugger;
    this.userSignatureFile = event.target.files[0];
    this.imageSignatureSelected = this.userSignatureFile.name;
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imgSignatureSrc = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  canclecompanySetting() {
    this.comapnyForm.disable();
    this.isEditing = false;
  }
  editcompanySetting() {
    debugger;
    this.comapnyForm.enable();
    this.isEditing = true;
    //this.isEditing = !this.isEditing;
  }
}
