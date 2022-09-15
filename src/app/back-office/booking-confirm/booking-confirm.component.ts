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
  bookingDataForm: FormGroup | any;
  eventList: any;
  viewInquiry: boolean = false;
  packageList: any[] = [];
  inquiryEventId: any;
  get fbookingConfirmData() {
    return this.bookingDataForm.controls;
  }
  constructor(
    public adminLayoutService: AdminLayoutService,
    private fb: FormBuilder,
    public commonService: CommonService,
    private router: Router,
    public route: ActivatedRoute
  ) {
    this.route.params.subscribe((data: Params) => {
      this.inquiryEventId = data.id
    })

  }

  ngOnInit(): void {
    this.getPackageActiveList();
    this.defaultForm();
    this.getClientDetailsByEventId();
    this.eventList = this.bookingDataForm.get("extradecoration") as FormArray;
    if (this.viewInquiry !== true) {
      // this.addPackageItem();
    }
    this.eventList.push(this.createExtraItem({}));
  }

  defaultForm() {
    this.bookingDataForm = this.fb.group({
      name: [''],
      email: [''],
      primaryContact: [''],
      secondryContact: [''],
      address: [''],
      partyplotName: [''],
      reference_Name: [''],
      reference_detail: [''],
      packageId: [null],
      package: this.fb.array([]),
      extradecoration: this.fb.array([]),
    });
  }

  addPackageItem(oItem?: any) {
    let packageList: any;
    packageList = this.bookingDataForm.get("package") as FormArray;
    let IG = this.fb.group({
      categoryName: [(oItem ? oItem['categoryName'] : ''),],
      categoryDescription: [(oItem ? oItem['categoryDescription'] : ''),],
      packageCategoryList: this.fb.array([]),
    });

    packageList.push(IG);

    let menuIndex = packageList.length - 1;
    if (!oItem) {
      this.createCategoryItem(menuIndex);
    }
    else {
      oItem.packageCategoryList.forEach(cItem => {
        this.createCategoryItem(menuIndex, cItem);
      });
    }
  }

  createCategoryItem(oItem: number, cItem?: any) {
    let cd = this.fb.group({
      item: [(cItem ? cItem['item'] : '')],
      description: [(cItem ? cItem['description'] : '')],
      quantity: [(cItem ? cItem['quantity'] : '')],
    });
    (((this.bookingDataForm.controls['package'] as FormArray)
      .controls[oItem] as FormGroup).controls['packageCategoryList'] as FormArray).push(cd);
  }

  createExtraItem(oItem?: any): FormGroup {
    return this.fb.group({
      item: [oItem["item"] ? oItem["item"] : ""],
      description: [oItem["description"] ? oItem["description"] : ""],
      quantity: [oItem["quantity"] ? oItem["quantity"] : ""],
    });
  }

  getClientDetailsByEventId() {
    let eventIDObj = {
      _id: this.inquiryEventId
    }
    this.adminLayoutService.getClientDetailsByEventId(eventIDObj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.bookingDataForm.controls.name.setValue(Response.data[0].clientname);
        this.bookingDataForm.controls.email.setValue(Response.data[0].email);
        this.bookingDataForm.controls.primaryContact.setValue(Response.data[0].primaryContact);
        this.bookingDataForm.controls.secondryContact.setValue(Response.data[0].secondryContact);
        this.bookingDataForm.controls.address.setValue(Response.data[0].address);
        this.bookingDataForm.controls.partyplotName.setValue(Response.data[0].partyplotName);
        this.bookingDataForm.controls.reference_Name.setValue(Response.data[0].reference_Name);
        this.bookingDataForm.controls.reference_detail.setValue(Response.data[0].reference_detail);
      }
    })
  }

  getPackageActiveList() {
    this.adminLayoutService.getActivePackageMasterList().subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.packageList = Response.data;
      }
    })
  }
  onActivePackageChange(event) {

    let packageList: any;
    packageList = this.bookingDataForm.get("package") as FormArray;
    packageList.clear();

    let idObj = {
      _id: event._id
    }
    this.adminLayoutService.getPackageMasterListById(idObj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        Response.data[0].package.forEach((x: any, oItem) => {
          this.addPackageItem(x);
        })
      }
    })
  }

  deleteCategoryListData(oItem: number) {
    (this.bookingDataForm.controls['package'] as FormArray).removeAt(oItem);
  }

  deletepackageCategoryList(oItem: number, cItem: number) {
    (((this.bookingDataForm.controls['package'] as FormArray)
      .controls[oItem] as FormGroup).controls['packageCategoryList'] as FormArray).removeAt(cItem);
  }

  addExtraItem() {
    this.eventList.push(this.createExtraItem({}));
  }
  deletCategoryList(index: number) {
    const remove = this.eventList;
    remove.removeAt(index);
  }

  saveBookingConfirmInquiryEvent() {
    let bookInquiryConfirmEvent = {
      _id: this.inquiryEventId,
      package: this.bookingDataForm.controls.package.value,
      extradecoration: this.bookingDataForm.controls.extradecoration.value
    }
    // console.log(bookInquiryConfirmEvent)
    // return
    this.adminLayoutService.confirmBookingInquiryEvent(bookInquiryConfirmEvent).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.router.navigate(['admin/inquiry']);
      }
    })
  }

}
