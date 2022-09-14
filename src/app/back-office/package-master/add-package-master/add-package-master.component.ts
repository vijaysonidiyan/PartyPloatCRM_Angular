import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AdminLayoutService } from "app/layouts/admin-layout/admin-layout.service";
import { CommonService } from "app/shared/common.service";
import * as moment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, ThemePalette, MAT_DATE_LOCALE } from '@angular/material/core';

@Component({
  selector: 'app-add-package-master',
  templateUrl: './add-package-master.component.html',
  styleUrls: ['./add-package-master.component.css']
})
export class AddPackageMasterComponent implements OnInit {
  categotyDataForm: FormGroup | any;
  eventList: any;
  viewInquiry: boolean = false;

  get fclientinquiryData() {
    return this.categotyDataForm.controls;
  }

  constructor(public adminLayoutService: AdminLayoutService, private fb: FormBuilder, public commonService: CommonService, private router: Router, public route: ActivatedRoute) { 
  
   }

  ngOnInit(): void {
    this.defaultForm();
    this.eventList = this.categotyDataForm.get("events") as FormArray;
    if (this.viewInquiry !== true) {
      this.eventList.push(this.createCategoryItem({}));
    } 
  }
  defaultForm() {
    this.categotyDataForm = this.fb.group({
      events: this.fb.array([]),
    });
  }

  createCategoryItem(oItem?: any): FormGroup {
    return this.fb.group({
      item: [(oItem['item'] ? oItem['item'] : '')],
      description: [(oItem['description'] ? oItem['description'] : '')],
      quantity: [(oItem['quantity'] ? oItem['quantity'] : '')],
    });
  }

  addCategoryItem() {
    this.eventList.push(this.createCategoryItem({}));
  }
  // addCategory() {
  //   this.eventList.push(this.addCategory()({}));
  // }

  deletCategoryList(index: number) {
    const remove = this.eventList;
    remove.removeAt(index)
  }
}
