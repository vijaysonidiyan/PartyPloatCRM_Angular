import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { AdminLayoutService } from "app/layouts/admin-layout/admin-layout.service";
import { CommonService } from "app/shared/common.service";
declare const $: any;
@Component({
    selector: 'app-reference-master',
    templateUrl: './reference-master.component.html',
    styleUrls: ['./reference-master.component.css']
})
export class ReferenceMasterComponent implements OnInit {
    referencemasterForm: FormGroup;
    noData;
    ISeditReferenceMaster = false;
    l: number;
    p: number = 1;
    referencemasterList: any[] | any;
    allreferencemaster: any[] | any;
    referenceMasterList: any[] | any;
    referencemasterListlength: any;
    get fReferencenameData() { return this.referencemasterForm.controls; }
    submittedreferenceMasterData = false;
    isView: boolean;
    isCreated: boolean;
    isUpdated: boolean;
    isDeleted: boolean;

    constructor(public adminLayoutService: AdminLayoutService, private fb: FormBuilder, public commonService: CommonService, private router: Router) {
        let pagePermission = { module: "referenceMaster" }
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
        this.ISeditReferenceMaster = false;
        this.getReferencemasterList();
        this.defaultForm();
    }

    defaultForm() {
        this.referencemasterForm = this.fb.group({
            _id: [''],
            referenceName: ['', [Validators.required]],
        });
    }

    addReference() {
        $("#add-reference-modal").modal("show");
        this.ISeditReferenceMaster = false;
    }

    cancelReferencemaster() {
        $("#add-reference-modal").modal("hide");
        this.defaultForm();
        this.ISeditReferenceMaster = false;
    }

    saveReferencemaster() {
        if (this.referencemasterForm.invalid) {
            this.submittedreferenceMasterData = true;
            return;
        }
        let referencemasterModelObj = {
            "referenceName": this.referencemasterForm.controls.referenceName.value,
        };

        this.adminLayoutService.SavereferenceMaster(referencemasterModelObj).subscribe((Response: any) => {
            if (Response.meta.code == 200) {
                this.submittedreferenceMasterData = false;
                this.getReferencemasterList();
                this.defaultForm();
                this.ISeditReferenceMaster = false;
                this.commonService.notifier.notify('success', "Reference Details Saved Successfully.");
                $("#add-reference-modal").modal("hide");
            }
            else {
                this.commonService.notifier.notify('error', Response.meta.message);
            }
        }, (error) => {
            console.log(error);
        });
    }

    editReferencemaster(paramsObj) {
        this.ISeditReferenceMaster = true;
        let Id: any = { '_id': paramsObj.id }
        this.adminLayoutService.getreferenceMasterId(Id).subscribe((Response: any) => {
            this.referencemasterForm.controls._id.setValue(Response.data._id)
            this.referencemasterForm.controls.referenceName.setValue(Response.data.referenceName)
            $("#add-reference-modal").modal("show");
        }, (error) => {
        });
    }

    updateReferencemaster() {
        if (this.referencemasterForm.invalid) {
            this.submittedreferenceMasterData = true;
            return;
        }
        let referencemasterModelObj = {
            "_id": this.referencemasterForm.controls._id.value,
            "referenceName": this.referencemasterForm.controls.referenceName.value,
        };

        this.adminLayoutService.UpdatereferenceMaster(referencemasterModelObj).subscribe((Response: any) => {

            if (Response.meta.code == 200) {
                this.submittedreferenceMasterData = false;
                this.getReferencemasterList();
                this.defaultForm();
                this.ISeditReferenceMaster = false;
                this.commonService.notifier.notify('success', "Reference Details Updated Successfully.");
                $("#add-reference-modal").modal("hide");
            }
            else {
                this.commonService.notifier.notify('error', Response.meta.message);
            }
        }, (error) => {
            console.log(error);
        });
    }

    statusReferencemaster(paramsObj) {

        let statusreferencemasterModelObj = {
            "_id": paramsObj.id,
            "status": paramsObj.status
        };

        this.adminLayoutService.StatusreferenceMaster(statusreferencemasterModelObj).subscribe((Response: any) => {

            if (Response.meta.code == 200) {
                this.submittedreferenceMasterData = false;
                this.getReferencemasterList();
                this.defaultForm();
                this.ISeditReferenceMaster = false;
                if (paramsObj.status == 1) {
                    this.commonService.notifier.notify('success', "Reference Details Actived Successfully.");
                }
                else {
                    this.commonService.notifier.notify('success', "Reference Details Deactived Successfully.");
                }
            }
            else {
                this.commonService.notifier.notify('error', Response.meta.message);
            }
        }, (error) => {
            console.log(error);
        });
    }

    getReferencemasterList() {
        this.adminLayoutService.getreferenceMaster().subscribe((Response: any) => {

            if (Response.meta.code == 200) {
                this.referenceMasterList = Response.data;
                this.referencemasterList = this.referenceMasterList
                this.allreferencemaster = this.referencemasterList
                this.referencemasterList = this.referenceMasterList.slice();
                this.referencemasterListlength = Response.data.length;
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
        this.referencemasterList = this.allreferencemaster.filter((val: any) => val.referenceName.toLowerCase().includes(value.toLowerCase()));
        this.p = 1;
        if (this.referencemasterList.length == 0) {

            this.noData = true;
        } else {
            this.noData = false;
        }
    }
}

