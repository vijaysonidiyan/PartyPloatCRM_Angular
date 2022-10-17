import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AdminLayoutService } from "app/layouts/admin-layout/admin-layout.service";
import { CommonService } from "app/shared/common.service";
declare const $: any;
@Component({
  selector: "app-party-plot-master",
  templateUrl: "./party-plot-master.component.html",
  styleUrls: ["./party-plot-master.component.css"],
})
export class PartyPlotMasterComponent implements OnInit {
  activeeventList: any[];
  partyplotForm: FormGroup;
  ISeditPartyplot = false;
  partyplotList: any[];
  allpartyplot: any[];
  PartyplotList: any[];
  l: number;
  p: number = 1;
  itemsPage: any;
  partyPlotIndex: number;
  partyplotListlength: any;
  noData;
  get fnameData() {
    return this.partyplotForm.controls;
  }
  submittedPartyplotData = false;
  eventInvalid = false;
  isView: boolean;
  isCreated: boolean;
  isUpdated: boolean;
  isDeleted: boolean;

  constructor(
    public commonService: CommonService,
    public adminLayoutService: AdminLayoutService,
    private fb: FormBuilder, private router: Router
  ) { 
    let pagePermission = { module: "partyPlotMaster" }
    this.adminLayoutService.getpagePermission(pagePermission).subscribe((Response: any) => {
      debugger
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
    this.ISeditPartyplot = false;
    this.getPartyplotList();
    this.getEventActiveList();
    this.defaultForm();
  }

  defaultForm() {
    this.partyplotForm = this.fb.group({
      _id: ["0"],
      name: ["", [Validators.required]],
      address: ["", [Validators.required]],
      events: ["", [Validators.required]],
    });
  }

  addPartyplot() {
    $("#add-menu-modal").modal("show");
    this.ISeditPartyplot = false;
    this.submittedPartyplotData = false;
  }

  cancelPartyplot() {
    $("#add-menu-modal").modal("hide");
    this.defaultForm();
    this.submittedPartyplotData = false;
    this.ISeditPartyplot = false;
  }

  getPartyplotList() {
    this.adminLayoutService.getpartyplotMaster().subscribe(
      (Response: any) => {
        if (Response.meta.code == 200) {
          this.PartyplotList = Response.data;
          this.partyplotList = this.PartyplotList;
          this.allpartyplot = this.partyplotList;
          this.partyplotList = this.PartyplotList.slice();
          this.partyplotListlength = Response.data.length;
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

  getEventActiveList() {
    this.adminLayoutService.geteventActiveList().subscribe(
      (Response: any) => {
        if (Response.meta.code == 200) {
          this.activeeventList = Response.data;
        } else {
        }
        //for select sub industry step
      },
      (error) => {
        console.log(error.error.Message);
      }
    );
  }

  savePartyplot() {

    if (this.partyplotForm.invalid) {
      this.submittedPartyplotData = true;
      return;
    }

    let partyplotModelObj = {
      name: this.partyplotForm.controls.name.value,
      address: this.partyplotForm.controls.address.value,
      events: this.partyplotForm.controls.events.value,
    };

    this.adminLayoutService.SavepartyplotMaster(partyplotModelObj).subscribe(
      (Response: any) => {
        if (Response.meta.code == 200) {
          this.submittedPartyplotData = false;
          this.getPartyplotList();
          this.defaultForm();
          this.getEventActiveList();
          this.ISeditPartyplot = false;
          this.commonService.notifier.notify("success", "Party Plot Saved Successfully.");
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

  editPartyplotmaster(paramsObj) {
    this.ISeditPartyplot = true;
    let Id: any = { _id: paramsObj.id };
    this.adminLayoutService.getpartyplotMasterId(Id).subscribe(
      (Response: any) => {
        this.partyplotForm.controls._id.setValue(Response.data._id);
        this.partyplotForm.controls.name.setValue(Response.data.name);
        this.partyplotForm.controls.address.setValue(Response.data.address);
        this.partyplotForm.controls.events.setValue(Response.data.events);
        $("#add-menu-modal").modal("show");
      },
      (error) => { }
    );
  }

  updatePartyplot() {

    if (this.partyplotForm.invalid) {
      this.submittedPartyplotData = true;
      return;
    }

    let partyplotmasterModelObj = {
      _id: this.partyplotForm.controls._id.value,
      name: this.partyplotForm.controls.name.value,
      address: this.partyplotForm.controls.address.value,
      events: this.partyplotForm.controls.events.value,
    };

    this.adminLayoutService
      .UpdatepartyplotMaster(partyplotmasterModelObj)
      .subscribe(
        (Response: any) => {
          if (Response.meta.code == 200) {
            this.submittedPartyplotData = false;
            this.getPartyplotList();
            this.defaultForm();
            this.getEventActiveList();
            this.ISeditPartyplot = false;
            this.commonService.notifier.notify(
              "success",
              "Party Plot Updated Successfully."
            );
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

  statusPartyplot(paramsObj) {
    let statuspartyplotModelObj = {
      _id: paramsObj.id,
      status: paramsObj.status,
    };

    this.adminLayoutService
      .StatuspartyplotMaster(statuspartyplotModelObj)
      .subscribe(
        (Response: any) => {
          if (Response.meta.code == 200) {
            this.submittedPartyplotData = false;
            this.getPartyplotList();
            this.defaultForm();
            this.ISeditPartyplot = false;
            if (paramsObj.status == 1) {
              this.commonService.notifier.notify(
                "success",
                "Party Plot Actived Successfully."
              );
            }
            else {
              this.commonService.notifier.notify(
                "success",
                "Party Plot Deactived Successfully."
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

  search(value: string): void {
    this.partyplotList = this.allpartyplot.filter((val: any) => JSON.stringify(val).toLowerCase().includes(value.toLowerCase()));
    this.p = 1;
    if (this.partyplotList.length == 0) {

      this.noData = true;
    } else {
      this.noData = false;
    }
  }
}
