import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AdminLayoutService } from "app/layouts/admin-layout/admin-layout.service";
import { CommonService } from "app/shared/common.service";
declare const $: any;

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
  mySelect;
  itemsPage: any;
  listindex: number;
  menuListlength: any;
  noData;
  get fTitleData() { return this.menuForm.controls; }
  get fPathData() { return this.menuForm.controls; }
  submittedMenuData = false;

  constructor(public commonService: CommonService, public adminLayoutService: AdminLayoutService,  private fb: FormBuilder) {}

  ngOnInit(): void {
    this.noData = false;
    this.mySelect = 5;
    this.l = 10;
    this.ISeditMenu = false;
    this.getMenuList();
    this.getPerentList();
    this.defaultForm();
  }

  defaultForm() {
    this.menuForm = this.fb.group({
        _id: ['0'],
        title: ['', [Validators.required]],
        path: [''],
        icon: ['',],
        class: ['',],
        parentId: [],
        order: [''],
        module: [],
    });
}

  addMenu() {
    $("#add-menu-modal").modal("show");
  }

  cancelMenu() {
    $("#add-menu-modal").modal("hide");
    this.defaultForm();
    this.ISeditMenu = false;
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

    let menuModelObj = {
        "title": this.menuForm.controls.title.value,
        "path": this.menuForm.controls.path.value,
        "icon": this.menuForm.controls.icon.value,
        "class": this.menuForm.controls.class.value,
        "parentId": this.menuForm.controls.parentId.value,
        "order": parseInt(this.menuForm.controls.order.value),
        "module":  this.menuForm.controls.module.value,
    };


    this.adminLayoutService.Savemenu(menuModelObj).subscribe((Response: any) => {

        if (Response.meta.code == 200) {
            this.submittedMenuData = false;
            this.getMenuList();
            this.defaultForm();
            this.getPerentList();
            this.ISeditMenu = false;
            this.commonService.notifier.notify('success', Response.meta.message);
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
        if (!!Response.data.icon) {
            this.menuForm.controls.icon.setValue(Response.data.icon)
        }
        if (!!Response.data.class) {
            this.menuForm.controls.class.setValue(Response.data.class)
        }
        if (!!Response.data.parentId) {
            this.menuForm.controls.parentId.setValue(Response.data.parentId)
        }
        this.menuForm.controls.order.setValue(parseFloat(Response.data.order))
        this.menuForm.controls.module.setValue(Response.data.module)
        $("#add-menu-modal").modal("show");
    }, (error) => {
        
    });
  }

  updateMenu() {
      if (this.menuForm.invalid) {
        this.submittedMenuData = true;
        return;
    }

    let menumasterModelObj = {
        "_id": this.menuForm.controls._id.value,
        "title": this.menuForm.controls.title.value,
        "path": this.menuForm.controls.path.value,
        "icon": this.menuForm.controls.icon.value,
        "class": this.menuForm.controls.class.value,
        "parentId": this.menuForm.controls.parentId.value,
        "order": parseInt(this.menuForm.controls.order.value),
        "module":  this.menuForm.controls.module.value,
    };

    this.adminLayoutService.Updatemenu(menumasterModelObj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.submittedMenuData = false;
        this.getMenuList();
        this.defaultForm();
        this.getPerentList();
        this.ISeditMenu = false;
        this.commonService.notifier.notify('success', Response.meta.message);
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
            this.submittedMenuData = false;
            this.getMenuList();
            this.defaultForm();
            this.ISeditMenu = false;
            this.commonService.notifier.notify('success', Response.meta.message);
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

  moduleList = [
    {
      name: "Dashboard",
      value: "dashboard",
    },
    {
      name: "Employee List",
      value: "employeelist",
    },
    {
      name: "Designation Master",
      value: "designationmaster",
    },
  ];
}
