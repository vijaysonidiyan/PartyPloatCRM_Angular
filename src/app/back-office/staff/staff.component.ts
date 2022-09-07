import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AdminLayoutService } from "app/layouts/admin-layout/admin-layout.service";
import { CommonService } from "app/shared/common.service";
declare const $: any;
@Component({
  selector: "app-staff",
  templateUrl: "./staff.component.html",
  styleUrls: ["./staff.component.css"],
})
export class StaffComponent implements OnInit {
  partyplotList: any;
  activeroleList: any;
  staffForm: FormGroup;
  ISeditStaff = false;
  staffList: any[];
  allstaffList: any[];
  StaffList: any[];
  l: number;
  p: number = 1;
  itemsPage: any;
  staffIndex: number;
  staffListlength: any;
  noData;
  filedocument: any;
  imgURLlogo: any;
  userFile: any[] = [];
  attactDocument: any = {};

  @ViewChild('filedocument') fileDocument: ElementRef;

  get fnameData() {
    return this.staffForm.controls;
  }
  submittedStaffData = false;
  partyplotInvalid = false;
  roleInvalid = false;

  constructor(
    public commonService: CommonService,
    public adminLayoutService: AdminLayoutService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.noData = false;
    this.l = 10;
    this.ISeditStaff = false;
    this.getStaffList();
    this.getpartyplotActiveList();
    this.getRoleActiveList();
    this.defaultForm();
  }
  removeURLlogo(params) {
    if (params.index !== undefined && !!params.action) {
      if (params.action === 'newDocument') {
        this.userFile.splice(params.index, 1);
      } else if (
        params.action === 'oldDocument' &&
        !!this.attactDocument &&
        !!this.attactDocument.oldUploadedDocuments &&
        !!this.attactDocument.oldUploadedDocuments[params.index]
      ) {
        if (this.attactDocument.deletedDocuments === undefined) {
          this.attactDocument.deletedDocuments = [];
        }
        this.attactDocument.deletedDocuments.push(
          this.attactDocument.oldUploadedDocuments[params.index].id
        );
        this.attactDocument.oldUploadedDocuments.splice(params.index, 1);
      }
    }
  }
  onDocumentChange(event) {
    debugger
    // this.userFile = event.target.files;
    // this.filedocument = this.userFile.name;
    // if (event.target.files && event.target.files[0]) {
    //   const reader = new FileReader();
    //   reader.onload = (e: any) => {
    //     this.imgURLlogo = e.target.result;
    //   };
    //   reader.readAsDataURL(event.target.files[0]);
    // }
    // this.fileDocument.nativeElement.value = "";

    var selectedFiles = event.target.files;
    for (var i = 0; i < selectedFiles.length; i++) {
      this.userFile.push(selectedFiles[i]);
      // this.resultName.push(selectedFiles[i].name);
    }
    event.target.value = '';
  }
  defaultForm() {
    this.staffForm = this.fb.group({
      _id: ["0"],
      name: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      contact: ["", [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      roleId: [null],
      reference: [""],
      aadharcardNo: [""],
      partyplotData: [""],
      roleName: [""],
      isLogin: false
    });
  }

  addMenu() {
    $("#add-menu-modal").modal("show");
    this.ISeditStaff = false;
  }

  cancelMenu() {
    $("#add-menu-modal").modal("hide");
    this.defaultForm();
    this.ISeditStaff = false;
  }

  isloginOnchange(paramsObj) {
    let checked = paramsObj.checked;
    if (checked == true) {
      this.staffForm.controls.isLogin.setValue(true)
    } else {
      this.staffForm.controls.isLogin.setValue(false)
    }
  }

  getStaffList() {
    this.adminLayoutService.getStaff().subscribe(
      (Response: any) => {
        if (Response.meta.code == 200) {
          this.StaffList = Response.data;
          this.staffList = this.StaffList;
          this.allstaffList = this.staffList;
          this.staffList = this.StaffList.slice();
          this.staffListlength = Response.data.length;
          this.noData = false;
        } else {
          this.noData = true;
        }

        //for select sub industry step
      },
      (error) => {
        console.log(error.error.Message);
      }
    );
  }

  getpartyplotActiveList() {
    this.adminLayoutService.getPartyplotActiveList().subscribe(
      (Response: any) => {
        if (Response.meta.code == 200) {
          this.partyplotList = Response.data;
        } else {
        }
        //for select sub industry step
      },
      (error) => {
        console.log(error.error.Message);
      }
    );
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

  savestaff() {
    if (this.staffForm.value.partyplotData.length === 0) {
      this.partyplotInvalid = true;
    } else {
      this.partyplotInvalid = false;
    }

    if (this.staffForm.value.roleId === null) {
      this.roleInvalid = true;
    } else {
      this.roleInvalid = false;
    }

    if (this.staffForm.invalid || this.partyplotInvalid === true || this.roleInvalid === true) {
      this.submittedStaffData = true;
      return;
    }

    let staffModelObj = {
      name: this.staffForm.controls.name.value,
      email: this.staffForm.controls.email.value,
      contact: this.staffForm.controls.contact.value,
      roleId: this.staffForm.controls.roleId.value,
      reference: this.staffForm.controls.reference.value,
      aadharcardNo: this.staffForm.controls.aadharcardNo.value,
      assignPartyPlot: this.staffForm.controls.partyplotData.value,
      isLogin: this.staffForm.controls.isLogin.value,
    };

    this.adminLayoutService.saveStaff(staffModelObj).subscribe(
      (Response: any) => {
        if (Response.meta.code == 200) {
          this.submittedStaffData = false;
          this.getStaffList();
          this.defaultForm();
          this.ISeditStaff = false;
          this.commonService.notifier.notify("success", Response.meta.message);
          $("#add-menu-modal").modal("hide");
        } else {
          this.commonService.notifier.notify("error", Response.meta.message);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  editStaff(paramsObj) {
    this.ISeditStaff = true;
    let Id: any = { staffId: paramsObj.id };
    this.adminLayoutService.getstaffId(Id).subscribe(
      (Response: any) => {
        this.staffForm.controls._id.setValue(Response.data._id);
        this.staffForm.controls.name.setValue(Response.data.name);
        this.staffForm.controls.email.setValue(Response.data.email);
        this.staffForm.controls.contact.setValue(Response.data.contact);
        this.staffForm.controls.roleId.setValue(Response.data.roleId);
        this.staffForm.controls.reference.setValue(Response.data.reference);
        this.staffForm.controls.aadharcardNo.setValue(Response.data.aadharcardNo);
        this.staffForm.controls.partyplotData.setValue(Response.data.partyplotData);
        this.staffForm.controls.isLogin.setValue(Response.data.isLogin);
        $("#add-menu-modal").modal("show");
      },
      (error) => { }
    );
  }

  updatestaff() {

    if (this.staffForm.value.partyplotData.length === 0) {
      this.partyplotInvalid = true;
    } else {
      this.partyplotInvalid = false;
    }

    if (this.staffForm.value.roleId === null) {
      this.roleInvalid = true;
    } else {
      this.roleInvalid = false;
    }

    if (this.staffForm.invalid || this.partyplotInvalid === true || this.roleInvalid === true) {
      this.submittedStaffData = true;
      return;
    }

    let staffModelObj = {
      _id: this.staffForm.controls._id.value,
      name: this.staffForm.controls.name.value,
      email: this.staffForm.controls.email.value,
      contact: this.staffForm.controls.contact.value,
      roleId: this.staffForm.controls.roleId.value,
      reference: this.staffForm.controls.reference.value,
      aadharcardNo: this.staffForm.controls.aadharcardNo.value,
      assignPartyPlot: this.staffForm.controls.partyplotData.value,
      isLogin: this.staffForm.controls.isLogin.value,
    };

    this.adminLayoutService.updateStaff(staffModelObj).subscribe(
      (Response: any) => {
        if (Response.meta.code == 200) {
          this.submittedStaffData = false;
          this.getStaffList();
          this.defaultForm();
          this.ISeditStaff = false;
          this.commonService.notifier.notify("success", Response.meta.message);
          $("#add-menu-modal").modal("hide");
        } else {
          this.commonService.notifier.notify("error", Response.meta.message);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  statusRolemaster(paramsObj) {
    debugger
    let statusrolemasterModelObj = {
      "_id": paramsObj.id,
      "status": paramsObj.status
    };

    this.adminLayoutService.StatusStaff(statusrolemasterModelObj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.submittedStaffData = false;
        this.getStaffList();
        this.defaultForm();
        this.ISeditStaff = false;
        this.commonService.notifier.notify('success', Response.meta.message);
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    }, (error) => {
      console.log(error);
    });
  }

  search(value: string): void {
    this.staffList = this.allstaffList.filter((val: any) => JSON.stringify(val).toLowerCase().includes(value.toLowerCase()));
    this.p = 1;
    if (this.staffList.length == 0) {
      debugger
      this.noData = true;
    } else {
      this.noData = false;
    }
  }
}
