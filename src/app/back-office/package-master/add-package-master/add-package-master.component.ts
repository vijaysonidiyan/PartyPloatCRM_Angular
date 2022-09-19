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
  packageDataForm: FormGroup | any;
  packageList: any;
  packageCategoryLists: any;
  packageData: boolean = false;
  PackageId: any;
  assignpartyplotList: any[] = [];

  get fclientinquiryData() {
    return this.packageDataForm.controls;
  }

  constructor(public adminLayoutService: AdminLayoutService, private fb: FormBuilder, public commonService: CommonService, private router: Router, public route: ActivatedRoute) {
    let currentUrl = this.router.url;

    if (currentUrl.includes('edit-package-master')) {
      this.packageData = true;
      this.route.params.subscribe((x: Params) => {
        this.PackageId = x.id
      })
      this.getPackageMasterById();
    }
    else {
      this.packageData = false
    }
  }

  ngOnInit(): void {
    this.defaultForm();
    this.getAssignPartyplotList();
    if (this.packageData !== true) {
      this.addPackageItem();
    }
  }
  defaultForm() {
    this.packageDataForm = this.fb.group({
      _id: [''],
      packageName: [''],
      partyplot_ID: [null],
      package: this.fb.array([]),
    });
  }

  getAssignPartyplotList() {
    this.adminLayoutService.assignpartyplotUserWiseList().subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.assignpartyplotList = Response.data;
      }
      //for select sub industry step
    },
      (error) => {
        console.log(error.error.Message);
      }
    );
  }

  addPackageItem(oItem?: any) {
    let packageList = this.packageDataForm.get("package") as FormArray;
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
      quantity: [(cItem ? cItem['quantity'] : '')],
    });
    (((this.packageDataForm.controls['package'] as FormArray)
      .controls[oItem] as FormGroup).controls['packageCategoryList'] as FormArray).push(cd);
  }

  deleteCategoryListData(oItem: number) {
    (this.packageDataForm.controls['package'] as FormArray).removeAt(oItem);
  }

  deletepackageCategoryList(oItem: number, cItem: number) {
    (((this.packageDataForm.controls['package'] as FormArray)
      .controls[oItem] as FormGroup).controls['packageCategoryList'] as FormArray).removeAt(cItem);
  }

  savePackageMaster() {
    if (this.packageDataForm.invalid) {
      return;
    }
    if (this.packageData === false) {
      let packageMasterObj = {
        packageName: this.packageDataForm.controls.packageName.value,
        package: this.packageDataForm.controls.package.value,
        partyplot_ID: this.packageDataForm.controls.partyplot_ID.value,
      }
      this.adminLayoutService.savePackageMaster(packageMasterObj).subscribe((Response: any) => {
        if (Response.meta.code == 200) {
          this.defaultForm();
          this.router.navigate(['admin/package-master']);
          this.commonService.notifier.notify("success", 'Package Master Saved Successfully.');
        }
        else {
          this.commonService.notifier.notify("error", Response.meta.message);
        }
      })
    }
    else {
      let packageMasterObj = {
        _id: this.packageDataForm.controls._id.value,
        packageName: this.packageDataForm.controls.packageName.value,
        package: this.packageDataForm.controls.package.value,
        partyplot_ID: this.packageDataForm.controls.partyplot_ID.value,
      }
      this.adminLayoutService.updatePackageMaster(packageMasterObj).subscribe((Response: any) => {
        if (Response.meta.code == 200) {
          this.defaultForm();
          this.router.navigate(['admin/package-master']);
          this.commonService.notifier.notify("success", 'Package Master Updated Successfully.');
        }
        else {
          this.commonService.notifier.notify("error", Response.meta.message);
        }
      })
    }
  }

  getPackageMasterById() {
    let Id = {
      _id: this.PackageId
    }
    this.adminLayoutService.getPackageMasterListById(Id).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.packageDataForm.controls._id.setValue(Response.data._id);
        this.packageDataForm.controls.packageName.setValue(Response.data.packageName);
        this.packageDataForm.controls.partyplot_ID.setValue(Response.data.partyplot_ID);
        Response.data.package.forEach((x: any) => {
          this.addPackageItem(x);
        })
      }
    })
  }
}