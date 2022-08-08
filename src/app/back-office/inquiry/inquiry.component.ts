import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AdminLayoutService } from "app/layouts/admin-layout/admin-layout.service";
import { CommonService } from "app/shared/common.service";
declare const $: any;
@Component({
  selector: "app-inquiry",
  templateUrl: "./inquiry.component.html",
  styleUrls: ["./inquiry.component.css"],
})
export class InquiryComponent implements OnInit {
  eventList: any[] = [];
  partyplotList: any[] = [];
  constructor() {}
  ngOnInit(): void {}
  addInquiry() {
    $("#add-menu-modal").modal("show");
  }
  cancleInquiry() {
    $("#add-menu-modal").modal("hide");
  }
}
