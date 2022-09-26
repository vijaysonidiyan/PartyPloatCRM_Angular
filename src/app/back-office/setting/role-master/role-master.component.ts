import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AdminLayoutService } from "app/layouts/admin-layout/admin-layout.service";
import { CommonService } from "app/shared/common.service";
declare const $: any;
@Component({
    selector: "app-role-master",
    templateUrl: "./role-master.component.html",
    styleUrls: ["./role-master.component.css"],
})

export class RoleMasterComponent implements OnInit {

    rolemasterForm: FormGroup;
    noData;
    ISeditRoleMaster = false;
    l: number;
    p: number = 1;
    rolemasterList: any[] | any;
    allrolemaster: any[] | any;
    roleMasterList: any[] | any;
    rolemasterListlength: any;
    get fRolenameData() { return this.rolemasterForm.controls; }
    submittedroleMasterData = false;

    constructor(public adminLayoutService: AdminLayoutService, private fb: FormBuilder, public commonService: CommonService) { }

    ngOnInit(): void {
        this.noData = false;
        this.l = 10;
        this.ISeditRoleMaster = false;
        this.getRolemasterList();
        this.defaultForm();
    }

    defaultForm() {
        this.rolemasterForm = this.fb.group({
            _id: [''],
            roleName: ['', [Validators.required, Validators.pattern('([a-z]|[A-Z])*')]],
        });
    }

    addRole() {
        $("#add-role-modal").modal("show");
        this.ISeditRoleMaster = false;
    }

    cancelRolemaster() {
        $("#add-role-modal").modal("hide");
        this.defaultForm();
        this.ISeditRoleMaster = false;
    }

    saveRolemaster() {
        if (this.rolemasterForm.invalid) {
            this.submittedroleMasterData = true;
            return;
        }
        let rolemasterModelObj = {
            "roleName": this.rolemasterForm.controls.roleName.value,
        };

        this.adminLayoutService.SaveroleMaster(rolemasterModelObj).subscribe((Response: any) => {
            if (Response.meta.code == 200) {
                this.submittedroleMasterData = false;
                this.getRolemasterList();
                this.defaultForm();
                this.ISeditRoleMaster = false;
                this.commonService.notifier.notify('success', "Role Details Saved Successfully.");
                $("#add-role-modal").modal("hide");
            }
            else {
                this.commonService.notifier.notify('error', Response.meta.message);
            }
        }, (error) => {
            console.log(error);
        });
    }

    editRolemaster(paramsObj) {
        this.ISeditRoleMaster = true;
        let Id: any = { '_id': paramsObj.id }
        this.adminLayoutService.getroleMasterId(Id).subscribe((Response: any) => {
            this.rolemasterForm.controls._id.setValue(Response.data._id)
            this.rolemasterForm.controls.roleName.setValue(Response.data.roleName)
            $("#add-role-modal").modal("show");
        }, (error) => {
        });
    }

    updateRolemaster() {
        if (this.rolemasterForm.invalid) {
            this.submittedroleMasterData = true;
            return;
        }
        let rolemasterModelObj = {
            "_id": this.rolemasterForm.controls._id.value,
            "roleName": this.rolemasterForm.controls.roleName.value,
        };

        this.adminLayoutService.UpdateroleMaster(rolemasterModelObj).subscribe((Response: any) => {

            if (Response.meta.code == 200) {
                this.submittedroleMasterData = false;
                this.getRolemasterList();
                this.defaultForm();
                this.ISeditRoleMaster = false;
                this.commonService.notifier.notify('success', "Role Details Updated Successfully.");
                $("#add-role-modal").modal("hide");
            }
            else {
                this.commonService.notifier.notify('error', Response.meta.message);
            }
        }, (error) => {
            console.log(error);
        });
    }

    statusRolemaster(paramsObj) {
        debugger
        let statusrolemasterModelObj = {
            "_id": paramsObj.id,
            "status": paramsObj.status
        };

        this.adminLayoutService.StatusroleMaster(statusrolemasterModelObj).subscribe((Response: any) => {

            if (Response.meta.code == 200) {
                this.submittedroleMasterData = false;
                this.getRolemasterList();
                this.defaultForm();
                this.ISeditRoleMaster = false;
                if (paramsObj.status === 1) {
                    this.commonService.notifier.notify(
                        "success",
                        "Role Details Actived Successfully."
                    );
                }
                else {
                    this.commonService.notifier.notify(
                        "success",
                        "Role Details Deactived Successfully."
                    );
                }
            }
            else {
                this.commonService.notifier.notify('error', Response.meta.message);
            }
        }, (error) => {
            console.log(error);
        });
    }

    getRolemasterList() {
        this.adminLayoutService.getroleMaster().subscribe((Response: any) => {

            if (Response.meta.code == 200) {
                this.roleMasterList = Response.data;
                this.rolemasterList = this.roleMasterList
                this.allrolemaster = this.rolemasterList
                this.rolemasterList = this.roleMasterList.slice();
                this.rolemasterListlength = Response.data.length;
                this.noData = false;
            } else {
                this.noData = true;
            }
            //for select sub industry step
        }, (error) => {
            console.log(error.error.Message);
        });
    }
    search(value: string): void {
        this.rolemasterList = this.allrolemaster.filter((val: any) => JSON.stringify(val).toLowerCase().includes(value.toLowerCase()));
        this.p = 1;
        if (this.rolemasterList.length == 0) {
            debugger
            this.noData = true;
        } else {
            this.noData = false;
        }
    }
}
