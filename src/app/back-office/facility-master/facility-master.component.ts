import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AdminLayoutService } from "app/layouts/admin-layout/admin-layout.service";
import { CommonService } from "app/shared/common.service";
declare const $: any;
@Component({
  selector: "app-facility-master",
  templateUrl: "./facility-master.component.html",
  styleUrls: ["./facility-master.component.css"],
})
export class FacilityMasterComponent implements OnInit {

  facilitymasterForm: FormGroup;
  mySelect;
  noData;
  ISeditFacilityMaster = false;
  l: number;
  p: number = 1;
  facilitymasterList: any[] | any;
  allfacilitymaster: any[] | any;
  facilityMasterList: any[] | any;
  facilitymasterListlength: any;
  get fnameData() { return this.facilitymasterForm.controls; }
  submittedfacilityMasterData = false;

  constructor(public adminLayoutService: AdminLayoutService, private fb: FormBuilder, public commonService: CommonService) {}

  ngOnInit(): void {
    this.noData = false;
    this.mySelect = 5;
    this.l = 10;
    this.ISeditFacilityMaster = false;
    this.getFacilitymasterList();
    this.defaultForm();
  }

  defaultForm() {
    this.facilitymasterForm = this.fb.group({
        _id: [''],
        name: ['', [Validators.required]],
    });
  }

  addFacilitymaster() {
    $("#add-menu-modal").modal("show");
    this.ISeditFacilityMaster = false;
  }

  cancelFacilitymaster() {
      $("#add-menu-modal").modal("hide");
      this.defaultForm();
      this.ISeditFacilityMaster = false;
  }

  saveFacilitymaster() {
    if (this.facilitymasterForm.invalid) {
        this.submittedfacilityMasterData = true;
        return;
    }
    let facilitymasterModelObj = {
        "name": this.facilitymasterForm.controls.name.value,
    };

    this.adminLayoutService.SavefacilityMaster(facilitymasterModelObj).subscribe((Response: any) => {
        if (Response.meta.code == 200) {
            this.submittedfacilityMasterData = false;
            this.getFacilitymasterList();
            this.defaultForm();
            this.ISeditFacilityMaster = false;
            this.commonService.notifier.notify('success', Response.meta.message);
            $("#add-menu-modal").modal("hide");
        }
        else {
            this.commonService.notifier.notify('error', Response.meta.message);
        }
    }, (error) => {
        console.log(error);
    });
  }

  editFacilitymaster(paramsObj) {
    this.ISeditFacilityMaster = true;
    let Id: any = { '_id': paramsObj.id }
    this.adminLayoutService.getfacilityMasterId(Id).subscribe((Response: any) => {
        this.facilitymasterForm.controls._id.setValue(Response.data._id)
        this.facilitymasterForm.controls.name.setValue(Response.data.name)
        $("#add-menu-modal").modal("show");
    }, (error) => {
    });
  }

  updateFacilitymaster() {
    if (this.facilitymasterForm.invalid) {
        this.submittedfacilityMasterData = true;
        return;
    }
    let facilitymasterModelObj = {
        "_id": this.facilitymasterForm.controls._id.value,
        "name": this.facilitymasterForm.controls.name.value,
    };

    this.adminLayoutService.UpdatefacilityMaster(facilitymasterModelObj).subscribe((Response: any) => {

        if (Response.meta.code == 200) {
            this.submittedfacilityMasterData = false;
            this.getFacilitymasterList();
            this.defaultForm();
            this.ISeditFacilityMaster = false;
            this.commonService.notifier.notify('success', Response.meta.message);
            $("#add-menu-modal").modal("hide");
        }
        else {
            this.commonService.notifier.notify('error', Response.meta.message);
        }
    }, (error) => {
        console.log(error);
    });
  }

  statusFacilitymaster(paramsObj) {
    debugger
    let statusfacilitymasterModelObj = {
        "_id": paramsObj.id,
        "status": paramsObj.status
    };

    this.adminLayoutService.StatusfacilityMaster(statusfacilitymasterModelObj).subscribe((Response: any) => {

        if (Response.meta.code == 200) {
            this.submittedfacilityMasterData = false;
            this.getFacilitymasterList();
            this.defaultForm();
            this.ISeditFacilityMaster = false;
            this.commonService.notifier.notify('success', Response.meta.message);
        }
        else {
            this.commonService.notifier.notify('error', Response.meta.message);
        }
    }, (error) => {
        console.log(error);
    });
  }

  getFacilitymasterList() {
    this.adminLayoutService.getfacilityMaster().subscribe((Response: any) => {

        if (Response.meta.code == 200) {
            this.facilityMasterList = Response.data;
            this.facilitymasterList = this.facilityMasterList
            this.allfacilitymaster = this.facilitymasterList
            this.facilitymasterList = this.facilityMasterList.slice();
            this.facilitymasterListlength = Response.data.length;
            this.noData = false;
        } else {
            this.noData = true;
        }
        //for select sub industry step
    }, (error) => {
        console.log(error.error.Message);
    });
  }
}
