import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminLayoutService } from 'app/layouts/admin-layout/admin-layout.service';
import { CommonService } from 'app/shared/common.service';
import { param } from 'jquery';

@Component({
  selector: 'app-package-master',
  templateUrl: './package-master.component.html',
  styleUrls: ['./package-master.component.css']
})
export class PackageMasterComponent implements OnInit {
  PackageMasterList: any[] = [];
  packageMasterList: any[] = [];
  allPackageMasterList: any[] = [];
  noData: boolean = false;

  l: number;
  p: number = 1;
  itemsPage: any;

  constructor(public commonService: CommonService, public adminLayoutService: AdminLayoutService, private router: Router) {

  }

  ngOnInit(): void {
    this.l = 10;
    this.getPackageMasterList();
  }

  getPackageMasterList() {
    this.PackageMasterList = [];
    this.allPackageMasterList = [];
    this.packageMasterList = [];
    this.adminLayoutService.getPackageMasterList().subscribe(
      (Response: any) => {
        if (Response.meta.code == 200) {
          this.PackageMasterList = Response.data;
          this.allPackageMasterList = this.PackageMasterList;
          this.packageMasterList = this.allPackageMasterList;
          this.noData = false;
        }
        else {
          this.noData = true;
        }
      })
  }
  statusPackage(params: any) {

    let statusObj = {
      _id: params.id,
      status: params.status
    }
    this.adminLayoutService.statusPackageMaster(statusObj).subscribe(
      (Response: any) => {
        if (Response.meta.code == 200) {
          this.getPackageMasterList();
          if (params.status == 1) {
            this.commonService.notifier.notify('success', 'Package Master Active Successfully.')
          }
          else {
            this.commonService.notifier.notify('success', 'Package Master Deactive Successfully.')
          }
        }
      })

  }

  editPackageMaster(id: any) {
    this.router.navigate(['admin/package-master/edit-package-master/' + id]);
  }

  addPackageMaster() {
    this.router.navigate(['admin/package-master/add-package-master']);
  }

}
