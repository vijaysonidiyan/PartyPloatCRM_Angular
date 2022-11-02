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
  submittedExtraItemData = {};
  get fbookingConfirmData() {
    return this.bookingDataForm.controls;
  }
  submittedPackageSelectedData: boolean = false;
  isView: boolean;
  isCreated: boolean;
  isUpdated: boolean;
  isDeleted: boolean;

  constructor(
    public adminLayoutService: AdminLayoutService,
    private fb: FormBuilder,
    public commonService: CommonService,
    private router: Router,
    public route: ActivatedRoute
  ) {
    let pagePermission = { module: "bookingConfirm" }
    this.adminLayoutService.getpagePermission(pagePermission).subscribe((Response: any) => {
      debugger
      if (Response.meta.code == 200) {

        this.isView = Response.data.isView;
        this.isCreated = Response.data.isCreated;
        this.isUpdated = Response.data.isUpdated;
        this.isDeleted = Response.data.isDeleted;
        if (this.isCreated === false && this.isView === false) {
          this.router.navigate(['admin/inquiry/calender-view']);
        }
      }
    }, (error) => {
      console.log(error.error.Message);
    });
    this.route.params.subscribe((data: Params) => {
      this.inquiryEventId = data.id
    })

  }

  ngOnInit(): void {
    this.defaultForm();
    this.getClientDetailsByEventId();
    this.eventList = this.bookingDataForm.get("extradecoration") as FormArray;
    //this.eventList.push(this.createExtraItem({}));
    // let validation = (this.bookingDataForm.controls['extradecoration'] as FormArray).controls[this.eventList.controls.length - 1] as FormGroup;
    // validation.get('item').setValidators([Validators.required]);
    // validation.get('quantity').setValidators([Validators.required]);
  }

  defaultForm() {
    this.bookingDataForm = this.fb.group({
      name: [''],
      email: [''],
      primaryContact: [''],
      secondryContact: [''],
      address: [''],
      partyplotName: [''],
      partyplot_ID: [''],
      reference_Name: [''],
      reference_detail: [''],
      eventName: [''],
      clientInquiryId: [''],
      eventType: [''],
      startDateObj: [''],
      endDateObj: [''],
      client_budget: [''],
      guest: [''],
      offer_budget: [''],
      basicPackage: [''],
      discount: [''],
      finalbudget: [''],
      remark: [''],
      extraDecorBudget: ['0'],
      packageId: [null, [Validators.required]],
      package: this.fb.array([]),
      extradecoration: this.fb.array([]),
    });
  }

  addPackageItem(oItem?: any) {
    let packageList: any;
    packageList = this.bookingDataForm.get("package") as FormArray;
    let IG = this.fb.group({
      categoryName: [(oItem ? oItem['categoryName'] : ''),],
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
      item: [oItem["item"] ? oItem["item"] : "", [Validators.required]],
      description: [oItem["description"] ? oItem["description"] : ""],
      quantity: [oItem["quantity"] ? oItem["quantity"] : "", [Validators.required]],
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
        this.bookingDataForm.controls.clientInquiryId.setValue(Response.data[0].clientInquiryId);
        this.bookingDataForm.controls.partyplotName.setValue(Response.data[0].partyplotName);
        this.bookingDataForm.controls.partyplot_ID.setValue(Response.data[0].partyplot_ID);
        this.bookingDataForm.controls.reference_Name.setValue(Response.data[0].reference_Name);
        this.bookingDataForm.controls.reference_detail.setValue(Response.data[0].reference_detail);
        this.bookingDataForm.controls.eventName.setValue(Response.data[0].eventName);
        this.bookingDataForm.controls.eventType.setValue(Response.data[0].eventType);
        this.bookingDataForm.controls.startDateObj.setValue(Response.data[0].startDateObj);
        this.bookingDataForm.controls.endDateObj.setValue(Response.data[0].endDateObj);
        this.bookingDataForm.controls.client_budget.setValue(Response.data[0].client_budget);
        this.bookingDataForm.controls.guest.setValue(Response.data[0].guest);
        this.bookingDataForm.controls.extraDecorBudget.setValue(Response.data[0].extraDecorBudget ? Response.data[0].extraDecorBudget : '0');
        this.bookingDataForm.controls.offer_budget.setValue(Response.data[0].offer_budget);
        this.bookingDataForm.controls.basicPackage.setValue(Response.data[0].offer_budget);
        this.bookingDataForm.controls.discount.setValue(0);
        this.bookingDataForm.controls.finalbudget.setValue(0);
        this.bookingDataForm.controls.remark.setValue(Response.data[0].remark);
        this.getPackageActiveList();
      }
    })
  }

  getPackageActiveList() {
    let Id = {
      partyplot_ID: this.bookingDataForm.controls.partyplot_ID.value
    }
    this.adminLayoutService.getActivePackageMasterListByPartyPlotId(Id).subscribe((Response: any) => {
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
        Response.data.package.forEach((x: any, oItem) => {
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
    // let validation = (this.bookingDataForm.controls['extradecoration'] as FormArray).controls[this.eventList.controls.length - 1] as FormGroup;
    // validation.get('item').setValidators([Validators.required]);
    // validation.get('quantity').setValidators([Validators.required]);
  }
  deletCategoryList(index: number) {
    let validation = (this.bookingDataForm.controls['extradecoration'] as FormArray).controls;
    validation.map((x: any, index: any) => {
      x.controls.item.clearValidators();
      x.controls.quantity.clearValidators();
      this.submittedExtraItemData[index] = false;
    })
    const remove = this.eventList;
    remove.removeAt(index);
  }

  saveBookingConfirmInquiryEvent() {

    if (this.bookingDataForm.invalid) {
      this.submittedPackageSelectedData = true;
      (this.bookingDataForm.controls['extradecoration'] as FormArray).controls.map((x: any, index: any) => {
        this.submittedExtraItemData[index] = true
      })
      return
    }

    let bookInquiryConfirmEvent = {
      _id: this.inquiryEventId,
      extraDecorBudget: this.bookingDataForm.controls.extraDecorBudget.value,
      package: this.bookingDataForm.controls.package.value,
      extradecoration: this.bookingDataForm.controls.extradecoration.value,
      basicPackage: this.bookingDataForm.controls.basicPackage.value,
      discount: this.bookingDataForm.controls.discount.value,
      finalbudget: this.bookingDataForm.controls.finalbudget.value
    }
    // console.log(bookInquiryConfirmEvent)
    // return
    this.adminLayoutService.confirmBookingInquiryEvent(bookInquiryConfirmEvent).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.commonService.notifier.notify("success", "Booking Confirm Successfully.")
        this.router.navigate(['admin/booking-confirm-list']);
      }
      else {
        this.commonService.notifier.notify("error", Response.meta.message);
      }
    })
  }

}
