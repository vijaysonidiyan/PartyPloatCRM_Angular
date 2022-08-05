import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { AdminLayoutService } from "app/layouts/admin-layout/admin-layout.service";
import { CommonService } from "app/shared/common.service";
import { StorageService } from "app/shared/storage.service";
declare const $: any;
@Component({
  selector: "app-role-wise-menu",
  templateUrl: "./role-wise-menu.component.html",
  styleUrls: ["./role-wise-menu.component.css"],
})
export class RoleWiseMenuComponent implements OnInit {

  rolewisemenuForm: FormGroup;
  submittedMenuData = false;
  menuList: any;
  activeroleList: any;
  selectedRole;
  isView: boolean;
  isCreated: boolean;
  isUpdated: boolean;
  isDeleted: boolean;
  constructor(public adminLayoutService: AdminLayoutService, private fb: FormBuilder, public commonService: CommonService, public storageService: StorageService) {}

  ngOnInit(): void {
    this.getRoleActiveList();
    this.selectedRole = null;
    this.defaultForm();
    this.menuList = this.rolewisemenuForm.get('menuList') as FormArray;
  }

  

  defaultForm() {
    this.rolewisemenuForm = this.fb.group({
        menuList: this.fb.array([]),
    });
  }

  addMenuItem(oItem?: any) {

    let IG = this.fb.group({
        menuId: [(oItem['_id'] ? oItem['_id'] : ''),],
        title: [(oItem['title'] ? oItem['title'] : ''),],
        isCreated: [(oItem['isCreated'] ? oItem['isCreated'] : false),],
        isUpdated: [(oItem['isUpdated'] ? oItem['isUpdated'] : false),],
        isView: [(oItem['isView'] ? oItem['isView'] : false),],
        isDeleted: [(oItem['isDeleted'] ? oItem['isDeleted'] : false),],
        isShowChildrenList: [(oItem['isShowChildrenList'] ? oItem['isShowChildrenList'] : false),],
        childrenData: this.fb.array([]),
    });
    (this.rolewisemenuForm.get('menuList') as FormArray).push(IG);
    let menuIndex = (this.rolewisemenuForm.get('menuList') as FormArray).length - 1;
    oItem.childrenData.forEach(cItem => {
        this.addChildrenItem(menuIndex, cItem);
    });
  }

  addChildrenItem(oItem: number, cItem?: any) {
    let cd = this.fb.group({
        menuId: [(cItem['_id'] ? cItem['_id'] : ''),],
        title: [(cItem['title'] ? cItem['title'] : ''),],
        isCreated: [(cItem['isCreated'] ? cItem['isCreated'] : false),],
        isUpdated: [(cItem['isUpdated'] ? cItem['isUpdated'] : false),],
        isView: [(cItem['isView'] ? cItem['isView'] : false),],
        isDeleted: [(cItem['isDeleted'] ? cItem['isDeleted'] : false),],
    });
    (((this.rolewisemenuForm.controls['menuList'] as FormArray)
        .controls[oItem] as FormGroup).controls['childrenData'] as FormArray).push(cd);
}

  onRoleChange() {

    this.menuList.clear();
    let roleId = { RoleId: this.selectedRole }
    this.adminLayoutService.getRolewisemenuList(roleId).subscribe((Response: any) => {

        if (Response.meta.code == 200) {
            Response.data.forEach(oItem => {
                this.addMenuItem(oItem);
            });
        } else {
        }
        //for select sub industry step
    }, (error) => {
        console.log(error.error.Message);
    });
  }

  getRoleActiveList() {
    this.adminLayoutService.getRoleList().subscribe(
      (Response: any) => {
        if (Response.meta.code == 200) {
          this.activeroleList = Response.data;
        } else {
        }
        //for select sub industry step
      },
      (error) => {
        console.log(error.error.Message);
      }
    );
  }

  isCreatedAllchildrenData(paramsObj) {
    debugger
    let menuIndex = paramsObj.index
    let checked = paramsObj.checked

    if (checked == true) {
      (((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup).controls['childrenData'] as FormArray).controls.map(value => value.get('isCreated').setValue(true));
    } else {
      (((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup).controls['childrenData'] as FormArray).controls.map(value => value.get('isCreated').setValue(false));
    }

}

isViewAllchildrenData(paramsObj) {

    let menuIndex = paramsObj.index
    let checked = paramsObj.checked

    if (checked == true) {
      (((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup).controls['childrenData'] as FormArray).controls.map(value => value.get('isView').setValue(true));
    } else {
      (((this.rolewisemenuForm.controls['menuList'] as FormArray) .controls[menuIndex] as FormGroup).controls['childrenData'] as FormArray).controls.map(value => value.get('isView').setValue(false));
    }

}

isUpdatedchildrenData(paramsObj) {

    let menuIndex = paramsObj.index
    let checked = paramsObj.checked

    if (checked == true) {
        (((this.rolewisemenuForm.controls['menuList'] as FormArray)
            .controls[menuIndex] as FormGroup).controls['childrenData'] as FormArray).controls.map(value => value.get('isUpdated').setValue(true));
    } else {
        (((this.rolewisemenuForm.controls['menuList'] as FormArray)
            .controls[menuIndex] as FormGroup).controls['childrenData'] as FormArray).controls.map(value => value.get('isUpdated').setValue(false));
    }

}

isDeletedchildrenData(paramsObj) {

    let menuIndex = paramsObj.index
    let checked = paramsObj.checked

    if (checked == true) {
        (((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup).controls['childrenData'] as FormArray).controls.map(value => value.get('isDeleted').setValue(true));
    } else {
        (((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup).controls['childrenData'] as FormArray).controls.map(value => value.get('isDeleted').setValue(false));
    }

}

isCreatedmenuData(paramsObj) {

    let menuIndex = paramsObj.menuIndex
    var totalSelected = 0;
    (((this.rolewisemenuForm.controls['menuList'] as FormArray)
        .controls[menuIndex] as FormGroup).controls['childrenData'] as FormArray).controls.forEach(value => {

            if (value.value.isCreated == true) {
                totalSelected++;
            }

        });
    if (totalSelected > 0) {
        (this.rolewisemenuForm.get('menuList') as FormArray)
            .controls[menuIndex].get('isCreated').setValue(true);
    } else {
        (this.rolewisemenuForm.get('menuList') as FormArray)
            .controls[menuIndex].get('isCreated').setValue(false);
    }

}

isViewmenuData(paramsObj) {

    let menuIndex = paramsObj.menuIndex
    var totalSelected = 0;
    (((this.rolewisemenuForm.controls['menuList'] as FormArray)
        .controls[menuIndex] as FormGroup).controls['childrenData'] as FormArray).controls.forEach(value => {

            if (value.value.isView == true) {
                totalSelected++;
            }

        });
    if (totalSelected > 0) {
        (this.rolewisemenuForm.get('menuList') as FormArray)
            .controls[menuIndex].get('isView').setValue(true);
    } else {
        (this.rolewisemenuForm.get('menuList') as FormArray)
            .controls[menuIndex].get('isView').setValue(false);
    }

}

isUpdatedmenuData(paramsObj) {

    let menuIndex = paramsObj.menuIndex
    var totalSelected = 0;
    (((this.rolewisemenuForm.controls['menuList'] as FormArray)
        .controls[menuIndex] as FormGroup).controls['childrenData'] as FormArray).controls.forEach(value => {

            if (value.value.isUpdated == true) {
                totalSelected++;
            }

        });
    if (totalSelected > 0) {
        (this.rolewisemenuForm.get('menuList') as FormArray)
            .controls[menuIndex].get('isUpdated').setValue(true);
    } else {
        (this.rolewisemenuForm.get('menuList') as FormArray)
            .controls[menuIndex].get('isUpdated').setValue(false);
    }

}

isDeletedmenuData(paramsObj) {

    let menuIndex = paramsObj.menuIndex
    var totalSelected = 0;
    (((this.rolewisemenuForm.controls['menuList'] as FormArray)
        .controls[menuIndex] as FormGroup).controls['childrenData'] as FormArray).controls.forEach(value => {

            if (value.value.isDeleted == true) {
                totalSelected++;
            }

        });
    if (totalSelected > 0) {
        (this.rolewisemenuForm.get('menuList') as FormArray)
            .controls[menuIndex].get('isDeleted').setValue(true);
    } else {
        (this.rolewisemenuForm.get('menuList') as FormArray)
            .controls[menuIndex].get('isDeleted').setValue(false);
    }

  }
  showHideMenuList(params) {

    if (params !== undefined && params.index !== undefined) {
        if ((this.rolewisemenuForm.get('menuList') as FormArray).controls[params.index].value.isShowChildrenList == false) {
            (this.rolewisemenuForm.get('menuList') as FormArray).controls[params.index].get('isShowChildrenList').setValue(true);
        } else {
            (this.rolewisemenuForm.get('menuList') as FormArray).controls[params.index].get('isShowChildrenList').setValue(false);
        }

    }
  }

  saveRolewisemenu() {

    if (this.rolewisemenuForm.invalid) {
        this.submittedMenuData = true;
        return;
    }


    let savemenuList = []

    this.rolewisemenuForm.value.menuList.forEach(obj => {
        var customObj = {
            'menuId': obj.menuId,
            'isCreated': obj.isCreated,
            'isView': obj.isView,
            'isUpdated': obj.isUpdated,
            'isDeleted': obj.isDeleted,
        }
        savemenuList.push(customObj)
        if (obj.childrenData.length > 0) {
            obj.childrenData.forEach(obj1 => {
                var customObj1 = {
                    'menuId': obj1.menuId,
                    'isCreated': obj1.isCreated,
                    'isView': obj1.isView,
                    'isUpdated': obj1.isUpdated,
                    'isDeleted': obj1.isDeleted,
                }
                savemenuList.push(customObj1)
            });
        }


    });
    let rolewisemenuModelObj = {
        "roleId": this.selectedRole,
        "rolewisemenu": savemenuList
    };

    this.adminLayoutService.SaverolewiseMenu(rolewisemenuModelObj).subscribe((Response: any) => {

        if (Response.meta.code == 200) {
            this.submittedMenuData = false;
            this.selectedRole = null;
            this.onRoleChange();
            this.commonService.notifier.notify('success', Response.meta.message);
        }
        else {
            this.commonService.notifier.notify('error', Response.meta.message);
        }
    }, (error) => {
        console.log(error);
    });
  }
}
