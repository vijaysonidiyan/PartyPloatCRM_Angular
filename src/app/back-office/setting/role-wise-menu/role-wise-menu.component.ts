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
    constructor(public adminLayoutService: AdminLayoutService, private fb: FormBuilder, public commonService: CommonService, public storageService: StorageService) { }

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
            isSelectedMainData: [(oItem['isSelectedMainData'] ? oItem['isSelectedMainData'] : false),],
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
            isMainMenuSelected: [(cItem['isMainMenuSelected'] ? cItem['isMainMenuSelected'] : false),],
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
                Response.data.forEach((oItem, index) => {
                    this.addMenuItem(oItem);
                    if (oItem.isCreated == true && oItem.isUpdated == true && oItem.isView == true && oItem.isDeleted == true) {
                        (((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[index] as FormGroup).get('isSelectedMainData').setValue(true));
                        oItem.childrenData.forEach((xItem, dindex) => {
                            if (xItem.isCreated == true && xItem.isUpdated == true && xItem.isView == true && xItem.isDeleted == true) {
                                ((((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[index] as FormGroup).controls['childrenData'] as FormArray).controls[dindex] as FormGroup).get('isMainMenuSelected').setValue(true);
                            }
                            else {
                                (((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[index] as FormGroup).get('isSelectedMainData').setValue(false));
                                ((((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[index] as FormGroup).controls['childrenData'] as FormArray).controls[dindex] as FormGroup).get('isMainMenuSelected').setValue(false);
                            }
                        })
                    }
                    else {
                        (((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[index] as FormGroup).get('isSelectedMainData').setValue(false));
                    }

                });

            } else {
            }
            //for select sub industry step
        }, (error) => {
            console.log(error.error.Message);
        });
    }

    getRoleActiveList() {
        this.adminLayoutService.getRoleActiveList().subscribe(
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

    isSelectedAllData(paramsObj: any) {

        let menuListDataFormGroup = ((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[paramsObj.index] as FormGroup)

        if (paramsObj.checked === true) {
            (menuListDataFormGroup.get('isCreated').setValue(true));
            (menuListDataFormGroup.get('isView').setValue(true));
            (menuListDataFormGroup.get('isUpdated').setValue(true));
            (menuListDataFormGroup.get('isDeleted').setValue(true));
            (menuListDataFormGroup.controls['childrenData'] as FormArray).controls.map(value => value.get('isMainMenuSelected').setValue(true));
            this.isCreatedAllchildrenData({ checked: true, index: paramsObj.index });
            this.isViewAllchildrenData({ checked: true, index: paramsObj.index });
            this.isUpdatedchildrenData({ checked: true, index: paramsObj.index });
            this.isDeletedchildrenData({ checked: true, index: paramsObj.index });
            (menuListDataFormGroup.get('isSelectedMainData').setValue(true));
        }
        else {
            (menuListDataFormGroup.get('isCreated').setValue(false));
            (menuListDataFormGroup.get('isView').setValue(false));
            (menuListDataFormGroup.get('isUpdated').setValue(false));
            (menuListDataFormGroup.get('isDeleted').setValue(false));
            (menuListDataFormGroup.get('isSelectedMainData').setValue(false));
            (menuListDataFormGroup.controls['childrenData'] as FormArray).controls.map(value => value.get('isMainMenuSelected').setValue(false));
            this.isCreatedAllchildrenData({ checked: false, index: paramsObj.index });
            this.isViewAllchildrenData({ checked: false, index: paramsObj.index });
            this.isUpdatedchildrenData({ checked: false, index: paramsObj.index });
            this.isDeletedchildrenData({ checked: false, index: paramsObj.index });
        }
    }
    isSelectedMainChildrenData(paramsObj) {
        let menuIndex = paramsObj.menuIndex;
        let index = paramsObj.index;

        let childrenDataFormArrayFormGroup = ((((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup).controls['childrenData'] as FormArray).controls[index] as FormGroup);

        if (paramsObj.checked === true) {
            childrenDataFormArrayFormGroup.get('isCreated').setValue(true);
            childrenDataFormArrayFormGroup.get('isUpdated').setValue(true);
            childrenDataFormArrayFormGroup.get('isView').setValue(true);
            childrenDataFormArrayFormGroup.get('isDeleted').setValue(true);
        }
        else {
            childrenDataFormArrayFormGroup.get('isCreated').setValue(false);
            childrenDataFormArrayFormGroup.get('isUpdated').setValue(false);
            childrenDataFormArrayFormGroup.get('isView').setValue(false);
            childrenDataFormArrayFormGroup.get('isDeleted').setValue(false);
        }

        let menuListDataFormGroup = ((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup);

        (((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup).get('isSelectedMainData').setValue(true));
        ((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup).get('isCreated').setValue(false);
        ((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup).get('isView').setValue(false);
        ((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup).get('isDeleted').setValue(false);
        ((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup).get('isUpdated').setValue(false);
        (menuListDataFormGroup.controls['childrenData'] as FormArray).controls.map((value) => {

            if (value.get('isCreated').value === true) {
                ((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup).get('isCreated').setValue(true);
            }
            if (value.get('isView').value === true) {
                ((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup).get('isView').setValue(true);
            }
            if (value.get('isDeleted').value === true) {
                ((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup).get('isDeleted').setValue(true);
            }
            if (value.get('isUpdated').value === true) {
                ((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup).get('isUpdated').setValue(true);
            }

            let isCreated = ((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup).get('isCreated').value;
            let isView = ((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup).get('isView').value;
            let isDeleted = ((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup).get('isDeleted').value;
            let isUpdated = ((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup).get('isUpdated').value;

            if (value.get('isMainMenuSelected').value === false || isCreated == false || isView === false || isDeleted == false || isUpdated == false) {
                (((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup).get('isSelectedMainData').setValue(false));
            }


        });
    }

    isCreatedAllchildrenData(paramsObj) {

        let menuIndex = paramsObj.index
        let checked = paramsObj.checked

        let menuListFormGroup = ((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[paramsObj.index] as FormGroup);
        if (checked == true) {

            (((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup).controls['childrenData'] as FormArray).controls.map(value => {
                value.get('isCreated').setValue(true);
                if (value.get('isCreated').value === true && value.get('isUpdated').value === true && value.get('isView').value === true && value.get('isDeleted').value === true) {
                    value.get('isMainMenuSelected').setValue(true);
                }
            });

            if ((menuListFormGroup.get('isView').value === true) && (menuListFormGroup.get('isUpdated').value === true) && (menuListFormGroup.get('isDeleted').value === true)) {
                // (((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup).get('isSelectedMainData').setValue(true));

                let menuListDataFormGroup = ((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup);

                (((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup).get('isSelectedMainData').setValue(true));
                (menuListDataFormGroup.controls['childrenData'] as FormArray).controls.map((value) => {

                    if (value.get('isMainMenuSelected').value === false || value.get('isCreated').value == false || value.get('isView').value === false || value.get('isDeleted').value == false || value.get('isUpdated').value == false) {
                        (menuListDataFormGroup.get('isSelectedMainData').setValue(false));
                    }
                });
            }


        } else {
            (((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup).controls['childrenData'] as FormArray).controls.map(value => {
                value.get('isCreated').setValue(false);
                if (value.get('isCreated').value === false || value.get('isUpdated').value === false || value.get('isView').value === false || value.get('isDeleted').value === false) {
                    value.get('isMainMenuSelected').setValue(false);
                }
            });

            (((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup).get('isSelectedMainData').setValue(false));
        }

    }

    isViewAllchildrenData(paramsObj) {

        let menuIndex = paramsObj.index
        let checked = paramsObj.checked

        let menuListFormGroup = ((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[paramsObj.index] as FormGroup);
        if (checked == true) {

            (((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup).controls['childrenData'] as FormArray).controls.map(value => {
                value.get('isView').setValue(true);
                if (value.get('isCreated').value === true && value.get('isUpdated').value === true && value.get('isView').value === true && value.get('isDeleted').value === true) {
                    value.get('isMainMenuSelected').setValue(true);
                }
            }
            );

            if ((menuListFormGroup.get('isView').value === true) && (menuListFormGroup.get('isUpdated').value === true) && (menuListFormGroup.get('isDeleted').value === true)) {
                // (((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup).get('isSelectedMainData').setValue(true));

                let menuListDataFormGroup = ((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup);

                (((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup).get('isSelectedMainData').setValue(true));
                (menuListDataFormGroup.controls['childrenData'] as FormArray).controls.map((value) => {

                    if (value.get('isMainMenuSelected').value === false || value.get('isCreated').value == false || value.get('isView').value === false || value.get('isDeleted').value == false || value.get('isUpdated').value == false) {
                        (menuListDataFormGroup.get('isSelectedMainData').setValue(false));
                    }
                });
            }


        } else {
            (((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup).controls['childrenData'] as FormArray).controls.map(value => {
                value.get('isView').setValue(false);
                if (value.get('isCreated').value === false || value.get('isUpdated').value === false || value.get('isView').value === false || value.get('isDeleted').value === false) {
                    value.get('isMainMenuSelected').setValue(false);
                }
            }
            );

            (((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup).get('isSelectedMainData').setValue(false));
        }

    }

    isUpdatedchildrenData(paramsObj) {

        let menuIndex = paramsObj.index
        let checked = paramsObj.checked

        let menuListFormGroup = ((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[paramsObj.index] as FormGroup);
        if (checked == true) {

            (((this.rolewisemenuForm.controls['menuList'] as FormArray)
                .controls[menuIndex] as FormGroup).controls['childrenData'] as FormArray).controls.map(value => {
                    value.get('isUpdated').setValue(true);
                    if (value.get('isCreated').value === true && value.get('isUpdated').value === true && value.get('isView').value === true && value.get('isDeleted').value === true) {
                        value.get('isMainMenuSelected').setValue(true);
                    }
                });

            if ((menuListFormGroup.get('isView').value === true) && (menuListFormGroup.get('isUpdated').value === true) && (menuListFormGroup.get('isDeleted').value === true)) {
                // (((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup).get('isSelectedMainData').setValue(true));

                let menuListDataFormGroup = ((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup);

                (((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup).get('isSelectedMainData').setValue(true));
                (menuListDataFormGroup.controls['childrenData'] as FormArray).controls.map((value) => {

                    if (value.get('isMainMenuSelected').value === false || value.get('isCreated').value == false || value.get('isView').value === false || value.get('isDeleted').value == false || value.get('isUpdated').value == false) {
                        (menuListDataFormGroup.get('isSelectedMainData').setValue(false));
                    }
                });
            }



        } else {
            (((this.rolewisemenuForm.controls['menuList'] as FormArray)
                .controls[menuIndex] as FormGroup).controls['childrenData'] as FormArray).controls.map(value => {
                    value.get('isUpdated').setValue(false);
                    if (value.get('isCreated').value === false || value.get('isUpdated').value === false || value.get('isView').value === false || value.get('isDeleted').value === false) {
                        value.get('isMainMenuSelected').setValue(false);
                    }
                }
                );

            (((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup).get('isSelectedMainData').setValue(false));
        }

    }

    isDeletedchildrenData(paramsObj) {

        let menuIndex = paramsObj.index
        let checked = paramsObj.checked

        let menuListFormGroup = ((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[paramsObj.index] as FormGroup);
        if (checked == true) {

            (((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup).controls['childrenData'] as FormArray).controls.map(value => {
                value.get('isDeleted').setValue(true);
                if (value.get('isCreated').value === true && value.get('isUpdated').value === true && value.get('isView').value === true && value.get('isDeleted').value === true) {
                    value.get('isMainMenuSelected').setValue(true);
                }
            }
            );

            if ((menuListFormGroup.get('isView').value === true) && (menuListFormGroup.get('isUpdated').value === true) && (menuListFormGroup.get('isDeleted').value === true)) {
                // (((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup).get('isSelectedMainData').setValue(true));

                let menuListDataFormGroup = ((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup);

                (((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup).get('isSelectedMainData').setValue(true));
                (menuListDataFormGroup.controls['childrenData'] as FormArray).controls.map((value) => {

                    if (value.get('isMainMenuSelected').value === false || value.get('isCreated').value == false || value.get('isView').value === false || value.get('isDeleted').value == false || value.get('isUpdated').value == false) {
                        (menuListDataFormGroup.get('isSelectedMainData').setValue(false));
                    }
                });
            }



        } else {
            (((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup).controls['childrenData'] as FormArray).controls.map(value => {
                value.get('isDeleted').setValue(false);
                if (value.get('isCreated').value === false || value.get('isUpdated').value === false || value.get('isView').value === false || value.get('isDeleted').value === false) {
                    value.get('isMainMenuSelected').setValue(false);
                }
            }
            );

            (((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup).get('isSelectedMainData').setValue(false));
        }

    }

    isCreatedmenuData(paramsObj) {

        let menuIndex = paramsObj.menuIndex;
        let menuListFormArray = (this.rolewisemenuForm.controls['menuList'] as FormArray);
        let childrenDataFormArray = ((menuListFormArray.controls[menuIndex] as FormGroup).controls['childrenData'] as FormArray);
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

        if ((childrenDataFormArray.controls[paramsObj.index] as FormGroup).get('isCreated').value == true && (childrenDataFormArray.controls[paramsObj.index] as FormGroup).get('isView').value == true && (childrenDataFormArray.controls[paramsObj.index] as FormGroup).get('isUpdated').value == true && (childrenDataFormArray.controls[paramsObj.index] as FormGroup).get('isDeleted').value == true) {
            // ((menuListFormArray.controls[menuIndex] as FormGroup).get('isSelectedMainData').setValue(true));
            (childrenDataFormArray.controls[paramsObj.index] as FormGroup).get('isMainMenuSelected').setValue(true);
        }
        else {
            // ((menuListFormArray.controls[menuIndex] as FormGroup).get('isSelectedMainData').setValue(false));
            (childrenDataFormArray.controls[paramsObj.index] as FormGroup).get('isMainMenuSelected').setValue(false);
        }

        let menuListDataFormGroup = ((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup);

        (((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup).get('isSelectedMainData').setValue(true));
        (menuListDataFormGroup.controls['childrenData'] as FormArray).controls.map((value) => {

            if (value.get('isMainMenuSelected').value === false || value.get('isCreated').value == false || value.get('isView').value === false || value.get('isDeleted').value == false || value.get('isUpdated').value == false) {
                (menuListDataFormGroup.get('isSelectedMainData').setValue(false));
            }
        });

    }

    isViewmenuData(paramsObj) {

        let menuIndex = paramsObj.menuIndex;
        let menuListFormArray = (this.rolewisemenuForm.controls['menuList'] as FormArray);
        let childrenDataFormArray = ((menuListFormArray.controls[menuIndex] as FormGroup).controls['childrenData'] as FormArray);
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

        if ((childrenDataFormArray.controls[paramsObj.index] as FormGroup).get('isCreated').value == true && (childrenDataFormArray.controls[paramsObj.index] as FormGroup).get('isView').value == true && (childrenDataFormArray.controls[paramsObj.index] as FormGroup).get('isUpdated').value == true && (childrenDataFormArray.controls[paramsObj.index] as FormGroup).get('isDeleted').value == true) {
            // ((menuListFormArray.controls[menuIndex] as FormGroup).get('isSelectedMainData').setValue(true));
            (childrenDataFormArray.controls[paramsObj.index] as FormGroup).get('isMainMenuSelected').setValue(true);
        }
        else {
            // ((menuListFormArray.controls[menuIndex] as FormGroup).get('isSelectedMainData').setValue(false));
            (childrenDataFormArray.controls[paramsObj.index] as FormGroup).get('isMainMenuSelected').setValue(false);
        }

        let menuListDataFormGroup = ((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup);

        (((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup).get('isSelectedMainData').setValue(true));
        (menuListDataFormGroup.controls['childrenData'] as FormArray).controls.map((value) => {

            if (value.get('isMainMenuSelected').value === false || value.get('isCreated').value == false || value.get('isView').value === false || value.get('isDeleted').value == false || value.get('isUpdated').value == false) {
                (menuListDataFormGroup.get('isSelectedMainData').setValue(false));
            }
        });

    }

    isUpdatedmenuData(paramsObj) {

        let menuIndex = paramsObj.menuIndex;
        let menuListFormArray = (this.rolewisemenuForm.controls['menuList'] as FormArray);
        let childrenDataFormArray = ((menuListFormArray.controls[menuIndex] as FormGroup).controls['childrenData'] as FormArray);
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

        if ((childrenDataFormArray.controls[paramsObj.index] as FormGroup).get('isCreated').value == true && (childrenDataFormArray.controls[paramsObj.index] as FormGroup).get('isView').value == true && (childrenDataFormArray.controls[paramsObj.index] as FormGroup).get('isUpdated').value == true && (childrenDataFormArray.controls[paramsObj.index] as FormGroup).get('isDeleted').value == true) {
            // ((menuListFormArray.controls[menuIndex] as FormGroup).get('isSelectedMainData').setValue(true));
            (childrenDataFormArray.controls[paramsObj.index] as FormGroup).get('isMainMenuSelected').setValue(true);
        }
        else {
            // ((menuListFormArray.controls[menuIndex] as FormGroup).get('isSelectedMainData').setValue(false));
            (childrenDataFormArray.controls[paramsObj.index] as FormGroup).get('isMainMenuSelected').setValue(false);
        }

        let menuListDataFormGroup = ((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup);

        (((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup).get('isSelectedMainData').setValue(true));
        (menuListDataFormGroup.controls['childrenData'] as FormArray).controls.map((value) => {

            if (value.get('isMainMenuSelected').value === false || value.get('isCreated').value == false || value.get('isView').value === false || value.get('isDeleted').value == false || value.get('isUpdated').value == false) {
                (menuListDataFormGroup.get('isSelectedMainData').setValue(false));
            }
        });

    }

    isDeletedmenuData(paramsObj) {


        let menuIndex = paramsObj.menuIndex;
        let menuListFormArray = (this.rolewisemenuForm.controls['menuList'] as FormArray);
        let childrenDataFormArray = ((menuListFormArray.controls[menuIndex] as FormGroup).controls['childrenData'] as FormArray);


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

        if ((childrenDataFormArray.controls[paramsObj.index] as FormGroup).get('isCreated').value == true && (childrenDataFormArray.controls[paramsObj.index] as FormGroup).get('isView').value == true && (childrenDataFormArray.controls[paramsObj.index] as FormGroup).get('isUpdated').value == true && (childrenDataFormArray.controls[paramsObj.index] as FormGroup).get('isDeleted').value == true) {
            // ((menuListFormArray.controls[menuIndex] as FormGroup).get('isSelectedMainData').setValue(true));
            (childrenDataFormArray.controls[paramsObj.index] as FormGroup).get('isMainMenuSelected').setValue(true);
        }
        else {
            // ((menuListFormArray.controls[menuIndex] as FormGroup).get('isSelectedMainData').setValue(false));
            (childrenDataFormArray.controls[paramsObj.index] as FormGroup).get('isMainMenuSelected').setValue(false);
        }

        let menuListDataFormGroup = ((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup);

        (((this.rolewisemenuForm.controls['menuList'] as FormArray).controls[menuIndex] as FormGroup).get('isSelectedMainData').setValue(true));
        (menuListDataFormGroup.controls['childrenData'] as FormArray).controls.map((value) => {

            if (value.get('isMainMenuSelected').value === false || value.get('isCreated').value == false || value.get('isView').value === false || value.get('isDeleted').value == false || value.get('isUpdated').value == false) {
                (menuListDataFormGroup.get('isSelectedMainData').setValue(false));
            }
        });





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
                this.commonService.notifier.notify('success', "Role Wise Menu Updated Successfully.");
            }
            else {
                this.commonService.notifier.notify('error', Response.meta.message);
            }
        }, (error) => {
            console.log(error);
        });
    }
}
