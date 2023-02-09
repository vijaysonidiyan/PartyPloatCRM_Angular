import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AdminLayoutService } from "app/layouts/admin-layout/admin-layout.service";
import { CommonService } from "app/shared/common.service";
declare const $: any;
import { environment } from "environments/environment";

@Component({
  selector: "app-menu-master",
  templateUrl: "./menu-master.component.html",
  styleUrls: ["./menu-master.component.css"],
})

export class MenuMasterComponent implements OnInit {

  perentList: any;
  menuForm: FormGroup;
  ISeditMenu = false;
  menuList: any[];
  allmenu: any[];
  MenuList: any[];
  l: number;
  p: number = 1;
  itemsPage: any;
  listindex: number;
  menuListlength: any;
  noData;
  moduleList: any[] = [];
  get fTitleData() { return this.menuForm.controls; }
  get fPathData() { return this.menuForm.controls; }
  submittedMenuData = false;
  @ViewChild('defaultIcon') defaultIconVariable: ElementRef;
  @ViewChild('activeIcon') activeIconVarible: ElementRef;
  iconDefaultURL = environment.uploadsUrl + 'default_icon/'
  iconActiveURL = environment.uploadsUrl + 'active_icon/'
  isView: boolean;
  isCreated: boolean;
  isUpdated: boolean;
  isDeleted: boolean;

  constructor(public commonService: CommonService, public adminLayoutService: AdminLayoutService, private fb: FormBuilder, private router: Router) {
    let pagePermission = { module: "menuMaster" }
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
    this.ISeditMenu = false;
    this.getMenuList();
    this.getPerentList();
    this.getModuleActiveList();
    this.defaultForm();
  }

  defaultForm() {
    this.menuForm = this.fb.group({
      _id: ['0'],
      title: ['', [Validators.required]],
      path: [''],
      defaultIcon: [''],
      activeIcon: [''],
      class: ['',],
      parentId: [],
      order: [''],
      module: [],
    });
  }

  addMenu() {
    this.defaultForm();
    this.defaultIconUrl = '';
    this.defaultIconFile = '';
    this.defaultIcon = '';
    this.activeIconUrl = '';
    this.activeIconFile = '';
    this.activeIcon = '';
    $("#add-menu-modal").modal("show");
  }

  cancelMenu() {
    $("#add-menu-modal").modal("hide");
    this.defaultForm();
    this.defaultIconUrl = '';
    this.defaultIconFile = '';
    this.defaultIcon = '';
    this.activeIconUrl = '';
    this.activeIconFile = '';
    this.activeIcon = '';
    this.ISeditMenu = false;
  }

  defaultIconFile: any;
  defaultIcon: any;
  defaultIconUrl: string | ArrayBuffer;
  activeIconFile: any;
  activeIcon: any;
  activeIconUrl: string | ArrayBuffer;

  onDefaultIconChange(event: any) {

    this.defaultIconFile = event.target.files[0];
    this.defaultIcon = this.defaultIconFile.name;
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.defaultIconUrl = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
    this.defaultIconVariable.nativeElement.value = this.defaultIcon;
  }
  removeDefaultIcon() {
    console.log('nativeeletment', this.defaultIconVariable.nativeElement)
    console.log('value', this.defaultIconVariable.nativeElement.value)
    this.defaultIconUrl = '';
    this.defaultIconFile = '';
    this.defaultIcon = '';
    // this.menuForm.controls.defaultIcon.setValue('');
    this.defaultIconVariable.nativeElement.value = "";
  }

  onActiveIconChange(event: any) {
    this.activeIconFile = event.target.files[0];
    this.activeIcon = this.activeIconFile.name;
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.activeIconUrl = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
    this.activeIconVarible.nativeElement.value = this.activeIcon;
  }
  removeActiveIcon() {
    this.activeIconUrl = '';
    this.activeIconFile = '';
    this.activeIcon = '';
    // this.menuForm.controls.activeIcon.setValue('');
    this.activeIconVarible.nativeElement.value = "";
  }

  getMenuList() {
    this.adminLayoutService.getmenu().subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.MenuList = Response.data;
        this.menuList = this.MenuList.sort((a: any, b: any) => a.order - b.order)
        this.allmenu = this.menuList
        this.menuList = this.MenuList.slice();
        this.menuListlength = Response.data.length;
        this.noData = false;
      } else {
        this.noData = true;
      }
      //for select sub industry step
    }, (error) => {
      console.log(error.error.Message);
    });
  }

  saveMenu() {

    if (this.menuForm.invalid) {
      this.submittedMenuData = true;
      return;
    }

    let menuModelObj: FormData = new FormData();
    menuModelObj.append('title', this.menuForm.value.title);
    menuModelObj.append('path', this.menuForm.value.path);
    menuModelObj.append('class', this.menuForm.value.class);
    menuModelObj.append('parentId', this.menuForm.value.parentId == null ? '' : this.menuForm.value.parentId);
    menuModelObj.append('order', this.menuForm.value.order);
    menuModelObj.append('module', this.menuForm.value.module == null ? '' : this.menuForm.value.module);
    menuModelObj.append('default_icon', this.defaultIconFile);
    menuModelObj.append('active_icon', this.activeIconFile);

    this.adminLayoutService.Savemenu(menuModelObj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.submittedMenuData = false;
        this.getMenuList();
        this.defaultForm();
        this.getPerentList();
        this.ISeditMenu = false;
        this.commonService.notifier.notify('success', "Menu Details Saved Successfully.");
        $("#add-menu-modal").modal("hide");
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    }, (error) => {
      console.log(error);
    });
  }

  editMenumaster(paramsObj) {

    this.ISeditMenu = true;
    let Id: any = { '_id': paramsObj.id }
    this.adminLayoutService.getmenuId(Id).subscribe((Response: any) => {

      this.menuForm.controls._id.setValue(Response.data._id)
      this.menuForm.controls.title.setValue(Response.data.title)
      this.menuForm.controls.path.setValue(Response.data.path)
      // if (!!Response.data.icon) {
      //   this.menuForm.controls.icon.setValue(Response.data.icon)
      // }

      if (!!Response.data.default_icon) {
        this.defaultIconUrl = this.iconDefaultURL + Response.data.default_icon;
        this.defaultIcon = Response.data.default_icon;
        this.defaultIconFile = Response.data.default_icon;
        // this.menuForm.get('defaultIcon').setValue(Response.data.default_icon);
        // this.defaultIconVariable.nativeElement.value = "C:\fakepath\abc.jpg";
        // this.defaultIconVariable.nativeElement.value = "C:\fakepath\abc.jpg";
      } else {
        this.defaultIconUrl = "";
        this.defaultIcon = "";
        this.defaultIconFile = "";
        this.defaultIconVariable.nativeElement.value = "";
      }
      if (!!Response.data.active_icon) {
        this.activeIconUrl = this.iconActiveURL + Response.data.active_icon;
        this.activeIcon = Response.data.active_icon;
        this.activeIconFile = Response.data.active_icon;
      } else {
        this.activeIconUrl = "";
        this.activeIcon = "";
        this.activeIconFile = "";
        this.activeIconVarible.nativeElement.value = "";
      }

      if (!!Response.data.class) {
        this.menuForm.controls.class.setValue(Response.data.class)
      }
      if (!!Response.data.parentId) {
        this.menuForm.controls.parentId.setValue(Response.data.parentId == '' ? null : Response.data.parentId)
      }
      this.menuForm.controls.order.setValue(parseFloat(Response.data.order))
      this.menuForm.controls.module.setValue(Response.data.module == '' ? null : Response.data.module)
      $("#add-menu-modal").modal("show");
    }, (error) => {

    });
  }

  updateMenu() {
    if (this.menuForm.invalid) {
      this.submittedMenuData = true;
      return;
    }


    let menuModelObj: FormData = new FormData();
    menuModelObj.append('_id', this.menuForm.value._id);
    menuModelObj.append('title', this.menuForm.value.title);
    menuModelObj.append('path', this.menuForm.value.path);
    menuModelObj.append('class', this.menuForm.value.class);
    menuModelObj.append('parentId', this.menuForm.value.parentId == null ? '' : this.menuForm.value.parentId);
    menuModelObj.append('order', this.menuForm.value.order);
    menuModelObj.append('module', this.menuForm.value.module == null ? '' : this.menuForm.value.module);
    menuModelObj.append('default_icon', this.defaultIconFile);
    menuModelObj.append('active_icon', this.activeIconFile);

    this.adminLayoutService.Updatemenu(menuModelObj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.submittedMenuData = false;
        this.getMenuList();
        this.defaultForm();
        this.getPerentList();
        this.ISeditMenu = false;
        this.commonService.notifier.notify('success', "Menu Details Updated Successfully.");
        $("#add-menu-modal").modal("hide");
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    }, (error) => {
      console.log(error);
    });
  }

  statusMenu(paramsObj) {


    let statusmenuModelObj = {
      "_id": paramsObj.id,
      "status": paramsObj.status
    };


    this.adminLayoutService.Statusmenu(statusmenuModelObj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        if (paramsObj.status == 1) {
          this.commonService.notifier.notify('success', "Menu Details Actived Successfully.");
        }
        else {
          this.commonService.notifier.notify('success', "Menu Details Deactived Successfully.");
        }
        this.submittedMenuData = false;
        this.getMenuList();
        this.defaultForm();
        this.ISeditMenu = false;
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    }, (error) => {
      console.log(error);
    });
  }

  getPerentList() {

    this.adminLayoutService.getPerentList().subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.perentList = Response.data;
      } else {
      }
      //for select sub industry step
    }, (error) => {
      console.log(error.error.Message);
    });
  }

  getModuleActiveList() {

    this.adminLayoutService.getModuleActiveList().subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.moduleList = Response.data;
      } else {
      }
      //for select sub industry step
    }, (error) => {
      console.log(error.error.Message);
    });
  }

  search(value: string): void {
    this.menuList = this.allmenu.filter((val: any) => JSON.stringify(val).toLowerCase().includes(value.toLowerCase()));
    this.p = 1;
    if (this.menuList.length == 0) {

      this.noData = true;
    } else {
      this.noData = false;
    }
  }

}
