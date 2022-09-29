import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AdminLayoutService } from "app/layouts/admin-layout/admin-layout.service";
import { CommonService } from "app/shared/common.service";
declare const $: any;
@Component({
  selector: "app-vendor-details",
  templateUrl: "./vendor-details.component.html",
  styleUrls: ["./vendor-details.component.css"],
})
export class VendorDetailsComponent implements OnInit {

  vendordetailsForm: FormGroup;
  noData;
  ISeditVendorDetails = false;
  l: number;
  p: number = 1;
  vendordetailsList: any[] | any;
  allvendordetails: any[] | any;
  vendorDetailsList: any[] | any;
  vendordetailsListlength: any;
  get fvendorData() {
    return this.vendordetailsForm.controls;
  }
  submittvendordetailsData = false;

  constructor(
    public adminLayoutService: AdminLayoutService,
    private fb: FormBuilder,
    public commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.noData = false;
    this.l = 10;
    this.ISeditVendorDetails = false;
    this.getVendordetailsList();
    this.defaultForm();
  }

  defaultForm() {
    this.vendordetailsForm = this.fb.group({
      _id: [""],
      name: ["", [Validators.required]],
      address: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      primaryContact: ["", [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      description: [""],
      // secondyContact: [""],
    });
  }

  addMenu() {
    $("#add-menu-modal").modal("show");
    this.ISeditVendorDetails = false;
    this.submittvendordetailsData = false;
  }

  cancelMenu() {
    $("#add-menu-modal").modal("hide");
    this.defaultForm();
    this.ISeditVendorDetails = false;
    this.submittvendordetailsData = false;
  }

  saveVendorDetails() {
    if (this.vendordetailsForm.invalid) {
      this.submittvendordetailsData = true;
      return;
    }
    let vendordetailsModelObj = {
      name: this.vendordetailsForm.controls.name.value,
      primaryContact: this.vendordetailsForm.controls.primaryContact.value,
      email: this.vendordetailsForm.controls.email.value,
      address: this.vendordetailsForm.controls.address.value,
      description: this.vendordetailsForm.controls.description.value,
      // secondyContact: this.vendordetailsForm.controls.name.value,
    };

    this.adminLayoutService.SavevendorDetails(vendordetailsModelObj).subscribe(
      (Response: any) => {
        if (Response.meta.code == 200) {
          this.submittvendordetailsData = false;
          this.getVendordetailsList();
          this.defaultForm();
          this.ISeditVendorDetails = false;
          this.commonService.notifier.notify("success", "Vendor Details Saved Successfully.");
          $("#add-menu-modal").modal("hide");
        } else {
          this.commonService.notifier.notify("error", Response.meta.message);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  editvendorDetails(paramsObj) {
    this.ISeditVendorDetails = true;
    let Id: any = { _id: paramsObj.id };
    this.adminLayoutService.getvendorDetailsId(Id).subscribe(
      (Response: any) => {
        this.vendordetailsForm.controls._id.setValue(Response.data._id);
        this.vendordetailsForm.controls.name.setValue(Response.data.name);
        this.vendordetailsForm.controls.primaryContact.setValue(Response.data.primaryContact);
        this.vendordetailsForm.controls.email.setValue(Response.data.email);
        this.vendordetailsForm.controls.address.setValue(Response.data.address);
        this.vendordetailsForm.controls.description.setValue(Response.data.description);
        $("#add-menu-modal").modal("show");
      },
      (error) => { }
    );
  }

  updatevendorDetails() {
    if (this.vendordetailsForm.invalid) {
      this.submittvendordetailsData = true;
      return;
    }
    let vendordetailsModelObj = {
      _id: this.vendordetailsForm.controls._id.value,
      name: this.vendordetailsForm.controls.name.value,
      primaryContact: this.vendordetailsForm.controls.primaryContact.value,
      email: this.vendordetailsForm.controls.email.value,
      address: this.vendordetailsForm.controls.address.value,
      description: this.vendordetailsForm.controls.description.value,
      // secondyContact: this.vendordetailsForm.controls.name.value,
    };

    this.adminLayoutService.UpdatevendorDetails(vendordetailsModelObj).subscribe(
      (Response: any) => {
        if (Response.meta.code == 200) {
          this.submittvendordetailsData = false;
          this.getVendordetailsList();
          this.defaultForm();
          this.ISeditVendorDetails = false;
          this.commonService.notifier.notify("success", "Vendor Details Updated Successfully.");
          $("#add-menu-modal").modal("hide");
        } else {
          this.commonService.notifier.notify("error", Response.meta.message);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  satusvendorDetails(paramsObj) {
    let statusvendordetailsModelObj = {
      _id: paramsObj.id,
      status: paramsObj.status,
    };

    this.adminLayoutService
      .StatusvendorDetails(statusvendordetailsModelObj)
      .subscribe(
        (Response: any) => {
          if (Response.meta.code == 200) {
            this.submittvendordetailsData = false;
            this.getVendordetailsList();
            this.defaultForm();
            this.ISeditVendorDetails = false;
            if (paramsObj.status === 1) {
              this.commonService.notifier.notify(
                "success",
                "Vendor Details Actived Successfully."
              );
            }
            else {
              this.commonService.notifier.notify(
                "success",
                "Vendor Details Deactived Successfully."
              );
            }
          } else {
            this.commonService.notifier.notify("error", Response.meta.message);
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  getVendordetailsList() {
    this.adminLayoutService.getvendorDetails().subscribe(
      (Response: any) => {
        if (Response.meta.code == 200) {
          this.vendorDetailsList = Response.data;
          this.vendordetailsList = this.vendorDetailsList;
          this.allvendordetails = this.vendordetailsList;
          this.vendordetailsList = this.vendorDetailsList.slice();
          this.vendordetailsListlength = Response.data.length;
          this.noData = false;
        } else {
          this.noData = true;
        }
        //for select sub industry step
      },
      (error) => {
        console.log(error.error.Message);
      }
    );
  }

  search(value: string): void {
    this.vendorDetailsList = this.allvendordetails.filter((val: any) => JSON.stringify(val).toLowerCase().includes(value.toLowerCase()));
    this.p = 1;
    if (this.vendorDetailsList.length == 0) {
      debugger
      this.noData = true;
    } else {
      this.noData = false;
    }
  }
}
