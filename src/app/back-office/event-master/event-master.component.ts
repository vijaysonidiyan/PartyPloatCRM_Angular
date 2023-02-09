import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AdminLayoutService } from "app/layouts/admin-layout/admin-layout.service";
import { CommonService } from "app/shared/common.service";
declare const $: any;
@Component({
  selector: "app-event-master",
  templateUrl: "./event-master.component.html",
  styleUrls: ["./event-master.component.css"],
})
export class EventMasterComponent implements OnInit {
  eventmasterForm: FormGroup;
  noData;
  ISeditEventMaster = false;
  l: number;
  p: number = 1;
  eventmasterList: any[] | any;
  alleventmaster: any[] | any;
  eventMasterList: any[] | any;
  eventmasterListlength: any;
  get fnameData() {
    return this.eventmasterForm.controls;
  }
  submittedeventMasterData = false;
  isView: boolean;
  isCreated: boolean;
  isUpdated: boolean;
  isDeleted: boolean;

  constructor(
    public adminLayoutService: AdminLayoutService,
    private fb: FormBuilder,
    public commonService: CommonService, private router: Router
  ) {
    let pagePermission = { module: "eventMaster" }
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
    this.noData = false;
    this.l = 10;
    this.ISeditEventMaster = false;
    this.getEventmasterList();
    this.defaultForm();
  }
  myTooltip = {
    'placement': 'bottom',
    'showDelay': 100
  }
  defaultForm() {
    this.eventmasterForm = this.fb.group({
      _id: [""],
      name: ["", [Validators.required]],
    });
  }

  addEventmaster() {
    $("#add-menu-modal").modal("show");
    this.ISeditEventMaster = false;
    this.submittedeventMasterData = false;
  }

  cancelEventmaster() {
    $("#add-menu-modal").modal("hide");
    this.defaultForm();
    this.ISeditEventMaster = false;
    this.submittedeventMasterData = false;
  }

  saveEventmaster() {
    if (this.eventmasterForm.invalid) {
      this.submittedeventMasterData = true;
      return;
    }
    let eventmasterModelObj = {
      name: this.eventmasterForm.controls.name.value,
    };

    this.adminLayoutService.SaveeventMaster(eventmasterModelObj).subscribe(
      (Response: any) => {
        if (Response.meta.code == 200) {
          this.submittedeventMasterData = false;
          this.getEventmasterList();
          this.defaultForm();
          this.ISeditEventMaster = false;
          this.commonService.notifier.notify("success", "Event Saved Successfully.");
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

  editEventmaster(paramsObj) {
    this.ISeditEventMaster = true;
    let Id: any = { _id: paramsObj.id };
    this.adminLayoutService.geteventMasterId(Id).subscribe(
      (Response: any) => {
        this.eventmasterForm.controls._id.setValue(Response.data._id);
        this.eventmasterForm.controls.name.setValue(Response.data.name);
        $("#add-menu-modal").modal("show");
      },
      (error) => { }
    );
  }

  updateEventmaster() {
    if (this.eventmasterForm.invalid) {
      this.submittedeventMasterData = true;
      return;
    }
    let eventmasterModelObj = {
      _id: this.eventmasterForm.controls._id.value,
      name: this.eventmasterForm.controls.name.value,
    };

    this.adminLayoutService.UpdateeventMaster(eventmasterModelObj).subscribe(
      (Response: any) => {
        if (Response.meta.code == 200) {
          this.submittedeventMasterData = false;
          this.getEventmasterList();
          this.defaultForm();
          this.ISeditEventMaster = false;
          this.commonService.notifier.notify("success", "Event Updated Successfully.");
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

  statusEventmaster(paramsObj) {
    let statuseventmasterModelObj = {
      _id: paramsObj.id,
      status: paramsObj.status,
    };

    this.adminLayoutService
      .StatuseventMaster(statuseventmasterModelObj)
      .subscribe(
        (Response: any) => {
          if (Response.meta.code == 200) {
            this.submittedeventMasterData = false;
            this.getEventmasterList();
            this.defaultForm();
            this.ISeditEventMaster = false;
            if (paramsObj.status == 1) {
              this.commonService.notifier.notify(
                "success",
                "Event Actived Successfully."
              );
            }
            else {
              this.commonService.notifier.notify(
                "success",
                "Event Deactived Successfully."
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

  getEventmasterList() {
    this.adminLayoutService.geteventMaster().subscribe(
      (Response: any) => {
        if (Response.meta.code == 200) {
          this.eventMasterList = Response.data;
          this.eventmasterList = this.eventMasterList;
          this.alleventmaster = this.eventmasterList;
          this.eventmasterList = this.eventMasterList.slice();
          this.eventmasterListlength = Response.data.length;
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
    this.eventmasterList = this.alleventmaster.filter((val: any) => val.name.toLowerCase().includes(value.toLowerCase()));
    this.p = 1;
    if (this.eventmasterList.length == 0) {

      this.noData = true;
    } else {
      this.noData = false;
    }
  }
}
