import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { AdminLayoutService } from "app/layouts/admin-layout/admin-layout.service";
import { CommonService } from "app/shared/common.service";
import * as moment from "moment";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  ThemePalette,
  MAT_DATE_LOCALE,
} from "@angular/material/core";

@Component({
  selector: "app-booking-confirm",
  templateUrl: "./booking-confirm.component.html",
  styleUrls: ["./booking-confirm.component.css"],
})
export class BookingConfirmComponent implements OnInit {
  clientinquiryDataForm: FormGroup | any;
  bookingDataForm: FormGroup | any;
  eventList: any;
  viewInquiry: boolean = false;
  packageList: any[] = [];
  referenceActiveList: any[] = [];
  assignpartyplotList: any[] = [];

  get fclientinquiryData() {
    return this.bookingDataForm.controls;
  }

  constructor(
    public adminLayoutService: AdminLayoutService,
    private fb: FormBuilder,
    public commonService: CommonService,
    private router: Router,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.defaultForm();
    this.eventList = this.bookingDataForm.get("booking") as FormArray;
    if (this.viewInquiry !== true) {
      this.eventList.push(this.createExtraItem({}));
    }
  }
  
  defaultForm() {
    this.bookingDataForm = this.fb.group({
      booking: this.fb.array([]),
    });
  }

  createExtraItem(oItem?: any): FormGroup {
    return this.fb.group({
      item: [oItem["item"] ? oItem["item"] : ""],
      description: [oItem["description"] ? oItem["description"] : ""],
      quantity: [oItem["quantity"] ? oItem["quantity"] : ""],
    });
  }

  addExtraItem() {
    this.eventList.push(this.createExtraItem({}));
  }
  // addCategory() {
  //   this.eventList.push(this.addCategory()({}));
  // }

  deletCategoryList(index: number) {
    const remove = this.eventList;
    remove.removeAt(index);
  }
}
