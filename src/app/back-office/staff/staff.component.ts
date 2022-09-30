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
  ISviewStaff = false;
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
  userFile: any = null;
  attactDocument: any = {};

  @ViewChild('filedocument') fileDocument: ElementRef;
  StaffDocumentList: any;
  documentError: boolean = false;

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
    this.ISviewStaff = false;
    this.getStaffList();
    this.getpartyplotActiveList();
    this.getRoleActiveList();
    this.defaultForm();
  }
  removeDocument() {
    this.userFile = null;
  }

  onDocumentChange(event) {

    this.userFile = event.target.files[0];
    if (!!this.userFile) {
      this.documentError = false;
    }
    else {
      this.documentError = true
    }
    this.filedocument = this.userFile.name;
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imgURLlogo = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
    this.fileDocument.nativeElement.value = "";

    // this.userFile = event.target.files;
    // for (var i = 0; i < selectedFiles.length; i++) {
    //   this.userFile.push(selectedFiles[i]);
    //   // this.resultName.push(selectedFiles[i].name);
    // }
    // event.target.value = '';
  }
  defaultForm() {
    this.staffForm = this.fb.group({
      _id: ["0"],
      name: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      contact: ["", [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      roleId: [null, [Validators.required]],
      reference: [""],
      // aadharcardNo: [""],
      partyplotData: ["", [Validators.required]],
      roleName: [""],
      isLogin: false
    });
  }

  addStaff() {
    $("#add-staff-modal").modal("show");
    this.ISeditStaff = false;
    this.ISviewStaff = false;
    this.submittedStaffData = false;
  }

  cancelStaff() {
    $("#add-staff-modal").modal("hide");
    this.defaultForm();
    this.ISeditStaff = false;
    this.ISviewStaff = false;
    this.submittedStaffData = false;
    this.StaffDocumentList = [];
  }
  addDoc() {
    this.documentError = false;
    $("#add-staff-modal").modal("hide");
    $("#add-document-modal").modal("show");
  }

  cancelDoc() {
    this.documentError = false;
    $("#add-staff-modal").modal("show");
    $("#add-document-modal").modal("hide");
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
      });
  }
  savedoc() {
    if (this.userFile == null) {
      this.documentError = true;
      return
    }
    let staffDocumentModelObj: FormData = new FormData();

    staffDocumentModelObj.append('staffId', this.staffForm.value._id);
    staffDocumentModelObj.append('documents', this.userFile);

    this.adminLayoutService.saveDocumentbystaffId(staffDocumentModelObj).subscribe(
      (Response: any) => {
        if (Response.meta.code == 200) {
          this.userFile = null;
          this.getStaffDocument();
          this.commonService.notifier.notify("success", "Document Uploaded Successfully.");
          $("#add-staff-modal").modal("show");
          $("#add-document-modal").modal("hide");
        }
      },
      (error) => {
        console.log(error.error.Message);
      });
  }
  savestaff() {

    if (this.staffForm.invalid) {
      this.submittedStaffData = true;
      return;
    }

    let staffModelObj = {
      name: this.staffForm.controls.name.value,
      email: this.staffForm.controls.email.value,
      contact: this.staffForm.controls.contact.value,
      roleId: this.staffForm.controls.roleId.value,
      reference: this.staffForm.controls.reference.value,
      //aadharcardNo: this.staffForm.controls.aadharcardNo.value,
      assignPartyPlot: this.staffForm.controls.partyplotData.value,
      isLogin: this.staffForm.controls.isLogin.value,
    };

    this.adminLayoutService.saveStaff(staffModelObj).subscribe(
      (Response: any) => {
        if (Response.meta.code == 200) {
          this.submittedStaffData = false;
          this.getStaffList();
          this.defaultForm();
          this.StaffDocumentList = [];
          this.ISeditStaff = false;
          this.ISviewStaff = false;
          this.commonService.notifier.notify("success", "Staff Details Saved Successfully.");
          $("#add-staff-modal").modal("hide");
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
    if (paramsObj.action == 'edit') {
      this.ISeditStaff = true;
    } else if (paramsObj.action == 'view') {
      this.ISviewStaff = true;
    }
    let Id: any = { staffId: paramsObj.id };
    this.StaffDocumentList = [];
    this.adminLayoutService.getstaffId(Id).subscribe(
      (Response: any) => {
        this.staffForm.controls._id.setValue(Response.data._id);
        this.staffForm.controls.name.setValue(Response.data.name);
        this.staffForm.controls.email.setValue(Response.data.email);
        this.staffForm.controls.contact.setValue(Response.data.contact);
        this.staffForm.controls.roleId.setValue(Response.data.roleId);
        this.staffForm.controls.reference.setValue(Response.data.reference);
        //this.staffForm.controls.aadharcardNo.setValue(Response.data.aadharcardNo);
        this.staffForm.controls.partyplotData.setValue(Response.data.partyplotData);
        this.staffForm.controls.isLogin.setValue(Response.data.isLogin);
        this.StaffDocumentList = Response.data.Staff_documentData;
        $("#add-staff-modal").modal("show");
      },
      (error) => { }
    );
  }

  getStaffDocument() {
    let Id: any = { staffId: this.staffForm.controls._id.value };
    this.StaffDocumentList = [];
    this.adminLayoutService.getDocumentbyStaffId(Id).subscribe(
      (Response: any) => {
        this.StaffDocumentList = Response.data;
      },
      (error) => { }
    );
  }

  updatestaff() {

    if (this.staffForm.invalid) {
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
      //aadharcardNo: this.staffForm.controls.aadharcardNo.value,
      assignPartyPlot: this.staffForm.controls.partyplotData.value,
      isLogin: this.staffForm.controls.isLogin.value,
    };

    this.adminLayoutService.updateStaff(staffModelObj).subscribe(
      (Response: any) => {
        if (Response.meta.code == 200) {
          this.submittedStaffData = false;
          this.getStaffList();
          this.defaultForm();
          this.StaffDocumentList = [];
          this.ISeditStaff = false;
          this.ISviewStaff = false;
          this.commonService.notifier.notify("success", "Staff Details Updated Successfully.");
          $("#add-staff-modal").modal("hide");
        } else {
          this.commonService.notifier.notify("error", Response.meta.message);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  deletDocument(id: any) {
    let modelObj = {
      "_id": id,
    };

    this.adminLayoutService.staffDocumentDelete(modelObj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.submittedStaffData = false;
        this.getStaffDocument();
        this.commonService.notifier.notify('success', "Document Deleted Successfully.");
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    }, (error) => {
      console.log(error);
    });
  }

  statusStaffmaster(paramsObj) {

    let statusstaffmasterModelObj = {
      "_id": paramsObj.id,
      "status": paramsObj.status
    };

    this.adminLayoutService.StatusStaff(statusstaffmasterModelObj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.submittedStaffData = false;
        this.getStaffList();
        this.defaultForm();
        this.ISeditStaff = false;
        this.ISviewStaff = false;
        if (paramsObj.status == 1) {
          this.commonService.notifier.notify("success", "Staff Actived Successfully.");
        }
        else {
          this.commonService.notifier.notify("success", "Staff Deactived Successfully.");
        }
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

      this.noData = true;
    } else {
      this.noData = false;
    }
  }
}
