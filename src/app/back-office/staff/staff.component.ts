import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AdminLayoutService } from "app/layouts/admin-layout/admin-layout.service";
import { CommonService } from "app/shared/common.service";
declare const $: any;
@Component({
  selector: "app-staff",
  templateUrl: "./staff.component.html",
  styleUrls: ["./staff.component.css"],
})
export class StaffComponent implements OnInit {
  partyplotList: any;
  staffForm: FormGroup;
  ISeditStaff = false;
  staffList: any[];
  allstaffList: any[];
  StaffList: any[];
  l: number;
  p: number = 1;
  mySelect;
  itemsPage: any;
  staffIndex: number;
  staffListlength: any;
  noData;
  get fnameData() {
    return this.staffForm.controls;
  }
  submittedPartyplotData = false;
  eventInvalid = false;

  constructor(
    public commonService: CommonService,
    public adminLayoutService: AdminLayoutService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.noData = false;
    this.mySelect = 5;
    this.l = 10;
    this.ISeditStaff = false;
    this.getStaffList();
    this.getpartyplotActiveList();
    this.defaultForm();
  }

  defaultForm() {
    this.staffForm = this.fb.group({
      _id: ["0"],
      name: ["", [Validators.required]],
      email: [""],
      contact: [""],
      roleId: ["0"],
      reference: ["", [Validators.required]],
      aadharcardNo: [""],
      partyplotData: [""],
      roleName: [""],
    });
  }

  addMenu() {
    $("#add-menu-modal").modal("show");
    this.ISeditStaff = false;
  }

  cancelMenu() {
    $("#add-menu-modal").modal("hide");
    this.defaultForm();
    this.ISeditStaff = false;
  }

  getStaffList() {
    this.adminLayoutService.getStaff().subscribe(
      (Response: any) => {
        if (Response.meta.code == 200) {
          this.StaffList = Response.data;
          this.staffList = this.StaffList;
          this.allstaffList = this.staffList;
          this.staffList = this.StaffList.slice();
          this.staffListlength = Response.data.length;
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

  getpartyplotActiveList() {
    this.adminLayoutService.getPartyplotActiveList().subscribe(
      (Response: any) => {
        if (Response.meta.code == 200) {
          this.partyplotList = Response.data;
        } else {
        }
        //for select sub industry step
      },
      (error) => {
        console.log(error.error.Message);
      }
    );
  }
}
