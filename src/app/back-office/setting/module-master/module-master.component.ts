import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AdminLayoutService } from "app/layouts/admin-layout/admin-layout.service";
import { CommonService } from "app/shared/common.service";
declare const $: any;

@Component({
  selector: 'app-module-master',
  templateUrl: './module-master.component.html',
  styleUrls: ['./module-master.component.css']
})
export class ModuleMasterComponent implements OnInit {

  modulemasterForm: FormGroup;
  mySelect;
  noData;
  ISeditModuleMaster = false;
  l: number;
  p: number = 1;
  modulemasterList: any[] | any;
  allmodulemaster: any[] | any;
  moduleMasterList: any[] | any;
  modulemasterListlength: any;
  get fModuleMasterData() { return this.modulemasterForm.controls; }
  submittedModuleMasterData = false;

  constructor(public adminLayoutService: AdminLayoutService, private fb: FormBuilder, public commonService: CommonService) { }

  ngOnInit(): void {
    this.noData = false;
    this.mySelect = 5;
    this.l = 10;
    this.ISeditModuleMaster = false;
    this.getModulemasterList();
    this.defaultForm();
  }

  defaultForm() {
    this.modulemasterForm = this.fb.group({
      _id: [''],
      name: ['', [Validators.required]],
      value: ['', [Validators.required]],
    });
  }

  addRole() {
    $("#add-module-modal").modal("show");
    this.ISeditModuleMaster = false;
  }

  cancelModulemaster() {
    $("#add-module-modal").modal("hide");
    this.defaultForm();
    this.ISeditModuleMaster = false;
  }

  saveModulemaster() {
    if (this.modulemasterForm.invalid) {
      this.submittedModuleMasterData = true;
      return;
    }
    let modulemasterModelObj = {
      "name": this.modulemasterForm.controls.name.value,
      "value": this.modulemasterForm.controls.value.value,
    };

    this.adminLayoutService.SaveModuleMaster(modulemasterModelObj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.submittedModuleMasterData = false;
        this.getModulemasterList();
        this.defaultForm();
        this.ISeditModuleMaster = false;
        this.commonService.notifier.notify('success', Response.meta.message);
        $("#add-module-modal").modal("hide");
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    }, (error) => {
      console.log(error);
    });
  }

  editModulemaster(paramsObj) {
    this.ISeditModuleMaster = true;
    let Id: any = { '_id': paramsObj.id }
    this.adminLayoutService.getModuleMasterId(Id).subscribe((Response: any) => {
      this.modulemasterForm.controls._id.setValue(Response.data._id)
      this.modulemasterForm.controls.name.setValue(Response.data.name)
      this.modulemasterForm.controls.value.setValue(Response.data.value)
      $("#add-module-modal").modal("show");
    }, (error) => {
    });
  }

  updateModulemaster() {
    if (this.modulemasterForm.invalid) {
      this.submittedModuleMasterData = true;
      return;
    }
    let modulemasterModelObj = {
      "_id": this.modulemasterForm.controls._id.value,
      "name": this.modulemasterForm.controls.name.value,
      "value": this.modulemasterForm.controls.value.value,
    };

    this.adminLayoutService.UpdateModuleMaster(modulemasterModelObj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.submittedModuleMasterData = false;
        this.getModulemasterList();
        this.defaultForm();
        this.ISeditModuleMaster = false;
        this.commonService.notifier.notify('success', Response.meta.message);
        $("#add-module-modal").modal("hide");
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    }, (error) => {
      console.log(error);
    });
  }

  statusModulemaster(paramsObj) {
    debugger
    let statusmodulemasterModelObj = {
      "_id": paramsObj.id,
      "status": paramsObj.status
    };

    this.adminLayoutService.StatusModuleMaster(statusmodulemasterModelObj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.submittedModuleMasterData = false;
        this.getModulemasterList();
        this.defaultForm();
        this.ISeditModuleMaster = false;
        this.commonService.notifier.notify('success', Response.meta.message);
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    }, (error) => {
      console.log(error);
    });
  }

  getModulemasterList() {
    this.adminLayoutService.getModuleMaster().subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.moduleMasterList = Response.data;
        this.modulemasterList = this.moduleMasterList
        this.allmodulemaster = this.modulemasterList
        this.modulemasterList = this.moduleMasterList.slice();
        this.modulemasterListlength = Response.data.length;
        this.noData = false;
      } else {
        this.noData = true;
      }
      //for select sub industry step
    }, (error) => {
      console.log(error.error.Message);
    });
  }

  searchModuleData(value: any) {
    this.modulemasterList = this.allmodulemaster.filter((val: any) => val.name.toLowerCase().includes(value.toLowerCase()));
    this.p = 1;
    if (this.modulemasterList.length == 0) {
      this.noData = true;
    } else {
      this.noData = false;
    }
  }

}
